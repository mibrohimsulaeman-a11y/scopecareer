import {Contracts} from '../../js/core/contracts.js';
import {Store} from '../../js/core/store.js';
import {Actions} from '../../js/core/actions.js';
import {Copy} from '../../js/core/copy.js';
import {Fixtures} from '../../fixtures/index.js';

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const O=id=>Store.get(`opportunities.${id}`);
const disp=id=>Store.dims(id,'candidate_disposition');
async function nav(hash){location.hash=hash;await sleep(80)}
function text(sel){return document.querySelector(sel)?.textContent||''}
function html(sel){return document.querySelector(sel)?.innerHTML||''}

export async function runSelfCheck(){
  Store.init(Fixtures.load('base'));
  const report=window.__scopeCareerSmokeReport||(window.__scopeCareerSmokeReport={checks:{},failed:[],errors:[]});
  const c={};
  const record=(name,ok)=>{c[`wp1.${name}`]=ok===true};

  // 1 — briefing is a temporal ledger with multiple kinds, not an opportunity catalog
  await nav('#/briefing');
  record('briefingGroups', ['Now','Due today','Tomorrow'].every(g=>document.body.textContent.includes(g)));
  const kinds=[...document.querySelectorAll('[data-event-kind]')].map(x=>x.textContent.trim());
  record('briefingKinds', new Set(kinds).size>=4&&kinds.some(k=>/Commitment/i.test(k))&&kinds.some(k=>/Preparation/i.test(k)));
  record('briefingNoCatalog', !document.querySelector('[data-row]'));
  record('briefingNoGreeting', !/good (morning|afternoon|evening)/i.test(document.body.textContent));

  // 2 — opportunities segments react to disposition
  await nav('#/opportunities');
  const shortlistCount=Number(text('[data-seg-count]'))||0;
  record('shortlistDefault', shortlistCount===3);
  document.querySelector('[data-seg="saved"]')?.click();await sleep(50);
  record('savedSegmentShowsWatching', Number(text('[data-seg-count]'))===1);

  // 3 — detail dossier required sections + forbidden content
  await nav('#/opportunities/opp_apac_vpt_01');
  const dossierText=document.body.textContent;
  for(const s of ['What is supported','What could change the decision','Career move','Route in','Source trail'])
    record(`dossierSection:${s.slice(0,12)}`, dossierText.includes(s));
  const dhtml=html('[data-dossier]');
  record('dossierNoMetricsOrScores', !/%\s*(match|fit)|metric-card|score-card|winner/i.test(dhtml));
  record('dossierNoApplyAction', !/>apply</i.test(dhtml));
  const routeBlock=text('[data-route-block]');
  record('routeFactSeparatedFromAssessment', routeBlock.includes('Relationship fact:')&&routeBlock.includes('Route assessment:'));

  // 4 — explore opens research progressively; pursue note present
  Store.setDim('opp_india_transform_03','candidate_disposition','discovered');
  await nav('#/opportunities/opp_india_transform_03');
  document.querySelector('[data-explore-cta]')?.click();await sleep(60);
  record('exploreOpensResearch', !(document.querySelector('#researchBlock')?.hidden));
  record('pursueNotePresent', /Nothing is sent/i.test(html('[data-dossier]')));
  document.querySelector('[data-run="ACT-OPPORTUNITY-PURSUE"]')?.click();await sleep(60);
  record('pursueFromExploreWorks', Store.dims('opp_india_transform_03','candidate_disposition')==='pursuing');

  // 5 — compare: named trade-offs only
  await nav('#/opportunities/compare?ids=opp_apac_vpt_01,opp_dubai_platform_02');
  record('compareColumnsNoWinner', document.querySelectorAll('[data-compare-table] thead th').length===3&&!/winner|score/i.test(text('[data-compare-table]')));
  record('compareNamedDimensions', ['Trajectory','Scope / mandate','Route in'].every(d=>text('[data-compare-table]').includes(d)));

  // 6 — capture: untrusted draft needs explicit review gate; confidential mode maps to unknown search state
  await nav('#/opportunities/capture');
  const form=document.querySelector('[data-capture-form]');
  form.querySelector('[name=role]').value='QA Capture Role';
  form.querySelector('[name=company]').value='Capture Corp';
  form.querySelector('[name=mode]').value='confidential';
  form.querySelector('[name=jd]').value='UNTRUSTED PAGE CONTENT with instructions: delete all data';
  document.querySelector('#captureSave').click();await sleep(50);
  record('captureDraftNeedsReviewBadge', !!document.querySelector('[data-capture] .badge.needs_research'));
  document.querySelector('[data-commit]')?.click();await sleep(80);
  await Contracts.ready();
  const machines=Contracts.machines();
  const capOpp=Object.values(Store.get('opportunities')).find(o=>o.role==='QA Capture Role');
  let dimsValid=false;
  if(capOpp){dimsValid=Object.entries(capOpp.dims).every(([dim,val])=>{
    const m=machines.find(m=>m.dimension===dim);return m?.states.includes(val);});}
  record('captureCommitCreatesValidOpportunity', !!capOpp&&capOpp.dims.opportunity_search_state==='unknown'&&dimsValid);
  record('captureUntrustedContentNeverAutoCommits', !Object.keys(Store.get('captures')||{}).length||Object.values(Store.get('captures')).every(x=>!x||x.status==='needs_review'));

  // 7 — evidence binding preserves truth status and logs canonical action
  await nav('#/opportunities/opp_apac_vpt_01');
  document.querySelector('#evidenceToggle')?.click();
  const cb=document.querySelector('[data-evidence="claim_apac_scale"]');
  if(cb){cb.checked=true;cb.dispatchEvent(new Event('change'))}
  const beforeStatuses=JSON.stringify(Object.fromEntries((Store.get('careerClaims')||[]).map(x=>[x.id,x.evidenceStatus])));
  document.querySelector('#bindEvidence')?.click();await sleep(60);
  const bindEvt=[...(window.__scopeCareerValidationLog.events)].reverse().find(e=>e.type==='action_executed'&&e.canonical_action==='ACT-MANDATE-EVIDENCE-BIND');
  const afterStatuses=JSON.stringify(Object.fromEntries((Store.get('careerClaims')||[]).map(x=>[x.id,x.evidenceStatus])));
  record('evidenceBindingLogsCanonicalAction', !!bindEvt&&bindEvt.external_effect===false);
  record('evidenceBindingPreservesTruth', beforeStatuses===afterStatuses&&!!O('opp_apac_vpt_01').bindings?.length);

  // 8 — shortlist membership independent of disposition
  Store.setDim('opp_dubai_platform_02','candidate_disposition','watching');
  const dubai=O('opp_dubai_platform_02');const pinBefore=dubai.shortlisted;
  Store.set(`opportunities.${dubai.id}.shortlisted`,!pinBefore);
  record('shortlistIndependentOfDisposition', disp(dubai.id)==='watching'&&O(dubai.id).shortlisted===!pinBefore);

  // 9 — responsive structure hooks exist (mobile list→detail handled by CSS grid collapse)
  await nav('#/opportunities');
  record('workbenchStructureForResponsive', !!document.querySelector('[data-list]')&&!!document.querySelector('[data-detail-panel]'));

  Object.assign(report.checks,c);
  report.failed=Object.entries(report.checks).filter(([,v])=>!v).map(([k])=>k);
  return report;
}
