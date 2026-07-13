const SITUATION_IDS = ["healthcare", "shelter", "work", "care", "forgiveness"];
const ANSWERS = new Set(["yes", "no", "depends"]);
const REASONS = {
  healthcare: new Set(["urgency", "existing-help", "capacity"]),
  shelter: new Set(["danger", "existing-shelter", "sustainable-help"]),
  work: new Set(["duration", "options", "lasting-help"]),
  care: new Set(["safe-capacity", "help-coming", "afterward"]),
  forgiveness: new Set(["harm", "repair", "risk"])
};

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer"
};

export async function onRequestGet(context) {
  const db = context.env.WHAT_CHANGED_DB;
  if (!db) return json({ ok: true, available: false, totalCrossings: 0, situations: [] });

  try {
    const totalRow = await db.prepare("SELECT value FROM what_changed_meta WHERE key = 'total_crossings'").first();
    const result = await db.prepare(`
      SELECT situation_id, total, steady, moved, condition_moved,
             first_yes, first_no, first_depends,
             second_yes, second_no, second_depends
      FROM what_changed_situation_stats
      ORDER BY CASE situation_id
        WHEN 'healthcare' THEN 1
        WHEN 'shelter' THEN 2
        WHEN 'work' THEN 3
        WHEN 'care' THEN 4
        WHEN 'forgiveness' THEN 5
        ELSE 99 END
    `).all();

    return json({
      ok: true,
      available: true,
      totalCrossings: Number(totalRow?.value || 0),
      situations: (result.results || []).map(normalizeRow)
    });
  } catch (error) {
    return json({ ok: false, available: false, error: "aggregate-read-failed" }, 503);
  }
}

export async function onRequestPost(context) {
  const db = context.env.WHAT_CHANGED_DB;
  if (!db) return json({ ok: false, available: false, error: "database-not-bound" }, 503);

  let body;
  try {
    const contentLength = Number(context.request.headers.get("content-length") || 0);
    if (contentLength > 12_000) return json({ ok: false, error: "payload-too-large" }, 413);
    body = await context.request.json();
  } catch {
    return json({ ok: false, error: "invalid-json" }, 400);
  }

  const validation = validatePayload(body);
  if (!validation.ok) return json({ ok: false, error: validation.error }, 400);

  const statements = [
    db.prepare(`
      INSERT INTO what_changed_meta (key, value)
      VALUES ('total_crossings', 1)
      ON CONFLICT(key) DO UPDATE SET value = value + 1
    `)
  ];

  for (const pair of body.pairs) {
    const steady = pair.firstAnswer === pair.secondAnswer &&
      (pair.firstAnswer !== "depends" || pair.firstReason === pair.secondReason);
    const conditionMoved = pair.firstAnswer === "depends" && pair.secondAnswer === "depends" && pair.firstReason !== pair.secondReason;
    const moved = !steady;

    statements.push(db.prepare(`
      INSERT INTO what_changed_situation_stats (
        situation_id, total, steady, moved, condition_moved,
        first_yes, first_no, first_depends,
        second_yes, second_no, second_depends
      ) VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(situation_id) DO UPDATE SET
        total = total + 1,
        steady = steady + excluded.steady,
        moved = moved + excluded.moved,
        condition_moved = condition_moved + excluded.condition_moved,
        first_yes = first_yes + excluded.first_yes,
        first_no = first_no + excluded.first_no,
        first_depends = first_depends + excluded.first_depends,
        second_yes = second_yes + excluded.second_yes,
        second_no = second_no + excluded.second_no,
        second_depends = second_depends + excluded.second_depends
    `).bind(
      pair.situationId,
      steady ? 1 : 0,
      moved ? 1 : 0,
      conditionMoved ? 1 : 0,
      pair.firstAnswer === "yes" ? 1 : 0,
      pair.firstAnswer === "no" ? 1 : 0,
      pair.firstAnswer === "depends" ? 1 : 0,
      pair.secondAnswer === "yes" ? 1 : 0,
      pair.secondAnswer === "no" ? 1 : 0,
      pair.secondAnswer === "depends" ? 1 : 0
    ));

    for (const pass of ["first", "second"]) {
      const answer = pair[`${pass}Answer`];
      const reason = pair[`${pass}Reason`];
      if (answer !== "depends" || !reason) continue;
      statements.push(db.prepare(`
        INSERT INTO what_changed_reason_stats (situation_id, pass, reason_id, count)
        VALUES (?, ?, ?, 1)
        ON CONFLICT(situation_id, pass, reason_id) DO UPDATE SET count = count + 1
      `).bind(pair.situationId, pass, reason));
    }
  }

  try {
    await db.batch(statements);
    return json({ ok: true, stored: "aggregate-counters-only" }, 201);
  } catch (error) {
    return json({ ok: false, error: "aggregate-write-failed" }, 503);
  }
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: { "allow": "GET, POST, OPTIONS" } });
}

function validatePayload(body) {
  if (!body || typeof body !== "object") return { ok: false, error: "invalid-payload" };
  if (!Array.isArray(body.pairs) || body.pairs.length !== SITUATION_IDS.length) return { ok: false, error: "invalid-pairs" };

  const seen = new Set();
  for (const pair of body.pairs) {
    if (!pair || typeof pair !== "object") return { ok: false, error: "invalid-pair" };
    if (!SITUATION_IDS.includes(pair.situationId) || seen.has(pair.situationId)) return { ok: false, error: "invalid-situation" };
    seen.add(pair.situationId);

    if (!ANSWERS.has(pair.firstAnswer) || !ANSWERS.has(pair.secondAnswer)) return { ok: false, error: "invalid-answer" };

    for (const pass of ["first", "second"]) {
      const answer = pair[`${pass}Answer`];
      const reason = pair[`${pass}Reason`];
      if (answer === "depends") {
        if (!REASONS[pair.situationId].has(reason)) return { ok: false, error: "invalid-reason" };
      } else if (reason !== null && reason !== undefined) {
        return { ok: false, error: "unexpected-reason" };
      }
    }
  }

  return { ok: seen.size === SITUATION_IDS.length, error: "missing-situation" };
}

function normalizeRow(row) {
  return {
    situationId: row.situation_id,
    total: Number(row.total || 0),
    steady: Number(row.steady || 0),
    moved: Number(row.moved || 0),
    conditionMoved: Number(row.condition_moved || 0),
    first: {
      yes: Number(row.first_yes || 0),
      no: Number(row.first_no || 0),
      depends: Number(row.first_depends || 0)
    },
    second: {
      yes: Number(row.second_yes || 0),
      no: Number(row.second_no || 0),
      depends: Number(row.second_depends || 0)
    }
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}
