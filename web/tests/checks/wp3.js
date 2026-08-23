import {Contracts} from '../../js/core/contracts.js';
import {Store} from '../../js/core/store.js';
import {Actions} from '../../js/core/actions.js';
import {Copy} from '../../js/core/copy.js';
import {Fixtures} from '../../fixtures/index.js';

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function nav(hash){
  if(location.hash===hash){location.hash='#/';await sleep(40)}
  location.hash=hash;await sleep(120);
}
const q=sel=>document.querySelector(sel);
const text=sel=>q(sel)?.textContent||'';
const WS='#/workspace/opp_apac_vpt_01';

export async function runSelfCheck(){
  Store.init(Fixtures.load('base'));
  const report=window.__scopeCareerSmokeReport||(window.__scopeCareerSmokeReport={checks:{},failed:[],errors:[]});
  const c={};const record=(name,ok)=>{c[`wp3.${name}`]=ok===true};
  const pursuing=()=>Store.setDim('opp_apac_vpt_01','candidate_disposition','pursuing');

  // 1 — entry guard: workspace refuses non-pursuing opportunities
  Store.setDim('opp_apac_vpt_01','candidate_disposition','watching');
  await nav(`${WS}/brief`);
  record('entryGuardBlocksNonPursuing', !!q('[data-entry-guard]'));
  pursuing();
  await nav(`${WS}/brief`);
  record('workspaceOpensWhenPursuing', !!q('[data-workspace-content]')&&!q('[data-entry-guard]'));

  // 2 — stable five-area IA
  const areas=[...document.querySelectorAll('[data-area]')].map(x=>x.dataset.area);
  record('fiveAreaIA', ['brief','people','positioning','process','record'].every(a=>areas.includes(a)));

  // 3 — stage-aware next move changes
  await nav(`${WS}/brief?stage=precontact`);
  const nm1=text('[data-next-move] h3');
  await nav(`${WS}/brief?stage=offer`);
  const nm2=text('[data-next-move] h3');
  record('nextMoveStageAware', !!nm1&&!!nm2&&nm1!==nm2);

  // 4 — priority activate/deactivate while pursuing, canonical logs
  await nav(`${WS}/brief`);
  q('[data-priority-activate]')?.click();await sleep(80);
  const actEvt=window.__scopeCareerValidationLog.events.filter(e=>e.canonical_action==='ACT-PRIORITY-ACTIVATE').at(-1);
  record('priorityActivates', Store.dims('opp_apac_vpt_01','priority_allocation')==='active'&&actEvt&&actEvt.external_effect===false);
  q('[data-run="ACT-PRIORITY-DEACTIVATE"]')?.click();await sleep(80);
  record('priorityDeactivates', Store.dims('opp_apac_vpt_01','priority_allocation')==='inactive');

  // 5 — priority policy cap enforced via guard (budget shrunk to prove the gate)
  pursuing();
  Store.set('policy.priority',{max_active:1});
  await Actions.run('ACT-PRIORITY-ACTIVATE',{opportunityId:'opp_dubai_platform_02'});
  const r4=await Actions.run('ACT-PRIORITY-ACTIVATE',{opportunityId:'opp_india_transform_03'});
  const capHeld=r4.ok===false&&r4.reason==='guard_failed'&&Store.dims('opp_india_transform_03','priority_allocation')==='inactive';
  Store.set('policy.priority',{max_active:3});
  record('priorityPolicyCap', capHeld);

  // 6 — people separates relationship fact from route assessment
  await nav(`${WS}/people`);
  const person=q('[data-person]');
  record('personFactVsAssessment', !!person&&!!person.querySelector('.route-fact b')&&text('[data-route-assessment]').length>0&&person.textContent.includes('Relationship fact:'));

  // 7 — positioning brief prepare→commit
  await nav(`${WS}/positioning`);
  record('briefStartsDraft', text('[data-positioning-brief] .eyebrow').includes('draft'));
  q('[data-positioning-prepare]')?.click();await sleep(70);
  q('[data-positioning-commit]')?.click();await sleep(70);
  record('briefPrepareThenCommit', text('[data-positioning-brief] .eyebrow').includes('committed'));

  // 8 — resume variant lifecycle draft→reviewing→approved; per-change accept; approve≠share
  const v0=Store.get('resumeVariants.rv_apac_v1');
  record('variantStartsDraft', v0.dims.resume_variant_state==='draft');
  q('[data-run="ACT-RESUME-VARIANT-REVIEW"]')?.click();await sleep(80);
  record('variantReviewOpens', v0.dims.resume_variant_state==='reviewing');
  q('[data-diff]')?.click();await sleep(40);
  const diffText=text('[data-diff-table]');
  record('diffShowsOriginalProposedReasonEvidence', ['Original','Proposed','Reason:'].every(w=>diffText.includes(w))&&!!q('[data-change-evidence]'));
  q('[data-accept="ch_1"]')?.click();await sleep(60);
  record('changeAcceptPersisted', v0.changes.find(x=>x.id==='ch_1').accepted===true);
  q('[data-run="ACT-RESUME-VARIANT-APPROVE"]')?.click();await sleep(80);
  record('variantApprovesViaDispatcher', v0.dims.resume_variant_state==='approved');
  record('approveNotShareNote', /not share/i.test(document.body.textContent));

  // 9 — selection preparation with inference labels
  await nav(`${WS}/process?stage=selection`);
  record('participantPrepRendered', !!q('[data-participant="part_ceo"]'));
  record('agendaLabeledInference', [...document.querySelectorAll('[data-inference-label]')].length>=2);
  record('concernAndEvidenceShown', document.body.textContent.includes('adjacent, not exact')&&document.body.textContent.includes('Three-country platform expansion'));

  // 10 — debrief proposals commit via epistemic machine, no silent rewrite
  const p1=Store.get('assertions.ast_debrief_pnl'),p2=Store.get('assertions.ast_debrief_comp');
  record('debriefProposalsNeedResearch', p1.dims.epistemic_status==='needs_research'&&p2.dims.epistemic_status==='needs_research');
  q('[data-proposal-actions] [data-entity="ast_debrief_pnl"][data-run="ACT-ASSERTION-COMMIT-KNOWN"]')?.click();await sleep(80);
  record('commitKnownFlipsStatus', p1.dims.epistemic_status==='known');
  q('[data-proposal="ast_debrief_comp"] [data-run="ACT-ASSERTION-COMMIT-INFERRED"]')?.click();await sleep(80);
  record('commitInferredFlipsStatus', p2.dims.epistemic_status==='inferred');
  record('noSilentRewriteNotePresent', /never silently rewrites/i.test(document.body.textContent));

  // 11 — commitments add & complete
  await nav(`${WS}/record`);
  const inp=q('[data-new-commitment]');inp.value='Confirm reference #3';
  q('#addCommitment').click();await sleep(80);
  const added=[...(window.__scopeCareerValidationLog.events)].reverse().find(e=>e.canonical_action==='ACT-COMMITMENT-ADD');
  record('commitmentAdded', added&&document.body.textContent.includes('Confirm reference #3'));
  const newC=(Store.get(`workspace.opp_apac_vpt_01`).commitments).at(-1);
  q(`[data-complete="${newC.id}"]`)?.click();await sleep(70);
  record('commitmentCompleted', newC.done===true);

  // 12 — open question add
  const oqi=q('[data-new-oq]');oqi.value='Equity vesting details?';
  q('#addOq').click();await sleep(80);
  record('openQuestionAdded', document.body.textContent.includes('Equity vesting details?'));

  // 13 — offer hidden until offer stage; then full decision flow via dispatcher
  await nav(`${WS}/process?stage=selection`);
  record('offerHiddenBeforeOfferStage', !q('[data-offer-box]'));
  await nav(`${WS}/process?stage=offer`);
  const of=Object.values(Store.get('offers')).find(o=>o.oppId==='opp_apac_vpt_01');
  record('offerVisibleAtOfferStage', !!q('[data-offer-box]')&&of.dims.offer_decision_state==='received');
  q('[data-offer-box] [data-run="ACT-OFFER-REVIEW"]')?.click();await sleep(70);
  q('[data-offer-box] [data-run="ACT-OFFER-DECISION-PREPARE"]')?.click();await sleep(70);
  record('offerReachesDecisionReady', of.dims.offer_decision_state==='decision_ready');
  const beforeIntent=of.dims.offer_decision_state;
  q('[data-offer-box] [data-run="ACT-OFFER-INTENT-ACCEPT"]')?.click();await sleep(70);
  const intentEvt=window.__scopeCareerValidationLog.events.filter(e=>e.canonical_action==='ACT-OFFER-INTENT-ACCEPT').at(-1);
  record('offerIntentGatedFlow', beforeIntent==='decision_ready'&&of.dims.offer_decision_state==='intent_accept'&&intentEvt.external_effect===false);
  record('intentNotExternalNote', !!q('[data-intent-note], [data-intent-set]'));

  // 14 — offer content absent in precontact composition even though data exists
  await nav(`${WS}/process?stage=precontact`);
  record('offerAbsentInPrecontact', !q('[data-offer-box]'));

  Object.assign(report.checks,c);
  report.failed=Object.entries(report.checks).filter(([,v])=>!v).map(([k])=>k);
  return report;
}
