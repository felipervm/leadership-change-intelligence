'use strict';
const $ = id => document.getElementById(id);
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const model = JSON.parse($('embedded-case').textContent);
const comparisonCase = JSON.parse($('embedded-comparison').textContent);
const transitions = model.case.changes.filter(e => e.transition_status === 'acting_to_director_confirmed');
const newRole = model.case.changes.find(e => e.type === 'new_role');
const sources = new Map(model.case.sources.map(s => [s.id, s]));
let observation = 'after', eventType = 'status', ordering = 'fifo';
const externalLink = (url, label, classes = 'source-link') => `<a class="${classes}" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)} ↗</a>`;

function renderObservation(next) {
  observation = next;
  const after = next === 'after';
  const source = sources.get(after ? 'FDA-SEP20' : 'FDA-AUG30');
  $('comparison').dataset.observation = next;
  $('show-before').setAttribute('aria-pressed', String(!after));
  $('show-after').setAttribute('aria-pressed', String(after));
  // Identity nodes remain in place. Only the appointment-qualifier state and citation change.
  document.querySelectorAll('.leader-row').forEach(row => {
    row.querySelector('.status-name').setAttribute('aria-label', after ? 'Director, later documented status' : 'Acting Director, earlier documented status');
    row.querySelector('.observation-source').href = source.url;
    row.querySelector('.observation-source').setAttribute('aria-label', `${row.dataset.person}: ${after ? 'later' : 'earlier'} FDA calendar source`);
  });
  $('observation-note').textContent = after ? 'LATER FDA CALENDAR / SEPTEMBER 20–26, 2026' : 'EARLIER FDA CALENDAR / AUGUST 30–SEPTEMBER 5, 2026';
  $('change-key-label').textContent = after ? 'Qualifier removed. Identity retained.' : 'Acting qualifier documented.';
}

function renderLeaders() {
  $('leader-rows').innerHTML = transitions.map(e => {
    const initials = e.person.split(' ').map(n => n[0]).join('');
    const unit = (e.unit.match(/\(([^)]+)\)/) || [null, e.unit])[1];
    return `<article class="leader-row" data-person="${esc(e.person)}"><div class="leader-identity"><span class="identity-mark" aria-hidden="true">${esc(initials)}</span><div><h3>${esc(e.person)}</h3><p>${esc(unit)}</p></div></div><div class="leader-status"><div class="status-name" role="group" aria-label="Director, later documented status"><span aria-hidden="true"><span class="qualifier">ACTING</span><span class="status-director">DIRECTOR</span></span></div><a class="source-link observation-source" target="_blank" rel="noopener" href="${esc(sources.get('FDA-SEP20').url)}">Source ↗</a></div></article>`;
  }).join('');
  $('new-role-source').href = sources.get('HHS-SEP08').url;
  renderObservation('after');
}

const smallVisuals = {
  status: '<svg viewBox="0 0 150 100"><circle cx="75" cy="50" r="28"/><text x="75" y="47">ACTING</text><text x="75" y="61">DIRECTOR</text><path d="M45 50H10m94 0h35"/><path d="M57 42h36" style="stroke:#59c4d4;stroke-dasharray:none"/></svg>',
  role: '<svg viewBox="0 0 150 100"><rect class="ghost" x="8" y="30" width="45" height="40"/><path d="M54 50h25"/><rect x="82" y="23" width="60" height="54"/><text x="112" y="47">NEW</text><text x="112" y="61">ROLE +</text></svg>',
  membership: '<svg viewBox="0 0 150 100"><path d="M30 25h90v50H30z"/>' + Array.from({length:8}, (_, i) => `<circle cx="${30+(i%4)*30}" cy="${i<4?25:75}" r="7" class="${i===0?'bright':''}"/>`).join('') + '<text x="75" y="53">8 ADDITIONS</text></svg>'
};

function getWorkflow(type) {
  if (type === 'status') return {
    title: 'Acting → Director', example: `${transitions.length} FDA leaders / same identities.`, source: sources.get('HHS-SEP08').url,
    checks: ['Verify the appointment qualifier.', 'Preserve the previous status.', 'Record supporting evidence.'],
    fields: [['Scope', `${transitions.length} FDA directors`], ['Change', 'Acting → Director'], ['Effective date', 'Unknown'], ['Evidence', 'Earlier + later FDA calendars']],
    caveat: 'Proposed verification path. The observed transition window does not establish an exact effective date.',
    detail: `<p>${esc(model.case.research_finding)}</p><ul>${transitions.map(e => `<li><strong>${esc(e.person)}</strong> — ${esc(e.unit)}. ${esc(e.unresolved)}</li>`).join('')}</ul><p>${externalLink(sources.get('FDA-AUG30').url,'Earlier calendar')} · ${externalLink(sources.get('HHS-SEP08').url,'Selection announcement')} · ${externalLink(sources.get('FDA-SEP20').url,'Later calendar')}</p>`
  };
  if (type === 'role') return {
    title: 'A newly created role.', example: newRole.person + ' / FDA Technology & AI.', source: sources.get('HHS-SEP08').url,
    checks: ["Verify the role’s creation.", 'Confirm organizational placement.', 'Leave unverified reporting links unresolved.'],
    fields: [['Person', newRole.person], ['Placement', newRole.unit], ['Reports to', 'Unverified'], ['Effective date', 'Unknown']],
    caveat: 'New role ≠ acting-to-director transition. Organizational placement does not prove a direct reporting relationship.',
    detail: `<p><strong>${esc(newRole.role)}</strong></p><p>${esc(newRole.prior_status)} ${esc(newRole.unresolved)}</p><p>${esc(newRole.relationships.join('; '))}.</p><p>${externalLink(sources.get('HHS-SEP08').url,'Creation announcement')} · ${externalLink(sources.get('FDA-OCT13').url,'FDA organizational chart')}</p>`
  };
  if (type === 'membership') {
    const chair = comparisonCase.new_members.find(m => m.member_role === 'Chair');
    return {
      title: 'An addition. Not a replacement.', example: `${comparisonCase.new_members.length} USPSTF members / separate case.`, source: comparisonCase.source.url,
      checks: ['Confirm membership association.', 'Check the separate Chair designation.', 'Do not infer departures or replacements.'],
      fields: [['Scope', `${comparisonCase.new_members.length} incoming USPSTF members`], ['Named Chair', chair.person], ['Predecessors', 'Not established'], ['Effective dates', 'Unknown']],
      caveat: 'One primary announcement; no independent corroboration. These eight members are outside the FDA’s 12-task exercise.',
      detail: `<p>${esc(comparisonCase.note)}</p><ul class="member-list">${comparisonCase.new_members.map(m => `<li><span>${esc(m.person)}</span><small>${esc(m.member_role)}</small></li>`).join('')}</ul><p>Exact formal service start dates, predecessors, replacement relationships and existing profile states remain unverified.</p><p>${externalLink(comparisonCase.source.url, 'HHS / September 17, 2026')}</p>`
    };
  }
  throw new Error('Unknown event type');
}

const eventTabs = [...document.querySelectorAll('[data-event-type]')];
function showEvent(type, focus = false) {
  const current = getWorkflow(type);
  eventType = type;
  eventTabs.forEach(tab => { const active = tab.dataset.eventType === type; tab.setAttribute('aria-selected',String(active)); tab.tabIndex = active ? 0 : -1; });
  $('workflow').setAttribute('aria-labelledby','type-' + type);
  $('workflow').dataset.eventType = type;
  $('event-visual').innerHTML = smallVisuals[type];
  $('event-title').textContent = current.title;
  $('event-example').textContent = current.example;
  $('event-source').href = current.source;
  $('required-checks').innerHTML = current.checks.map(check => `<li>${esc(check)}</li>`).join('');
  $('record-fields').innerHTML = current.fields.map(([name,value]) => `<dt>${esc(name)}</dt><dd class="${value==='Unknown'||value==='Unverified'?'unknown':''}">${esc(value)}</dd>`).join('');
  $('workflow-caveat').textContent = current.caveat;
  $('event-detail-body').innerHTML = current.detail;
  $('event-detail').open = false;
  if (focus) $('type-' + type).focus();
}
eventTabs.forEach((tab, i) => {
  tab.addEventListener('click', () => showEvent(tab.dataset.eventType));
  tab.addEventListener('keydown', e => {
    let next = i;
    if (['ArrowRight','ArrowDown'].includes(e.key)) next = (i + 1) % eventTabs.length;
    else if (['ArrowLeft','ArrowUp'].includes(e.key)) next = (i + eventTabs.length - 1) % eventTabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = eventTabs.length - 1;
    else return;
    e.preventDefault(); showEvent(eventTabs[next].dataset.eventType, true);
  });
});

const documentLabels = {
  'FDA-AUG30': {date:'30 AUG–05 SEP', kind:'Earlier public calendar', note:'Davis, Mikhail and Koplow are listed as Acting Directors. This is a week-specific observation, not a formal appointment start date.'},
  'HHS-SEP08': {date:'08 SEP', kind:'Leadership announcement', note:'Names four FDA selections: three former Acting Directors and a newly created Deputy Commissioner role. Announcement date is not automatically the effective date.'},
  'FDA-SEP20': {date:'20–26 SEP', kind:'Later public calendar', note:'Lists the same three leaders as Directors, without the acting qualifier. Together with the earlier calendar, this supports a transition window.'},
  'FDA-OCT13': {date:'13 OCT', kind:'Organizational chart', note:'The page displayed October 13, 2026 in the research snapshot taken October 14. It supports current organizational placement in that snapshot; direct reporting edges remain unverified.'}
};
function documentMarkup(source, label, membership = false) {
  const date = membership ? source.published_on : source.date;
  const living = source.id === 'FDA-OCT13';
  const id = membership ? 'source-uspstf' : 'source-' + source.id.toLowerCase();
  return `<details class="document-record" id="${id}"><summary><time class="doc-date" datetime="${esc(date)}">${esc(label.date)}<small>2026</small></time><span class="doc-kind">${esc(label.kind)}</span><span class="doc-expand">OPEN +</span>${living?'<span class="living-badge">LIVING PAGE / SNAPSHOT CAVEAT</span>':''}</summary><div class="doc-body"><p>${esc(label.note)}</p>${source.note?`<p>${esc(source.note)}</p>`:''}${living?`<p>${esc(model.case.source_caveat)}</p>`:''}${externalLink(source.url,'OFFICIAL SOURCE')}</div></details>`;
}
function renderEvidence() {
  $('fda-sources').innerHTML = model.case.sources.map(s => documentMarkup(s,documentLabels[s.id])).join('');
  $('membership-source').innerHTML = documentMarkup(comparisonCase.source,{date:'17 SEP',kind:'Separate membership announcement',note:'Names eight incoming USPSTF members, including one Chair. This single announcement does not independently establish departures, replacements or formal service start dates. It is a separate event-pattern comparison, not part of the FDA queue.'},true);
}
function renderQueue(next) {
  ordering = next;
  const tasks = [...model.tasks].sort((a,b) => next==='priority' ? a.rank_priority-b.rank_priority : a.rank_fifo-b.rank_fifo);
  $('task-queue').innerHTML = tasks.map((t,i) => `<article class="queue-row" data-task="${esc(t.id)}"><span>${String(i+1).padStart(2,'0')}</span><div><strong>${esc(t.title)}</strong><small>${esc(t.person)}${next==='priority'?' / editorial score '+t.score:''}</small></div><p>${esc(t.why)}</p><span class="queue-status">${t.status==='confirmed'?'Source-supported':t.status==='partial'?'Partial':'Open research'}</span></article>`).join('');
  $('btn-priority').setAttribute('aria-pressed',String(next==='priority'));
  $('btn-fifo').setAttribute('aria-pressed',String(next==='fifo'));
  $('queue-label').textContent = next==='priority' ? 'EDITORIAL HEURISTIC / NO MEASURED TIME OR ERROR REDUCTION' : 'INGESTION ORDER / NOT A MEASURED BASELINE';
}
$('show-before').addEventListener('click', () => renderObservation('before'));
$('show-after').addEventListener('click', () => renderObservation('after'));
$('btn-priority').addEventListener('click', () => renderQueue('priority'));
$('btn-fifo').addEventListener('click', () => renderQueue('fifo'));
renderLeaders(); showEvent('status'); renderEvidence(); renderQueue('fifo');
document.body.dataset.ready = 'story-v1';

// Native modal semantics preserve focus containment, Escape and touch navigation.
const menu = $('site-menu'), menuButton = document.querySelector('.menu-toggle');
let focusBeforeMenu = null;
menuButton.addEventListener('click', () => { focusBeforeMenu=document.activeElement; menuButton.setAttribute('aria-expanded','true'); document.body.classList.add('menu-open'); menu.showModal(); });
document.querySelector('.menu-close').addEventListener('click', () => menu.close());
menu.addEventListener('close', () => { document.body.classList.remove('menu-open'); menuButton.setAttribute('aria-expanded','false'); focusBeforeMenu?.focus({preventScroll:true}); });
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { const target=document.querySelector(link.getAttribute('href')); menu.close(); if(target){target.tabIndex=-1;requestAnimationFrame(()=>target.focus({preventScroll:true}));} }));
const header = document.querySelector('.site-header'); let scrollFrame = false;
function updateHeader(){ header.classList.toggle('scrolled',scrollY>35);scrollFrame=false; }
window.addEventListener('scroll',()=>{if(!scrollFrame){scrollFrame=true;requestAnimationFrame(updateHeader);}},{passive:true});
window.addEventListener('pageshow',updateHeader);updateHeader();
