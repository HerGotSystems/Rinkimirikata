(() => {
  "use strict";
  const D = window.WhatChangedData;
  const API = "/api/what-changed";
  const KEY = `what-changed:${D.version}:session`;
  const SENT = `what-changed:${D.version}:submitted`;
  const stage = document.querySelector("#stage");
  const progress = document.querySelector("#progress");
  const status = document.querySelector("#status");
  const dialog = document.querySelector("#infoDialog");
  const answers = ["yes", "no", "depends"];
  const notes = ["the need is enough", "your boundary remains", "finish the condition"];
  const state = load() || { screen: "departure", sceneIndex: 0, responses: {}, population: null };

  document.querySelector("#openInfo").onclick = () => dialog.showModal();
  document.querySelector("#closeInfo").onclick = () => dialog.close();
  document.querySelector("#closeInfoBottom").onclick = () => dialog.close();
  render();

  function render() {
    drawProgress();
    if (state.screen === "departure") return departure();
    if (state.screen === "crossing") return scene();
    mirror();
  }

  function departure() {
    stage.innerHTML = `<article class="scene">
      <p class="scene-kicker">An Omnunity crossing</p>
      <h1>WHAT<br>CHANGED?</h1>
      <p class="scene-copy">The light behind you has already gone. The crossing is black except for the broken shine of the moon. Something moves under the boards. Ahead, the far shore is only a darker line.</p>
      <p class="scene-note">Five needs will meet you twice. No score. No ideology. Only the answers you carry from one face to another.</p>
      <div class="actions"><button class="action-button" data-start>stay with the current<small>the crossing is already moving</small></button></div>
    </article>`;
    stage.querySelector("[data-start]").onclick = () => {
      state.screen = "crossing";
      state.sceneIndex = 0;
      save();
      change(render);
    };
  }

  function scene() {
    const s = D.scenes[state.sceneIndex];
    const existing = state.responses[s.id];
    stage.innerHTML = `<article class="scene" data-scene="${s.id}">
      <p class="scene-kicker">${esc(s.kicker)} · ${state.sceneIndex + 1} of ${D.scenes.length}</p>
      <h2>${esc(s.title)}</h2>
      <p class="scene-copy">${esc(s.copy)}</p>
      <div class="actions">${answers.map((a, i) => `<button class="action-button" data-answer="${a}">${esc(s.actions[i])}<small>${notes[i]}</small></button>`).join("")}</div>
      <div id="reasonArea"></div>
      <div class="scene-tools">${state.sceneIndex ? '<button class="quiet-button" data-back>← return one station</button>' : '<span></span>'}${existing ? '<span class="scene-note">an answer is already carried here</span>' : '<span></span>'}</div>
    </article>`;
    stage.querySelectorAll("[data-answer]").forEach(b => b.onclick = () => choose(b.dataset.answer));
    stage.querySelector("[data-back]")?.addEventListener("click", back);
    if (existing?.answer === "depends") reasons(existing.reason);
  }

  function choose(answer) {
    const s = D.scenes[state.sceneIndex];
    if (answer === "depends") {
      state.responses[s.id] = { answer, reason: null };
      save();
      reasons(null);
      status.textContent = "Choose what your answer depends on.";
    } else {
      state.responses[s.id] = { answer, reason: null };
      save();
      next();
    }
  }

  function reasons(selected) {
    const s = D.scenes[state.sceneIndex];
    const items = D.situations[s.situationId].reasons;
    const area = document.querySelector("#reasonArea");
    area.innerHTML = `<div class="reason-wrap"><p class="reason-lead">It depends on—</p><div class="reason-list">${items.map(([id, text]) => `<button class="reason-button" data-reason="${id}" ${selected === id ? 'aria-current="true"' : ""}>${esc(text)}</button>`).join("")}</div></div>`;
    area.querySelectorAll("[data-reason]").forEach(b => b.onclick = () => {
      state.responses[s.id] = { answer: "depends", reason: b.dataset.reason };
      save();
      next();
    });
    area.querySelector("button")?.focus();
  }

  function next() {
    if (state.sceneIndex < D.scenes.length - 1) {
      state.sceneIndex++;
      save();
      return change(render);
    }
    state.screen = "mirror";
    save();
    change(() => {
      render();
      submit();
      population();
    });
  }

  function back() {
    if (!state.sceneIndex) return;
    state.sceneIndex--;
    save();
    change(render);
  }

  function mirror() {
    const items = buildMirror();
    stage.innerHTML = `<section class="mirror" aria-labelledby="mirrorTitle">
      <div class="mirror-head"><div><p class="eyebrow">The far shore</p><h1 id="mirrorTitle" class="mirror-title">SAME GROUND.</h1><p class="mirror-sub">Five needs. Two faces each. Here is where your answer held — and where it moved. This is not a grade.</p></div><div class="mirror-count">personal mirror<br>not a score</div></div>
      <div class="mirror-list">${items.map(card).join("")}</div>
      <p class="question-line">The need stayed the same.<br>What changed your answer?</p>
      <section id="population" class="population" aria-live="polite">${populationHTML()}</section>
      <div class="ending-copy"><p>Labels help us describe the world. Sometimes they also change what we believe another person deserves.</p><p>You crossed the same needs wearing different faces. Some of your answers stayed standing. Some moved.</p><p>Nothing here decided who you are. It only showed where your answer changed.</p></div>
      <div class="final-actions"><a class="link-button" href="https://omnunity.com">See what we may already share.</a><button class="text-button" data-restart>cross again</button></div>
    </section>`;
    stage.querySelector("[data-restart]").onclick = restart;
  }

  function buildMirror() {
    return Object.entries(D.situations).map(([id, meta]) => {
      const pair = D.scenes.filter(s => s.situationId === id);
      const a = state.responses[pair.find(s => s.pass === "first").id];
      const b = state.responses[pair.find(s => s.pass === "second").id];
      if (!a || !b) return { title: meta.title, kind: "moved", state: "The crossing is incomplete.", detail: "Return and answer both faces of this need." };
      if (a.answer === b.answer && a.answer !== "depends") {
        return { title: meta.title, kind: "steady", state: a.answer === "yes" ? "You opened the same door both times." : "You kept the same boundary both times.", detail: `For you, ${meta.need} did not move when ${meta.labelChange}.` };
      }
      if (a.answer === "depends" && b.answer === "depends") {
        const ar = reason(meta, a.reason), br = reason(meta, b.reason);
        if (a.reason === b.reason) return { title: meta.title, kind: "steady", state: "You kept the same condition both times.", detail: `Both answers depended on ${ar}. The changed face did not change the condition.` };
        return { title: meta.title, kind: "moved", state: "The answer stayed conditional. The condition moved.", detail: `It changed from ${ar} to ${br} when ${meta.labelChange}.` };
      }
      return { title: meta.title, kind: "moved", state: `${label(a.answer)} became ${label(b.answer)}.`, detail: `The only deliberate change was that ${meta.labelChange}.` };
    });
  }

  function card(x) {
    return `<article class="mirror-card ${x.kind}"><h3>${esc(x.title)} · ${x.kind === "steady" ? "held" : "moved"}</h3><p class="mirror-state">${esc(x.state)}</p><p class="mirror-detail">${esc(x.detail)}</p></article>`;
  }

  function payload() {
    return { version: D.version, pairs: Object.keys(D.situations).map(id => {
      const pair = D.scenes.filter(s => s.situationId === id);
      const a = state.responses[pair.find(s => s.pass === "first").id];
      const b = state.responses[pair.find(s => s.pass === "second").id];
      return { situationId: id, firstAnswer: a.answer, secondAnswer: b.answer, firstReason: a.reason || null, secondReason: b.reason || null };
    }) };
  }

  async function submit() {
    if (localStorage.getItem(SENT) === "1" || Object.keys(state.responses).length !== D.scenes.length) return;
    try {
      const r = await fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload()), keepalive: true });
      const data = await r.json().catch(() => null);
      if (r.ok && data?.ok) localStorage.setItem(SENT, "1");
    } catch {}
  }

  async function population() {
    try {
      const r = await fetch(API, { headers: { accept: "application/json" } });
      const data = await r.json();
      if (!r.ok || !data?.ok) return;
      state.population = data;
      save();
      const el = document.querySelector("#population");
      if (el) el.innerHTML = populationHTML();
    } catch {}
  }

  function populationHTML() {
    const p = state.population;
    if (!p?.available) return `<h3>Shared pattern</h3><p>You are helping establish the first public baseline. Shared patterns will appear once enough complete crossings exist to describe them honestly.</p>`;
    if ((p.totalCrossings || 0) < D.threshold) return `<h3>Shared pattern</h3><p><strong>${p.totalCrossings || 0}</strong> complete crossing${p.totalCrossings === 1 ? "" : "s"} so far. Population patterns unlock at ${D.threshold}. No placeholder percentage is shown before then.</p>`;
    const rows = (p.situations || []).map(x => {
      const pct = x.total ? Math.round(x.steady / x.total * 100) : 0;
      return `<div class="population-row"><span class="population-label">${esc(D.situations[x.situationId]?.title || x.situationId)}</span><span class="population-bar"><span class="population-fill" style="width:${pct}%"></span></span><span class="population-value">${pct}% held · n=${x.total}</span></div>`;
    }).join("");
    return `<h3>Shared pattern</h3><p>Among <strong>${p.totalCrossings}</strong> completed crossings, this is how often each answer pattern held steady across both faces.</p><div class="population-grid">${rows}</div>`;
  }

  function drawProgress() {
    if (state.screen === "departure") return void (progress.innerHTML = "");
    if (state.screen === "mirror") {
      progress.innerHTML = D.scenes.map(() => '<span class="progress-dot done"></span>').join("");
      progress.setAttribute("aria-label", "Crossing complete");
      return;
    }
    progress.innerHTML = D.scenes.map((_, i) => `<span class="progress-dot ${i < state.sceneIndex ? "done" : i === state.sceneIndex ? "current" : ""}"></span>`).join("");
    progress.setAttribute("aria-label", `Station ${state.sceneIndex + 1} of ${D.scenes.length}`);
  }

  function change(fn) {
    const el = stage.firstElementChild;
    if (!el) return fn();
    el.classList.add("leaving");
    setTimeout(fn, 260);
  }

  function restart() {
    sessionStorage.removeItem(KEY);
    Object.assign(state, { screen: "departure", sceneIndex: 0, responses: {}, population: null });
    save();
    change(render);
  }

  function reason(meta, id) { return meta.reasons.find(x => x[0] === id)?.[1] || "an unstated condition"; }
  function label(v) { return v === "yes" ? "Yes" : v === "no" ? "No" : "It depends"; }
  function save() { sessionStorage.setItem(KEY, JSON.stringify(state)); }
  function load() { try { return JSON.parse(sessionStorage.getItem(KEY)); } catch { return null; } }
  function esc(v) { return String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
})();
