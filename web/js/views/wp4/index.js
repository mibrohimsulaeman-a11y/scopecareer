import {Store} from '../../core/store.js';
import {Actions} from '../../core/actions.js';
import {Copy} from '../../core/copy.js';
import {badge,emptyState,section} from '../../ui/components.js';
import * as F from '../../../fixtures/wp4/index.js';

const routes=[];
let root=null;
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function ensureData(){
  if(Store.get('wp4Ready'))return;
  Store.set('strategySignals',structuredClone(F.strategySignals));
  for(const e of F.experiments)Store.set(`experiment.${e.id}`,structuredClone(e));
  Store.set('companies',structuredClone(F.companies));
  Store.set('sensitivityFields',structuredClone(F.sensitivityFields));
  Store.set('settings',{stealth:true,exported:false,deleteRequested:false});
  Store.set('wp4Ready',true);
}
function shell(content,{activeNav}={}){
  const nav=l=>`<button class="nav-item ${activeNav===l?'active':''}" data-nav="${l}">${l[0].toUpperCase()+l.slice(1)}</button>`;
  return `<div class="app-shell"><aside class="sidebar"><div class="brand">ScopeCareer</div><nav>
    ${nav('briefing')}${nav('opportunities')}${nav('career')}${nav('strategy')}${nav('settings')}
  </nav></aside><main class="main"><div class="view active">${content}</div></main></div>`;
}

/* ---------- Strategy intelligence ---------- */
function renderStrategy(){
  ensureData();
  const signals=Store.get('strategySignals').map(sig=>`<div class="card card-pad" style="margin-bottom:10px" data-signal="${sig.id}">
    <strong>${h(sig.title)}</strong> <span class="badge estimate" data-confidence>${h(sig.confidence)}</span>
    <div class="action-note" data-framing>${h(sig.framing)} · sample: ${sig.sample.applied??sig.sample.applications} applications · window: ${h(sig.window)}</div>
    <div class="action-note">${h(sig.note)}</div>
  </div>`).join('');
  const exps=Object.values(Store.get('experiment')||{}).map(e=>{
    const st=e.dims.strategy_experiment_state;
    return `<div class="card card-pad" style="margin-bottom:8px" data-experiment="${e.id}">
      <strong>${h(e.hypothesis)}</strong> ${badge(st==='active'?'confirmed':st==='draft'?'estimate':'open')}
      <div class="action-note">Scope: ${h(e.scope)} · state: ${Copy.dim('strategy_experiment_state',st)}</div>
      <div class="actions">
        ${st==='draft'?`<button class="btn primary" data-run="ACT-STRATEGY-EXPERIMENT-ACTIVATE" data-entity="${e.id}">Activate experiment</button>`:''}
        ${st==='active'?`<button class="btn quiet" data-run="ACT-STRATEGY-EXPERIMENT-PAUSE" data-entity="${e.id}">Pause</button><span class="badge confirmed">Active</span>`:''}
      </div>
    </div>`;
  }).join('');
  root.innerHTML=shell(`<div class="topbar"><h1>Career Strategy Intelligence</h1></div>
    <p class="action-note" data-signal-disclaimer>Signals are preliminary observations with visible sample sizes. They are not prescriptions.</p>
    ${signals||emptyState('No signals yet.')}
    ${section('Experiments',`${exps}<div class="actions">
      <input placeholder="New hypothesis…" style="flex:1;padding:8px;border:1px solid var(--line);border-radius:6px" data-new-hypothesis>
      <input placeholder="Scope (roles · geographies)" style="flex:1;padding:8px;border:1px solid var(--line);border-radius:6px" data-new-scope>
      <button class="btn" id="addExperiment">Create experiment</button></div>`)}
  `,{activeNav:'strategy'});
  root.querySelectorAll('[data-run]').forEach(b=>b.onclick=async()=>{
    await Actions.run(b.dataset.run,{entityId:b.dataset.entity});renderStrategy();
  });
  root.querySelector('#addExperiment').onclick=async()=>{
    const hy=root.querySelector('[data-new-hypothesis]').value.trim();
    if(!hy)return;
    const e={id:`exp_${Date.now()}`,hypothesis:hy,scope:root.querySelector('[data-new-scope]').value.trim()||'Unscoped',dims:{strategy_experiment_state:'draft'}};
    Store.set(`experiment.${e.id}`,e);
    Store.log('strategy_experiment_created',{experiment_id:e.id});
    renderStrategy();
  };
}

/* ---------- Settings ---------- */
function renderPrivacy(){
  ensureData();
  const fields=Store.get('sensitivityFields').map(f=>`<div class="brief-line" data-field="${f.id}">
    <span>${h(f.label)}</span>
    <span><select data-level="${f.id}" style="padding:6px;border:1px solid var(--line);border-radius:6px">
      ${['public','career','sensitive','highly_confidential'].map(l=>`<option value="${l}" ${f.level===l?'selected':''}>${l.replace('_',' ')}</option>`).join('')}
    </select></span>
  </div>`).join('');
  const st=Store.get('settings');
  root.innerHTML=shell(`<div class="topbar"><h1>Privacy — Career Data Vault</h1></div>
    ${section('Field sensitivity',fields)}
    ${section('Stealth mode',`<label style="display:block;margin:8px 0"><input type="checkbox" id="stealthToggle" ${st.stealth?'checked':''}> Discreet notifications (no company names or match scores on lock screens)</label>
      <div data-stealth-preview style="margin-top:8px">${F.stealthSamples.map(s=>`<div class="brief-line"><span style="color:var(--open-700)">${h(s.bad)}</span><strong>→ ${st.stealth?h(s.good):h(s.bad)}</strong></div>`).join('')}</div>`)}
    ${section('Data rights',`<div class="actions">
      <button class="btn" id="exportBtn" data-export>Export my data (JSON)</button>
      <button class="btn danger" id="deleteBtn" data-delete-request>Delete everything…</button>
      ${st.deleteRequested?'<span class="badge open" data-delete-pending>Cancellation window active — nothing deleted yet</span>':''}
    </div>`)}
  `,{activeNav:'settings'});
  root.querySelectorAll('[data-level]').forEach(sel=>sel.onchange=()=>{
    const fields=Store.get('sensitivityFields');const f=fields.find(x=>x.id===sel.dataset.level);
    if(f){f.level=sel.value;Store.log('sensitivity_changed',{field:f.id,level:sel.value})}
  });
  root.querySelector('#stealthToggle').onchange=e=>{Store.set('settings.stealth',e.target.checked);renderPrivacy()};
  root.querySelector('#exportBtn').onclick=()=>{Store.set('settings.exported',true);Store.log('data_export_simulated',{});root.querySelector('[data-export]').textContent='Export ready (simulated)'};
  root.querySelector('#deleteBtn').onclick=()=>{
    if(Store.get('settings.deleteRequested')){Store.set('settings.deleteRequested',false);Store.set('settings.deleted',true);Store.log('delete_confirmed_simulated',{});}
    else{Store.set('settings.deleteRequested',true);Store.log('delete_requested_cancellation_window',{});}
    renderPrivacy();
  };
}
function renderAudit(){
  ensureData();
  const evts=window.__scopeCareerValidationLog.events.filter(e=>e.type==='action_executed').slice(-30).reverse();
  const rows=evts.map(e=>`<tr><td>${e.t_ms}ms</td><td><code>${h(e.canonical_action)}</code></td><td>${e.external_effect===false?'internal only':'external'}</td><td>${h(JSON.stringify(e.transitions||[]))}</td></tr>`).join('');
  root.innerHTML=shell(`<div class="topbar"><h1>Audit — AI & action provenance</h1></div>
    <table class="tradeoff-table" data-audit-table><thead><tr><th>When</th><th>Canonical action</th><th>Effect class</th><th>Transitions</th></tr></thead><tbody>${rows||'<tr><td colspan=4>No actions yet.</td></tr>'}</tbody></table>
    <p class="action-note">Every canonical action is recorded with its state transitions and effect class. External-effect actions require explicit authorization and never occur in this build.</p>
  `,{activeNav:'settings'});
}
function renderData(){
  ensureData();
  const counts={opportunities:Object.keys(Store.get('opportunities')||{}).length,claims:(Store.get('careerClaims')||[]).length,people:Object.keys(Store.get('people')||{}).length};
  root.innerHTML=shell(`<div class="topbar"><h1>My data</h1></div>
    <div class="card card-pad" data-data-summary>
      ${Object.entries(counts).map(([k,v])=>`<div class="brief-line"><span>${k}</span><strong>${v}</strong></div>`).join('')}
      <p class="action-note">You own this data. Export and deletion are available under Privacy at any time.</p>
    </div>`,{activeNav:'settings'});
}
/* ---------- Market contextual mode ---------- */
function renderMarket(){
  ensureData();
  const cos=Store.get('companies').map(c=>`<div class="card card-pad" style="margin-bottom:8px" data-company="${c.id}">
    <div style="display:flex;justify-content:space-between"><strong>${h(c.name)}</strong>${c.watch?'<span class="badge confirmed" data-watching>Watching</span>':'<button class="btn quiet" data-watch="'+c.id+'">Watch</button>'}</div>
    <div class="action-note">${h(c.industry)} · signal: ${h(c.signal)}</div>
  </div>`).join('');
  root.innerHTML=shell(`<div class="topbar"><h1>Market targets</h1><a class="btn quiet" href="#/opportunities" data-back-link>← Opportunities</a></div>
    <p class="action-note">Target companies and signals live inside the Opportunities context. Market research never contacts anyone.</p>${cos}`,{activeNav:'opportunities'});
  root.querySelectorAll('[data-watch]').forEach(b=>b.onclick=()=>{
    const list=Store.get('companies');const c=list.find(x=>x.id===b.dataset.watch);
    if(c){c.watch=true;Store.log('company_watch_started',{company_id:c.id});renderMarket();}
  });
}

function renderSettingsHub(){
  root.innerHTML=shell(`<div class="topbar"><h1>Settings</h1></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px">
      <a class="card card-pad" href="#/settings/privacy"><strong>Privacy — Data Vault</strong><p class="action-note">Field sensitivity, stealth mode, export & deletion.</p></a>
      <a class="card card-pad" href="#/settings/audit"><strong>Audit</strong><p class="action-note">Canonical actions, transitions and effect classes.</p></a>
      <a class="card card-pad" href="#/settings/data"><strong>My data</strong><p class="action-note">What the platform holds about you.</p></a>
    </div>`,{activeNav:'settings'});
}
routes.push(
  {id:'settings',path:'settings',clients:['web'],async mount(ctx){root=ctx.root;renderSettingsHub()}},
  {id:'strategy',path:'strategy',clients:['web'],async mount(ctx){root=ctx.root;renderStrategy()}},
  {id:'settings-privacy',path:'settings/privacy',clients:['web'],async mount(ctx){root=ctx.root;renderPrivacy()}},
  {id:'settings-audit',path:'settings/audit',clients:['web'],async mount(ctx){root=ctx.root;renderAudit()}},
  {id:'settings-data',path:'settings/data',clients:['web'],async mount(ctx){root=ctx.root;renderData()}},
  {id:'market',path:'market',clients:['web','pwa'],async mount(ctx){root=ctx.root;renderMarket()}}
);
export {routes};
