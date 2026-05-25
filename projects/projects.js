let allProjects=[];
const grid=document.getElementById('grid');
const empty=document.getElementById('empty');
const filters=[...document.querySelectorAll('.filter')];
function esc(s){return String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));}
function bucket(p){const s=(p.status||'').toLowerCase();if(s.includes('live'))return'live';if(s.includes('planned')||s.includes('empty'))return'planned';return'source'}
function render(mode='all'){
 const items=mode==='all'?allProjects:allProjects.filter(p=>bucket(p)===mode);
 empty.hidden=items.length>0;
 grid.innerHTML=items.map(p=>{
 const b=bucket(p);
 const launch=p.launch||p.repo||'#';
 const repo=p.repo||'';
 return `<article class="card"><div><div class="meta"><span class="pill ${b}">${esc(p.status||b)}</span><span class="pill">${esc(p.type||'project')}</span></div><h2>${esc(p.title||p.id)}</h2><p class="desc">${esc(p.description||'')}</p></div><div class="actions"><a class="btn primary" href="${esc(launch)}" target="_blank">${b==='live'?'Open live':'Open'}</a>${repo?`<a class="btn" href="${esc(repo)}" target="_blank">Source</a>`:''}</div></article>`;
 }).join('');
}
filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(b=>b.classList.remove('active'));btn.classList.add('active');render(btn.dataset.filter)}));
async function init(){try{const res=await fetch('/registry/projects.json',{cache:'no-store'});const data=await res.json();allProjects=data.items||[];render('all')}catch(e){empty.hidden=false;empty.textContent='Could not load registry/projects.json';}}
init();
