import {Store} from '../../core/store.js';
import {Actions} from '../../core/actions.js';
import {Copy} from '../../core/copy.js';
import {assertionRow,badge,emptyState,section,guardrailNote} from '../../ui/components.js';
import * as F from '../../../fixtures/wp3/index.js';

const routes=[];
let root=null,oppId=null,stageOverride=null,ctxShell=null;
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const opp=id=>Store.get(`opportunities.${id||oppId}`);
const STAGE_BY_SELECTION={not_started:'precontact',contacted:'precontact',applied:'recruiter',recruiter_screen:'recruiter',interview:'selection',final:'final',reference:'final',offer:'offer',closed:'offer'};
function stage(){if(stageOverride)return stageOverride;const o=opp();return STAGE_BY_SELECTION[o?.dims?.candidate_selection_state]||'precontact'}

function ensureData(){
  if(Store.get(`workspace.${oppId}`))return;
  for(const v of structuredClone(F.resumeVariants)){Store.set(`resumeVariants.${v.id}`,v)}
  Store.set(`workspace.${oppId}`,{positioningBrief:JSON.parse(JSON.stringify(F.positioningBrief)),resumeVariants:F.resumeVariants.map(v=>Store.get(`resumeVariants.${v.id}`)),participants:structuredClone(F.participants),interactions:[...F.interactions],commitments:structuredClone(F.commitments),openQuestions:structuredClone(F.openQuestions)});
  const d=structuredClone(F.debrief);
  for(const p of d.proposals){Store.set(`assertions.${p.id}`,p)}
  Store.set(`workspace.${oppId}.debrief`,{id:d.id,observed:d.observed,proposalIds:d.proposals.map(p=>p.id),suggestedCommitment:d.suggestedCommitment});
  if(!Store.get(`offers.${F.offer.id}`))Store.set(`offers.${F.offer.id}`,structuredClone(F.offer));
}
Actions.register('ACT-PRIORITY-ACTIVATE',()=>({note:'Priority raises monitoring depth. It is internal only.'}));
Actions.register('ACT-POSITIONING-PREPARE',()=>{Store.get(`workspace.${oppId}`).positioningBrief.status='prepared';return {note:'Draft prepared. Prepare is not share.'}});
Actions.register('ACT-POSITIONING-COMMIT',()=>{Store.get(`workspace.${oppId}`).positioningBrief.status='committed';return {note:'Brief committed for this opportunity.'}});
Actions.register('ACT-COMMITMENT-ADD',(p)=>{const w=Store.get(`workspace.${oppId}`);w.commitments.push({id:`cmt_${Date.now()}`,text:p.text,due:p.due||'',done:false});return {}});
Actions.register('ACT-COMMITMENT-COMPLETE',(p)=>{const c=(Store.get(`workspace.${oppId}`).commitments).find(c=>c.id===p.commitmentId);if(c)c.done=true;return {}});
Actions.register('ACT-OPEN-QUESTION-ADD',(p)=>{Store.get(`workspace.${oppId}`).openQuestions.push({id:`oq_${Date.now()}`,text:p.text,resolved:false});return {}});

const NAV=['brief','people','positioning','process','record'];
const NEXT_MOVES={
  precontact:'Confirm strategy ownership before asking Sarah for an introduction.',
  recruiter:'Confirm P&L ownership and compensation range before sending an updated CV.',
  selection:'Prepare the CEO interview around international expansion and the adjacency concern.',
  final:'Build the 15-minute operating thesis and confirm reference coverage.',
  offer:'Compare authority, mandate, equity and downside before setting your intent.'
};

function shellFor(area,content){
  const s=stage();
  const nav=NAV.map(a=>`<button class="nav-item ${a===area?'active':''}" data-area="${a}" style="display:inline-block;width:auto;padding:6px 12px">${a[0].toUpperCase()+a.slice(1)}</button>`).join(' ');
  return `<div class="topbar"><div><div class="eyebrow" data-stage-eyebrow>${h(stage().toUpperCase())}</div><h1>${h(opp().role)} — workspace</h1><span class="count">${h(opp().company)}</span></div>
    <div style="margin-left:auto;text-align:right" data-priority-box>
      ${Store.dims(oppId,'priority_allocation')==='active'
        ?`<span class="badge confirmed">Priority</span> <button class="btn quiet" data-run="ACT-PRIORITY-DEACTIVATE">Stand down priority</button>`
        :`<button class="btn" data-run="ACT-PRIORITY-ACTIVATE" data-priority-activate>Make priority</button>`}
      <div class="action-note">Priority is private attention allocation. Employers never see it.</div>
    </div></div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">${nav}</div>
    <div data-workspace-content>${content}</div>
    ${guardrailNote('Private opportunity workspace. No outreach, application, or sharing occurs automatically.')}`;
}

function briefContent(){
  const o=opp();const s=stage();
  const open=(o.open||[]).map(x=>Store.get(`assertions.${x}`)).filter(a=>a&&a.status!=='confirmed');
  const ready=[['Career evidence',`${(o.bindings||[]).length||3} relevant`],['Positioning brief',Store.get(`workspace.${oppId}`).positioningBrief.status==='committed'?'Committed':'Prepared'],['Resume variant',F.resumeVariants[0].dims.resume_variant_state==='approved'?'Approved':'Draft']];
  return `<div class="card card-pad" data-next-move><div class="eyebrow">Next move</div><h3>${h(NEXT_MOVES[s])}</h3>
      <p class="action-note">The warm route is useful only if the role is worth network capital.</p></div>
    <div class="detail-section"><h3>Open questions by decision impact</h3>${open.map(assertionRow).join('')||'<div class="action-note">None open.</div>'}</div>
    <div class="detail-section"><h3>Ready to use</h3>${ready.map(([k,v])=>`<div class="brief-line" data-ready-${k.toLowerCase().replace(/\s+/g,'-')}><span>${k}</span><strong>${v}</strong></div>`).join('')}</div>`;
}
function peopleContent(){
  const routesIn=opp().routes||[];
  const people=(routesIn.filter(r=>r.personId).map(r=>({r,p:Store.get(`people.${r.personId}`)}))).filter(x=>x.p);
  const facts=people.map(({r,p})=>`<div class="card card-pad" style="margin-bottom:8px" data-person="${p.id}">
    <strong>${h(p.name)}</strong> <span class="count">${h(p.sub)}</span>
    <div class="route-fact"><b>Relationship fact:</b> ${h(r.fact||p.fact)}</div>
    <div class="route-fact" data-route-assessment><b>Route assessment:</b> ${h(r.interpretation||p.assessment)}</div>
  </div>`).join('');
  const timeline=(Store.get(`workspace.${oppId}`).interactions).map(([d,v])=>`<div class="source-row"><span>${h(v)}</span><time>${d}</time></div>`).join('');
  return `${facts||emptyState('No mapped people yet.')}${section('Interaction history',timeline)}`;
}
function positioningContent(){
  const w=Store.get(`workspace.${oppId}`);
  const pb=w.positioningBrief;
  const variants=w.resumeVariants.map(v=>{
    const st=v.dims.resume_variant_state;
    return `<div class="card card-pad" style="margin-bottom:8px" data-variant="${v.id}">
      <div style="display:flex;justify-content:space-between"><strong>${h(v.label)}</strong>${badge(st==='approved'?'confirmed':st==='rejected'?'open':'estimate')}</div>
      <div class="action-note" data-variant-state>${Copy.dim('resume_variant_state',st)}</div>
      <div class="actions">
        ${st==='draft'?`<button class="btn primary" data-run="ACT-RESUME-VARIANT-REVIEW" data-entity="${v.id}">Open for review</button>`:''}
        ${st==='reviewing'?`<button class="btn primary" data-run="ACT-RESUME-VARIANT-APPROVE" data-entity="${v.id}">Approve variant</button>
          <button class="btn quiet danger" data-run="ACT-RESUME-VARIANT-REJECT" data-entity="${v.id}">Reject variant</button>`:''}
        ${(st==='draft'||st==='reviewing')?`<button class="btn quiet" data-diff="${v.id}">Inspect diff</button>`:''}
        <span class="action-note">Approve is not share. Approved variants stay private until you explicitly share them.</span>
      </div>
      <div data-diffbox hidden>${diffHtml(v)}</div>
    </div>`;
  }).join('');
  return `<div class="card card-pad" data-positioning-brief>
      <div class="eyebrow">Positioning brief · ${pb.status}</div>
      <h3>${h(pb.headline)}</h3>
      <ul style="margin-left:18px">${pb.bullets.map(b=>`<li>${h(b)}</li>`).join('')}</ul>
      <div class="actions">
        ${pb.status==='draft'?`<button class="btn primary" data-run="ACT-POSITIONING-PREPARE" data-positioning-prepare>Prepare brief</button>`:
          pb.status==='prepared'?`<button class="btn primary" data-run="ACT-POSITIONING-COMMIT" data-positioning-commit>Commit brief</button>`:
          `<span class="badge confirmed">Committed</span>`}
        <span class="action-note">Prepare is not share. Drafts remain private until explicit commit.</span>
      </div>
    </div>
    ${section('Resume variants',variants)}`;
}
function diffHtml(v){
  return `<table class="tradeoff-table" data-diff-table>
    <thead><tr><th>Section</th><th>Original</th><th>Proposed</th><th>Evidence & permission</th><th>Decision</th></tr></thead>
    <tbody>${v.changes.map(ch=>`<tr data-change="${ch.id}">
      <td><strong>${h(ch.section)}</strong><div class="action-note">Reason: ${h(ch.reason)}</div></td>
      <td>${h(ch.original)}</td><td>${h(ch.proposed)}</td>
      <td><span class="action-note" data-change-evidence>${h(ch.claimId)} · ${h(ch.usage)}</span></td>
      <td data-change-actions>${ch.accepted===true?'<span class="badge confirmed">Accepted</span>':ch.accepted===false?'<span class="badge open">Rejected</span>':`<button class="btn" data-accept="${ch.id}">Accept</button> <button class="btn quiet danger" data-reject="${ch.id}">Reject</button>`}</td>
    </tr>`).join('')}</tbody></table>`;
}
function processContent(){
  const w=Store.get(`workspace.${oppId}`);
  const s=stage();
  const order=['precontact','recruiter','selection','final','offer'];
  const progress=order.map((st,i)=>{const cur=order.indexOf(s);return `<div class="brief-line" data-stage-row="${st}"><span>${st}</span><strong>${i<cur?'Complete':i===cur?'Current':'Not started'}</strong></div>`}).join('');
  let extra='';
  if(s==='selection'||s==='final'||s==='offer'){
    extra+=section('Stakeholder preparation',w.participants.map(p=>`<div class="card card-pad" style="margin-bottom:8px" data-participant="${p.id}">
      <strong>${h(p.name)}</strong> <span class="count">${h(p.when)}</span>
      <div class="detail-section" style="padding-top:6px">
        <div class="assertion-row"><div class="assertion-label">Agenda hypotheses</div><div class="assertion-value">${p.agenda.map(a=>`<div>${h(a)} <span class="badge inferred" data-inference-label>Inference</span></div>`).join('')}</div><div></div></div>
        ${p.concerns.length?`<div class="assertion-row"><div class="assertion-label">Known concerns</div><div class="assertion-value">${p.concerns.map(h).join('; ')}</div><div></div></div>`:''}
        <div class="assertion-row"><div class="assertion-label">Evidence to use</div><div class="assertion-value">${p.evidence.map(h).join('; ')}</div><div></div></div>
        ${p.questions.length?`<div class="assertion-row"><div class="assertion-label">Questions to resolve</div><div class="assertion-value">${p.questions.map(h).join('; ')}</div><div></div></div>`:''}
      </div></div>`).join(''));
  }
  const debriefBlock=()=>{
    const d=w.debrief;if(!d)return '';
    const rows=d.proposalIds.map(id=>{const a=Store.get(`assertions.${id}`);const st=a.dims.epistemic_status;
      return `<div data-proposal="${id}">${assertionRow({...a,status:st==='known'?'confirmed':st==='inferred'?'inferred':'estimate'})}
        <div class="actions" data-proposal-actions>${st!=='needs_research'?`<span class="action-note">${Copy.dim('epistemic_status',st)} — committed</span>`:
          `<button class="btn" data-run="ACT-ASSERTION-COMMIT-INFERRED" data-entity="${id}">Commit as inference</button>
           <button class="btn primary" data-run="ACT-ASSERTION-COMMIT-KNOWN" data-entity="${id}">Commit as known</button>
           `}</div></div>`}).join('');
    return section('Latest debrief',`<div class="action-note" data-debrief-observed>Observed: ${h(d.observed)}</div>${rows}
      <p class="action-note" data-no-silent-rewrite>Debrief extraction proposes observations and assertions. It never silently rewrites known facts.</p>`);
  };
  let offerBlock='';
  if(s==='offer'){
    const of=Object.values(Store.get('offers')||{}).find(o=>o.oppId===oppId);
    if(of){
      const st=of.dims.offer_decision_state;
      offerBlock=section('Offer decision',`<div class="card card-pad" data-offer-box data-offer-state="${st}">
        <div class="eyebrow">Terms · ${Copy.dim('offer_decision_state',st)}</div>
        ${of.terms.map(([k,v])=>`<div class="offer-term"><span>${k}</span><strong>${h(v)}</strong></div>`).join('')}
        <div class="detail-section"><h3>Decision criteria weights</h3>${of.criteria.map(([k,wt])=>`<div class="brief-line"><span>${k}</span><strong>${wt}%</strong></div>`).join('')}</div>
        <div class="actions">
          ${st==='received'?`<button class="btn primary" data-run="ACT-OFFER-REVIEW" data-offer="${of.id}">Begin review</button>`:''}
          ${st==='under_review'?`<button class="btn primary" data-run="ACT-OFFER-DECISION-PREPARE" data-offer="${of.id}">Mark decision ready</button>`:''}
          ${st==='decision_ready'?`<button class="btn primary" data-run="ACT-OFFER-INTENT-ACCEPT" data-offer="${of.id}">Set intent to accept</button>
            <button class="btn quiet danger" data-run="ACT-OFFER-INTENT-DECLINE" data-offer="${of.id}">Set intent to decline</button>
            <span class="action-note" data-intent-note>Intent is your private decision record. Nothing is sent to the employer automatically.</span>`:''}
          ${['intent_accept','intent_decline'].includes(st)?`<span class="badge confirmed" data-intent-set>${Copy.dim('offer_decision_state',st)}</span>`:''}
        </div>
      </div>`);
    }
  }
  return `<div class="detail-section"><h3>Progress</h3>${progress}</div>${extra}${debriefBlock()}${offerBlock}`;
}
function recordContent(){
  const w=Store.get(`workspace.${oppId}`);
  const rows=w.interactions.map(([d,v])=>`<div class="source-row"><span>${h(v)}</span><time>${d}</time></div>`).join('');
  const cmts=w.commitments.map(c=>`<div class="brief-line" data-commitment="${c.id}"><span>${c.done?'Done':'Open'}:</span><strong>${h(c.text)}${c.due?` · ${h(c.due)}`:''}</strong>${!c.done?`<button class="text-btn" data-complete="${c.id}">Mark done</button>`:''}</div>`).join('');
  const oqs=w.openQuestions.map(q=>`<div class="brief-line" data-oq="${q.id}"><span>${q.resolved?'Resolved':'Open'}:</span><strong>${h(q.text)}</strong></div>`).join('');
  return `${section('Chronology',rows)}
    ${section('Commitments',`${cmts}<div class="actions"><input placeholder="Add commitment…" style="flex:1;padding:8px;border:1px solid var(--line);border-radius:6px" data-new-commitment><button class="btn" id="addCommitment">Add</button></div>`)}
    ${section('Open questions',`${oqs}<div class="actions"><input placeholder="Add question…" style="flex:1;padding:8px;border:1px solid var(--line);border-radius:6px" data-new-oq><button class="btn" id="addOq">Add</button></div>`)}`;
}

async function render(area){
  oppId=(location.hash.split('/')[2]||'').split('?')[0]||oppId;
  const wrap=html=>ctxShell?ctxShell(html,{activeNav:'opportunities'}):html;
  const o=opp();
  if(!o){root.innerHTML=`<div class="main"><div class="empty-state">Opportunity not found.</div></div>`;return}
  if(o.dims.candidate_disposition!=='pursuing'){
    root.innerHTML=wrap(shellFor(area,`<div class="empty-state" data-entry-guard>This workspace opens only after you choose Pursue. Current state: ${Copy.dim('candidate_disposition',o.dims.candidate_disposition)}.</div>`));
    bind();return;
  }
  ensureData();
  const content=area==='brief'?briefContent():area==='people'?peopleContent():area==='positioning'?positioningContent():area==='process'?processContent():recordContent();
  root.innerHTML=wrap(shellFor(area,content));
  bind();
}
function bind(){
  root.querySelectorAll('[data-area]').forEach(b=>b.onclick=()=>{location.hash=`#/workspace/${oppId}/${b.dataset.area}`});
  root.querySelectorAll('[data-run]').forEach(b=>b.onclick=async()=>{
    const payload={};
    if(b.dataset.entity)payload.entityId=b.dataset.entity;
    else if(b.dataset.offer)payload.entityId=b.dataset.offer;
    else payload.opportunityId=oppId;
    const r=await Actions.run(b.dataset.run,payload);
    if(true)
    if(!r.ok){const box=root.querySelector('#toast');document.getElementById('toast').textContent=`Blocked: ${(r.guard||r.reason||'policy')}`;document.getElementById('toast').classList.add('show');setTimeout(()=>document.getElementById('toast').classList.remove('show'),2000);return}
    render(currentArea());
  });
  const dp=root.querySelector('[data-diff]');
  root.querySelectorAll('[data-accept]').forEach(b=>b.onclick=()=>{
    const v=currentVariant();const ch=v.changes.find(c=>c.id===b.dataset.accept);ch.accepted=true;
    Store.log('resume_change_accepted',{variant:v.id,change:ch.id});render(currentArea());
  });
  root.querySelectorAll('[data-reject]').forEach(b=>b.onclick=()=>{
    const v=currentVariant();const ch=v.changes.find(c=>c.id===b.dataset.reject);ch.accepted=false;
    Store.log('resume_change_rejected',{variant:v.id,change:ch.id});render(currentArea());
  });
  function currentVariant(){return Store.get(`workspace.${oppId}`).resumeVariants[0]}
  root.querySelectorAll('[data-complete]').forEach(b=>b.onclick=async()=>{await Actions.run('ACT-COMMITMENT-COMPLETE',{commitmentId:b.dataset.complete});render(currentArea())});
  root.querySelector('#addCommitment')?.addEventListener('click',async()=>{
    const inp=root.querySelector('[data-new-commitment]');if(!inp.value.trim())return;
    await Actions.run('ACT-COMMITMENT-ADD',{text:inp.value.trim()});render(currentArea());
  });
  root.querySelector('#addOq')?.addEventListener('click',async()=>{
    const inp=root.querySelector('[data-new-oq]');if(!inp.value.trim())return;
    await Actions.run('ACT-OPEN-QUESTION-ADD',{text:inp.value.trim()});render(currentArea());
  });
  function currentArea(){return (location.hash.split('/')[3]||'brief').split('?')[0]}
}

routes.push({id:'workspace',path:'workspace/:id/:area',clients:['web'],async mount(ctx){
  root=ctx.root;ctxShell=ctx.shell;oppId=ctx.params.get('id');stageOverride=ctx.params.get('stage')||null;
  await render(ctx.params.get('area')||'brief');
}});
export {routes};
