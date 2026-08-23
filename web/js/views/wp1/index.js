import {Store} from '../../core/store.js';
import {Actions} from '../../core/actions.js';
import {Copy} from '../../core/copy.js';
import {assertionRow,sourceTrail,badge,tradeoffTable,emptyState,section,guardrailNote,staleBanner,aiPending} from '../../ui/components.js';
import {extraBriefingEvents} from '../../../fixtures/wp1/index.js';

const h=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const routes=[];
let root=null,currentSeg='shortlist';
const $sel=()=>{const v=Store.get('ui.selectedOpportunityId');if(v)return v;
  const m=location.hash.match(/^#\/opportunities\/([^/?]+)/);return m?m[1]:undefined};
const opp=id=>Store.get(`opportunities.${id}`);
const opps=()=>Object.values(Store.get('opportunities')||{});
const disp=id=>Store.dims(id,'candidate_disposition');
const stateLabel=id=>Copy.dim('candidate_disposition',disp(id));
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1600)}

Actions.register('ACT-OPPORTUNITY-EXPLORE',p=>{Store.set(`ui.researchOpen.${p.opportunityId}`,true)});
Actions.register('ACT-MANDATE-EVIDENCE-BIND',p=>{
  const ids=Store.get('ui.selectedEvidence')||[];
  const o=opp(p.opportunityId);
  Store.set(`opportunities.${p.opportunityId}.bindings`,[...(o.bindings||[]),...ids.map(cid=>({claimId:cid,mandateFragmentId:'mf_apac_scale'}))]);
  return {truth_status_changed:false};
});

/* ---------- Briefing ---------- */
function renderBriefing(shell){
  const events=[...Store.get('briefingEvents'),...extraBriefingEvents].filter(Boolean);
  const groups=['Now','Due today','Tomorrow'];
  const content=`<div class="topbar"><h1>Briefing</h1><span class="count" data-briefing-count>${events.length} items need attention</span></div>`+
    groups.map(g=>{
      const items=events.filter(e=>e.group===g);
      if(!items.length)return '';
      return `<section class="detail-section"><h3>${g}</h3>${items.map(e=>`
        <div class="card card-pad" style="margin-bottom:10px" data-event="${e.id}">
          <div style="display:flex;justify-content:space-between;gap:12px"><strong data-event-kind>${h(e.kind)}</strong><span class="count">${h(e.time)}</span></div>
          <div style="margin-top:4px"><strong data-event-subject>${h(e.subject)}</strong> <span class="count">· ${h(e.sub||'')}</span></div>
          <div data-event-change style="margin-top:6px">${typeof e.change==='function'?e.change():h(e.change)}</div>
          <div class="action-note" style="margin-top:4px"><strong>${h(e.context||'')}</strong>${e.detail?` · ${h(e.detail)}`:''}</div>
          ${e.cta&&e.target?`<button class="text-btn" data-open-opp="${e.target}" data-event-id="${e.id}">${h(e.cta)} →</button>`:''}
        </div>`).join('')}</section>`;
    }).join('');
  root.innerHTML=shell(content,{activeNav:'briefing'});
  root.querySelectorAll('[data-open-opp]').forEach(b=>b.onclick=()=>{
    Store.log('briefing_event_opened',{event_id:b.dataset.eventId,target:b.dataset.openOpp});
    location.hash=`#/opportunities/${b.dataset.openOpp}`;
  });
}

/* ---------- Opportunities list + detail ---------- */
const SEGMENTS=[['shortlist','Shortlist'],['all','All'],['saved','Saved'],['review','Under review'],['active','Active'],['closed','Closed']];
function matchesSeg(o,seg){
  const s=disp(o.id);
  if(seg==='all')return true;
  if(seg==='shortlist')return !!o.shortlisted&&!['passed','closed'].includes(s);
  if(seg==='saved')return s==='watching';
  if(seg==='review')return s==='exploring';
  if(seg==='active')return s==='pursuing';
  if(seg==='closed')return ['passed','closed'].includes(s);
  return true;
}
function rowHtml(o){
  const sel=$sel()===o.id;
  return `<div class="card card-pad" style="margin-bottom:8px;${sel?'border-color:var(--accent-600);':''}cursor:pointer" data-row="${o.id}" role="button">
    <div style="display:flex;justify-content:space-between;gap:10px">
      <div><strong>${h(o.role)}</strong><div class="count">${h(o.company)} · ${h(o.location)}</div></div>
      <div style="text-align:right"><span class="badge ${disp(o.id)}" data-state-label>${stateLabel(o.id)}</span><br>
      <button class="btn quiet" data-pin="${o.id}" title="Toggle shortlist">${o.shortlisted?'★':'☆'}</button></div>
    </div>
    <div class="action-note" data-thesis>${h(o.decision)}</div>
    <div class="action-note">Route: ${h(o.routeShort)} · Updated ${h(o.updated)}</div>
    <label style="margin-top:6px;display:inline-block;font-size:12px"><input type="checkbox" data-compare="${o.id}"> Compare</label>
  </div>`;
}
function assertionsFor(o){
  if(o.confirmed)return{
    supported:[...(o.confirmed||[]),...(o.estimates||[])].map(x=>Store.get(`assertions.${x}`)).filter(Boolean),
    open:(o.open||[]).map(x=>Store.get(`assertions.${x}`)).filter(a=>a&&a.status!=='confirmed')
  };
  return{
    supported:(o.inlineFacts||[]).map(([l,v,st,src])=>({id:`f_${l}`,label:l,value:v,status:String(st).toLowerCase(),source:src})),
    open:(o.inlineOpen||[]).map(([l,v,imp])=>({id:`u_${l}`,label:l,value:v,status:'open',source:'No direct evidence',impact:imp}))
  };
}
function detailHtml(id){
  const o=opp(id);if(!o)return emptyState('Select an opportunity.');
  const d=o.dims,{supported,open}=assertionsFor(o);
  const supHtml=supported.map(assertionRow).join('')||emptyState('No confirmed evidence yet.');
  const openHtml=open.length?open.map(assertionRow).join(''):'<div class="action-note">None open in the current evidence snapshot.</div>';
  const researchOpen=!!Store.get(`ui.researchOpen.${id}`)||['exploring','pursuing'].includes(d.candidate_disposition);
  const claims=Store.get('careerClaims')||[];
  const selected=new Set(Store.get('ui.selectedEvidence')||[]);
  const claimsHtml=claims.map(c=>`<label style="display:block;margin:6px 0;font-size:13px"><input type="checkbox" data-evidence="${c.id}" ${selected.has(c.id)?'checked':''}> <strong>${h(c.title)}</strong> · ${badge(String(c.evidenceStatus).toLowerCase().replace(/\s+/g,'_'))}<br><span class="action-note">${h(c.detail)}</span></label>`).join('');
  let actions;
  if(d.candidate_disposition==='pursuing')
    actions=`<a class="btn primary" href="#/workspace/${id}/brief" data-open-workspace>Open workspace</a>`;
  else if(d.candidate_disposition==='exploring')
    actions=`<button class="btn primary" data-run="ACT-OPPORTUNITY-PURSUE" data-opp="${id}">Open pursuit workspace</button><span class="action-note">Creates a private working file for this opportunity. Nothing is sent, submitted, or shared.</span>`;
  else
    actions=`<button class="btn primary" data-run="ACT-OPPORTUNITY-EXPLORE" data-opp="${id}" data-explore-cta>${h(o.cta)}</button>
      <button class="btn quiet" data-run="ACT-OPPORTUNITY-WATCH" data-opp="${id}">Save for later</button>
      <button class="btn quiet danger" data-run="ACT-OPPORTUNITY-PASS" data-opp="${id}">Pass</button>`;
  const routePrimary=o.routes?.length?(()=>{const r=o.routes[0];return `<div data-route-block><strong>${h(r.name)} · ${h(r.viability)}</strong><div class="route-fact"><b>Relationship fact:</b> ${h(r.fact)}</div><div class="route-fact"><b>Route assessment:</b> ${h(r.interpretation)}</div></div>`})():'<div class="action-note">No credible warm route found. Direct application remains available.</div>';
  return `<div data-dossier data-opp="${id}">
    <div class="topbar"><div><div class="eyebrow" data-dossier-state>${stateLabel(id)} · ${Copy.dim('opportunity_search_state',d.opportunity_search_state)}</div><h1>${h(o.role)}</h1><span class="count">${h(o.company)} · ${h(o.location)}</span></div></div>
    ${o.stale?staleBanner('This opportunity has had no fresh evidence for several days. Re-check the source before investing attention.'):''}
    <p class="decision-line" data-decision-thesis><strong>${h(o.decision)}</strong></p>
    ${section('What is supported',supHtml,{attr:'data-section-supported'})}
    ${section('What could change the decision',openHtml,{attr:'data-section-open'})}
    ${section('Career move',assertionRow({id:'traj',label:'Trajectory',value:o.trajectory,status:'estimate',source:'Compared with current scope and stated intent'}),{attr:'data-section-career-move'})}
    ${section('Route in',routePrimary,{attr:'data-section-route'})}
    ${section('Source trail',sourceTrail(o.sources||[]),{attr:'data-section-source'})}
    <div class="actions" data-actions>${actions}</div>
    ${guardrailNote()}
    <div id="researchBlock" class="detail-section" ${researchOpen?'':'hidden'} data-research>
      ${section('Research notes',((o.research?.supports||[]).length?`<ul style="margin-left:18px">${(o.research?.supports||[]).map(x=>`<li>${h(x)}</li>`).join('')}</ul>`:aiPending('AI research pending'))+`<p class="action-note" style="margin-top:8px">Still unresolved:</p><ul style="margin-left:18px">${(o.research?.unknowns||[]).map(x=>`<li>${h(x)}</li>`).join('')}</ul>`)}
    </div>
    <div class="detail-section">
      <button class="text-btn" id="evidenceToggle">Use your evidence →</button>
      <div id="evidencePicker" hidden>${claimsHtml}<button class="btn" id="bindEvidence" data-bind-opp="${id}">Link selected experience to this mandate</button><span class="action-note">Binding never changes the truth status of your evidence.</span></div>
    </div>
  </div>`;
}
function renderOpportunities(shell,params,segOverride){
  if(segOverride!==undefined&&segOverride!==null)currentSeg=segOverride;
  const seg=params?.get('ids')!=null?'all':currentSeg;
    const items=opps().filter(o=>matchesSeg(o,seg));
  const tabs=SEGMENTS.map(([k,l])=>`<button class="nav-item ${k===seg?'active':''}" data-seg="${k}" style="display:inline-block;width:auto;padding:6px 10px">${l}</button>`).join(' ');
  let detail;
  try{detail=$sel()?detailHtml($sel()):emptyState('Select an opportunity.');}
  catch(e){window.__wp1err=String(e&&e.stack||e);detail='<div class="empty-state">detail render error</div>';}
  root.innerHTML=shell(`<div class="topbar"><h1>Opportunities</h1><span class="count" data-seg-count>${items.length}</span></div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">${tabs} <a class="btn quiet" href="#/opportunities/capture" data-capture-link>+ Capture</a> <a class="btn quiet" href="#/market" data-market-link>+ Market targets</a></div>
    <div data-workbench style="display:grid;grid-template-columns:minmax(280px,380px) 1fr;gap:18px">
      <div data-list>${items.length?items.map(rowHtml).join(''):emptyState('Nothing here yet.')}</div>
      <div data-detail-panel>${detail}</div>
    </div>`,{activeNav:'opportunities'});
  root.querySelectorAll('[data-seg]').forEach(b=>b.onclick=()=>{currentSeg=b.dataset.seg;renderOpportunities(shell)});
  root.querySelectorAll('[data-row]').forEach(r=>r.onclick=e=>{
    if(e.target.closest('[data-pin],[data-compare]'))return;
    Store.set('ui.selectedOpportunityId',r.dataset.row);Store.log('opportunity_selected',{opportunity_id:r.dataset.row});renderOpportunities(shell);
  });
  root.querySelectorAll('[data-pin]').forEach(b=>b.onclick=e=>{e.stopPropagation();const o=opp(b.dataset.pin);Store.set(`opportunities.${o.id}.shortlisted`,!o.shortlisted);Store.log('shortlist_pin_changed',{opportunity_id:o.id});renderOpportunities(shell)});
  root.querySelectorAll('[data-run]').forEach(b=>b.onclick=async()=>{
    const before=disp(b.dataset.opp);
    const r=await Actions.run(b.dataset.run,{opportunityId:b.dataset.opp});
    if(!r.ok){toast(`Blocked: ${r.reason.replace(/_/g,' ')}`);return}
    if(b.dataset.run==='ACT-OPPORTUNITY-PURSUE')toast('Pursuit workspace opened — nothing sent');
    if(b.dataset.run==='ACT-OPPORTUNITY-EXPLORE'&&before==='discovered')Store.log('explore_cta_used',{opportunity_id:b.dataset.opp});
    renderOpportunities(shell);
  });
  const et=root.querySelector('#evidenceToggle'),ep=root.querySelector('#evidencePicker');
  if(et&&ep)et.onclick=()=>{ep.hidden=!ep.hidden};
  root.querySelectorAll('[data-evidence]').forEach(cb=>cb.onchange=()=>{
    const cur=new Set(Store.get('ui.selectedEvidence')||[]);
    cb.checked?cur.add(cb.dataset.evidence):cur.delete(cb.dataset.evidence);
    Store.set('ui.selectedEvidence',[...cur]);
  });
  const be=root.querySelector('#bindEvidence');
  if(be)be.onclick=async()=>{
    const ids=Store.get('ui.selectedEvidence')||[];
    if(!ids.length){toast('Choose at least one experience');return}
    await Actions.run('ACT-MANDATE-EVIDENCE-BIND',{opportunityId:be.dataset.bindOpp});
    toast('Experience linked. Evidence status unchanged.');renderOpportunities(shell);
  };
}

/* ---------- Compare ---------- */
function renderCompare(shell,params){
  const ids=(params.get('ids')||'').split(',').filter(Boolean);
  const items=ids.map(opp).filter(Boolean);
  const dims=[
    ['Trajectory',o=>h(o.trajectory)],
    ['Scope / mandate',o=>h(o.mandate||o.inlineFacts?.[0]?.[1]||'—')],
    ['Route in',o=>h(o.routeShort)],
    ['Biggest unknown',o=>{const a=(o.open||[]).map(x=>Store.get(`assertions.${x}`)).find(x=>x&&x.status!=='confirmed');return a?h(a.label):h(o.inlineOpen?.[0]?.[0]||'—')}],
    ['Source',o=>h(o.sources?.[0]?.[0]||'—')],
    ['Candidate state',o=>stateLabel(o.id)]
  ];
  const table=items.length>=2?tradeoffTable({columns:items.map(o=>({title:o.role,sub:o.company})),rows:dims.map(([name,get])=>({dimension:name,cells:items.map(get)}))}):emptyState('Pass two or three opportunity ids: #/opportunities/compare?ids=a,b');
  root.innerHTML=shell(`<div class="topbar"><h1>Compare opportunities</h1></div>${table}${guardrailNote('Comparison presents named trade-offs only. It does not score options or auto-select a winner.')}`,{activeNav:'opportunities'});
}

/* ---------- Capture ---------- */
function renderCapture(shell){
  const captures=Object.values(Store.get('captures')||{}).filter(Boolean);
  const rows=captures.map(c=>`<div class="card card-pad" style="margin-bottom:8px" data-capture="${c.id}">
    <strong>${h(c.role||'Untitled role')}</strong> <span class="badge needs_research">Needs review</span>
    <div class="action-note">${h(c.company||'Company unknown')} · source mode: ${h(c.mode)} · captured ${h(c.at)}</div>
    ${c.jd?`<div class="action-note" data-capture-jd>Untrusted captured content: ${h(c.jd.slice(0,120))}…</div>`:''}
    <div class="actions">
      <button class="btn primary" data-commit="${c.id}">Review & commit as opportunity</button>
      <button class="btn quiet danger" data-discard="${c.id}">Discard</button>
    </div>
    <span class="action-note">Captured page content is untrusted data. It becomes an opportunity only after your explicit review.</span>
  </div>`).join('')||emptyState('No captured drafts.');
  root.innerHTML=shell(`<div class="topbar"><h1>Capture opportunity</h1></div>
    <div class="card card-pad" data-capture-form>
      <div class="eyebrow">Save from anywhere</div>
      <label style="display:block;margin:8px 0">Role<br><input name="role" style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px"></label>
      <label style="display:block;margin:8px 0">Company<br><input name="company" style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px"></label>
      <label style="display:block;margin:8px 0">Mode
        <select name="mode" style="display:block;width:100%;padding:8px;border:1px solid var(--line);border-radius:6px">
          <option value="url">Career page URL</option><option value="jd">Pasted job description</option><option value="confidential">Confidential / recruiter note (no URL)</option>
        </select></label>
      <label style="display:block;margin:8px 0">Page text or note<br><textarea name="jd" rows="3" style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px"></textarea></label>
      <button class="btn primary" id="captureSave">Save draft for review</button>
      <span class="action-note">Capture never contacts anyone and never publishes anything.</span>
    </div>
    <div class="detail-section"><h3>Drafts awaiting review</h3>${rows}</div>`,{activeNav:'opportunities'});
  root.querySelector('#captureSave').onclick=()=>{
    const f=root.querySelector('[data-capture-form]');
    const val=n=>f.querySelector(`[name=${n}]`).value.trim();
    const c={id:`cap_${Date.now()}`,role:val('role'),company:val('company'),mode:val('mode'),jd:val('jd'),at:'now',status:'needs_review'};
    Store.set(`captures.${c.id}`,c);Store.log('capture_drafted',{capture_id:c.id,external_effect:false});renderCapture(shell);
  };
  root.querySelectorAll('[data-commit]').forEach(b=>b.onclick=()=>{
    const c=Store.get(`captures.${b.dataset.commit}`);
    const id=(c.role||'captured').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'').slice(0,30)||`cap_role_${Date.now()}`;
    if(opp(id)){toast('An opportunity with this role already exists');return}
    Store.set(`opportunities.${id}`,{id,role:c.role||'Untitled role',company:c.company||'Unknown company',location:'—',shortlisted:false,updated:'Now',fresh:'Captured',trajectory:'Not yet assessed',routeShort:'None known',cta:'Investigate scope',decision:'Draft captured from external content. Research has not started.',sources:[[c.mode==='confidential'?'Confidential note':'Manual capture','Now','Draft']],routes:[],research:{supports:[],unknowns:['Scope','Reporting line','Compensation']},dims:{candidate_disposition:'discovered',opportunity_search_state:c.mode==='confidential'?'unknown':'hypothesis',candidate_selection_state:'not_started',priority_allocation:'inactive'}});
    Store.set(`captures.${c.id}`,null);Store.log('capture_committed',{capture_id:c.id,opportunity_id:id});
    toast('Opportunity created from draft');location.hash='#/opportunities';
  });
  root.querySelectorAll('[data-discard]').forEach(b=>b.onclick=()=>{Store.set(`captures.${b.dataset.discard}`,null);Store.log('capture_discarded',{capture_id:b.dataset.discard});renderCapture(shell)});
}

/* ---------- Route registration ---------- */
routes.push(
  {id:'briefing',path:'briefing',clients:['web','pwa'],async mount(ctx){root=ctx.root;renderBriefing(ctx.shell)}},
  {id:'opportunities',path:'opportunities',clients:['web','pwa'],async mount(ctx){root=ctx.root;renderOpportunities(ctx.shell,ctx.params,'shortlist')}},
  {id:'compare',path:'opportunities/compare',clients:['web'],async mount(ctx){root=ctx.root;renderCompare(ctx.shell,ctx.params)}},
  {id:'capture',path:'opportunities/capture',clients:['web','pwa'],async mount(ctx){root=ctx.root;renderCapture(ctx.shell)}},
  {id:'opportunity-detail',path:'opportunities/:id',clients:['web','pwa'],async mount(ctx){root=ctx.root;const id=ctx.params.get('id')||(location.hash.split('/')[2]||'').split('?')[0];if(id)Store.set('ui.selectedOpportunityId',id);renderOpportunities(ctx.shell,ctx.params,'shortlist')}}
);
export {routes};
