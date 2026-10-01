(() => {
  const config = window.HTN_CONFIG || {};
  const apiBase = String(config.apiBase || '').replace(/\/$/, '');
  const status = document.getElementById('service-status');
  const summary = document.getElementById('board-summary');
  const list = document.getElementById('tests');

  const text = (value) => document.createTextNode(String(value ?? ''));
  const pill = (value) => {
    const el = document.createElement('span');
    el.className = 'pill';
    el.append(text(value));
    return el;
  };

  function renderTest(test) {
    const card = document.createElement('article');
    card.className = 'test-card';

    const title = document.createElement('h3');
    title.append(text(test.title || 'Untitled test'));

    const project = document.createElement('p');
    const strong = document.createElement('strong');
    strong.append(text(test.project_name || 'Project'));
    project.append(strong);
    if (test.project_description) project.append(text(' — ' + test.project_description));

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.append(
      pill((test.minutes_reward || 0) + ' Test Minutes'),
      pill((test.task_count || 0) + ' tasks'),
      pill((test.slots_remaining || 0) + ' slots left'),
      pill(test.mode || 'task')
    );
    for (const scope of (test.permissions || [])) meta.append(pill(scope));

    const instructions = document.createElement('p');
    instructions.append(text(test.instructions || 'No additional instructions.'));

    const actions = document.createElement('div');
    actions.className = 'actions';

    if (test.project_url) {
      const open = document.createElement('a');
      open.className = 'button';
      open.href = test.project_url;
      open.target = '_blank';
      open.rel = 'noopener noreferrer';
      open.textContent = 'View target';
      actions.append(open);
    }

    const claim = document.createElement('span');
    claim.className = 'muted';
    claim.textContent = 'Claiming opens after HTN sign-in is connected.';
    actions.append(claim);

    card.append(title, project, meta, instructions, actions);
    return card;
  }

  if (!apiBase) {
    status.textContent = 'Integration prototype · HTN service not configured';
    summary.textContent = 'No live tests are displayed until the real HTN API is connected.';
    return;
  }

  fetch(apiBase + '/api/public/tests', { headers: { accept: 'application/json' } })
    .then(async response => {
      if (!response.ok) throw new Error('feed_http_' + response.status);
      return response.json();
    })
    .then(feed => {
      if (!feed || feed.schema !== 'human-test-public-feed/v1' || !Array.isArray(feed.tests)) {
        throw new Error('unexpected_feed_schema');
      }
      status.textContent = 'Human Test Network connected';
      summary.textContent = feed.tests.length
        ? feed.tests.length + ' open test' + (feed.tests.length === 1 ? '' : 's')
        : 'No open tests right now.';
      list.replaceChildren(...feed.tests.map(renderTest));
    })
    .catch(error => {
      status.textContent = 'HTN connection unavailable';
      summary.textContent = 'The live feed could not be loaded. No fallback or fake tests are shown.';
      console.warn('Human Testing Lab feed:', error);
    });
})();
