import {Store} from '../../core/store.js';
import {Actions} from '../../core/actions.js';
import {Copy} from '../../core/copy.js';
import {badge,emptyState,section} from '../../ui/components.js';
import {claimMeta,intentSeed} from '../../../fixtures/wp2/index.js';

const routes=[];
let root=null;
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function ensureData(){
  if(Store.get('wp2Ready'))return;
  const claims=Store.get('careerClaims')||[];
  const map={};
  for(const c of claims){
    const meta=claimMeta[c.id]||{provenance:'User Input',interpretation:'Fact',usage:'Private only'};
    map[c.id]={...c,...meta,reviewState:c.id==='claim_merger'?'proposed':'attested',dims:{claim_review_state:c.id==='claim_merger'?'proposed':'attested'}};
  }
  Store.set('claims',map);
  Store.set('careerIntent',intentSeed);
  Store.set('artifacts',{narrative:{headline:'Technology executive who builds and transforms platform organisations at international scale.',body:'Track record spans post-merger consolidation, APAC scale-up, and operating-cost transformation.'},bios:[{id:'bio_v3',label:'Executive bio v3 (current)',status:'approved'},{id:'bio_v4_draft',label:'Executive bio v4',status:'draft'}],stories:[{id:'story_1',title:'Three-country engineering scale-up',claims:['claim_apac_scale']},{id:'story_2',title:'Post-merger platform consolidation',claims:['claim_merger','claim_cost']}]});
  Store.set('wp2Ready',true);
}
function claims(){return Object.values(Store.get('claims')||{})}

Actions.register('ACT-CAREER-CLAIM-ATTEST',()=>({note:'Attestation recorded. Attest is not independent verification.'}));
Actions.register('ACT-CAREER-CLAIM-REJECT',()=>({note:'Claim rejected; retained as rejected for audit.'}));

/* ---------- Career hub ---------- */
function renderHub(shell){
  ensureData();
  const counts={};for(const c of claims())counts[c.dims.claim_review_state]=(counts[c.dims.claim_review_state]||0)+1;
  const countLine=Object.entries(counts).map(([s,n])=>`${Copy.dim('claim_review_state',s)}: ${n}`).join(' · ');
  root.innerHTML=shell(`<div class="topbar"><h1>Career</h1><span class="count" data-claim-count-line>${countLine}</span></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px">
      <a class="card card-pad" href="#/career/evidence" data-hub-link="evidence"><strong>Career Evidence Review</strong><p class="action-note">Provenance, evidence status, interpretation and usage permissions for every claim.</p></a>
      <a class="card card-pad" href="#/career/intent" data-hub-link="intent"><strong>Career Intent</strong><p class="action-note">Target roles, mandates, constraints and avoidances.</p></a>
      <a class="card card-pad" href="#/career/artifacts" data-hub-link="artifacts"><strong>Positioning artifacts</strong><p class="action-note">Narrative, executive bio versions and leadership story library.</p></a>
    </div>`,{activeNav:'career'});
}
/* ---------- Evidence review ---------- */
function renderEvidence(shell){
  ensureData();
  const rows=claims().map(c=>{
    const s=c.dims.claim_review_state;
    const proposed=c.provenance==='AI Extraction';
    return `<div class="card card-pad" style="margin-bottom:10px" data-claim="${c.id}">
      <div style="display:flex;justify-content:space-between;gap:10px"><strong>${h(c.title)}</strong>${badge(s==='attested'?'confirmed':s==='rejected'?'open':'estimate')}</div>
      <div class="action-note">${h(c.detail)}</div>
      <div class="detail-section" style="margin-top:10px;padding-top:8px">
        <div class="assertion-row"><div class="assertion-label">Provenance</div><div class="assertion-value" ${proposed?'data-provenance="ai-extraction"':''}><strong>${h(c.provenance)}</strong>${proposed?'<span class="assertion-source">AI proposal — requires your attestation</span>':''}</div><div></div></div>
        <div class="assertion-row"><div class="assertion-label">Evidence status</div><div class="assertion-value"><strong>${h(c.evidenceStatus)}</strong></div><div></div></div>
        <div class="assertion-row"><div class="assertion-label">Interpretation</div><div class="assertion-value"><strong>${h(c.interpretation)}</strong></div><div></div></div>
        <div class="assertion-row"><div class="assertion-label">Usage permission</div><div class="assertion-value"><strong>${h(c.usage)}</strong></div><div></div></div>
      </div>
      <div class="actions" data-claim-state="${s}">
        ${s==='proposed'||s==='under_review'
          ?`<button class="btn primary" data-run="ACT-CAREER-CLAIM-ATTEST" data-claim="${c.id}">Attest this claim</button>
            <button class="btn quiet danger" data-run="ACT-CAREER-CLAIM-REJECT" data-claim="${c.id}">Reject</button>`
          :`<span class="badge ${s==='attested'?'confirmed':'open'}" data-review-state>${Copy.dim('claim_review_state',s)}</span>`}
      </div>
    </div>`;
  }).join('');
  root.innerHTML=shell(`<div class="topbar"><h1>Career Evidence Review</h1></div>
    <p class="action-note" data-attest-note>Attesting confirms this claim is yours. It does not mean it has been independently verified.</p>
    ${rows||emptyState('No career claims yet.')}`,{activeNav:'career'});
  root.querySelectorAll('[data-run]').forEach(b=>b.onclick=async()=>{
    const r=await Actions.run(b.dataset.run,{entityId:b.dataset.claim});
    if(!r.ok){alert(`Blocked: ${r.reason}`);return}
    renderEvidence(shell);
  });
}
/* ---------- Intent editor ---------- */
function renderIntent(shell){
  ensureData();
  const it=Store.get('careerIntent');
  const field=(name,label,val)=>`<label style="display:block;margin:10px 0">${label}<br><input name="${name}" value="${h(val)}" style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px"></label>`;
  root.innerHTML=shell(`<div class="topbar"><h1>Career Intent</h1></div>
    <div class="card card-pad" data-intent-form>
      ${field('roleFamilies','Target role families',it.roleFamilies.join(', '))}
      ${field('seniority','Seniority',it.seniority)}
      ${field('geographies','Geographies',it.geographies.join(', '))}
      ${field('workModel','Work model',it.workModel)}
      ${field('compFloor','Compensation floor',it.compFloor)}
      ${field('mandates','Desired mandates',it.mandates.join(', '))}
      ${field('constraints','Constraints',it.constraints.join(', '))}
      ${field('avoidances','Avoidances',it.avoidances.join(', '))}
      <button class="btn primary" id="intentSave">Save intent</button>
    </div>`,{activeNav:'career'});
  root.querySelector('#intentSave').onclick=()=>{
    const f=root.querySelector('[data-intent-form]');
    const val=n=>f.querySelector(`[name=${n}]`).value.trim();
    const list=v=>v.split(',').map(x=>x.trim()).filter(Boolean);
    Store.set('careerIntent',{roleFamilies:list(val('roleFamilies')),seniority:val('seniority'),geographies:list(val('geographies')),workModel:val('workModel'),compFloor:val('compFloor'),mandates:list(val('mandates')),constraints:list(val('constraints')),avoidances:list(val('avoidances'))});
    Store.log('career_intent_saved',{});
  };
}
/* ---------- Artifacts ---------- */
function renderArtifacts(shell){
  ensureData();
  const a=Store.get('artifacts');
  const stories=a.stories.map(st=>`<div class="card card-pad" style="margin-bottom:8px" data-story="${st.id}">
    <strong>${h(st.title)}</strong>
    <div class="action-note">Evidence: ${(st.claims||[]).map(id=>{const c=Store.get(`claims.${id}`);return c?`${h(c.title)} (${h(c.evidenceStatus)})`:'missing'}).join(' · ')}</div>
  </div>`).join('');
  const bios=a.bios.map(b=>`<div class="brief-line" data-bio="${b.id}"><span>${h(b.label)}</span><strong>${Copy.t('resume_variant_state',b.status)||b.status}</strong></div>`).join('');
  root.innerHTML=shell(`<div class="topbar"><h1>Positioning artifacts</h1></div>
    ${section('Executive narrative',`<p data-narrative-headline><strong>${h(a.narrative.headline)}</strong></p><p class="action-note" style="margin-top:6px">${h(a.narrative.body)}</p>`)}
    ${section('Executive bio versions',bios)}
    ${section('Leadership story library',stories||emptyState('No stories yet.'))}`,{activeNav:'career'});
}
/* ---------- Onboarding ---------- */
function renderOnboarding(shell){
  let step=Number(new URLSearchParams(location.hash.split('?')[1]||'').get('step')||'1');
  const go=n=>{location.hash=`#/onboarding?step=${n}`};
  let inner='';
  if(step===1)inner=`<div class="card card-pad" data-onb-step="1"><div class="eyebrow">Simulated sign-in for prototype</div><p class="action-note">No real authentication occurs in this build.</p><button class="btn primary" id="onbNext">Continue</button></div>`;
  if(step===2)inner=`<div class="card card-pad" data-onb-step="2"><div class="eyebrow">Import CV</div><p class="action-note">Simulated import proposes two new claims extracted from your CV.</p><button class="btn primary" id="onbImport">Import & review proposals</button></div>`;
  if(step===3){
    ensureData();
    ['claim_board_seat','claim_pnl_50m'].forEach((id,i)=>{
      if(Store.get(`claims.${id}`))return;
      Store.set(`claims.${id}`,{id,title:i===0?'Board exposure at listed company':'Managed $50M operating budget',detail:i===0?'Reported to board quarterly during transformation program.':'Owned P&L for regional business unit.',provenance:'AI Extraction',interpretation:'Suggested wording',usage:'Private only',evidenceStatus:'Self-attested',dims:{claim_review_state:'proposed'}});
    });
    Store.log('cv_import_proposed_claims',{external_effect:false});
    inner=`<div class="card card-pad" data-onb-step="3"><div class="eyebrow">Review AI-proposed claims</div><p class="action-note">Two new claims were extracted. They are proposals until you attest them.</p><button class="btn primary" id="onbToIntent">Review evidence next</button></div>`;
  }
  if(step>=4)inner=`<div class="card card-pad" data-onb-step="4"><div class="eyebrow">Career basics</div><p class="action-note">Set target roles and geographies in Career Intent later from the Career hub.</p><button class="btn primary" id="onbFinish">Finish — go to my briefing</button></div>`;
  root.innerHTML=shell(`<div class="topbar"><h1>Welcome to ScopeCareer</h1></div>${inner}`,{activeNav:''});
  root.querySelector('#onbNext')?.addEventListener('click',()=>go(2));
  root.querySelector('#onbImport')?.addEventListener('click',()=>go(3));
  root.querySelector('#onbToIntent')?.addEventListener('click',()=>{location.hash='#/career/evidence'});
  root.querySelector('#onbFinish')?.addEventListener('click',()=>{location.hash='#/briefing'});
}

routes.push(
  {id:'career',path:'career',clients:['web','pwa'],async mount(ctx){root=ctx.root;renderHub(ctx.shell)}},
  {id:'career-evidence',path:'career/evidence',clients:['web'],async mount(ctx){root=ctx.root;renderEvidence(ctx.shell)}},
  {id:'career-intent',path:'career/intent',clients:['web','pwa'],async mount(ctx){root=ctx.root;renderIntent(ctx.shell)}},
  {id:'career-artifacts',path:'career/artifacts',clients:['web'],async mount(ctx){root=ctx.root;renderArtifacts(ctx.shell)}},
  {id:'onboarding',path:'onboarding',clients:['web','pwa'],async mount(ctx){root=ctx.root;renderOnboarding(ctx.shell)}}
);
export {routes};
