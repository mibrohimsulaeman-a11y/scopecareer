import {Contracts} from '../../js/core/contracts.js';
import {Store} from '../../js/core/store.js';
import {Actions} from '../../js/core/actions.js';
import {Copy} from '../../js/core/copy.js';

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function nav(hash){location.hash=hash;await sleep(100)}
const text=sel=>document.querySelector(sel)?.textContent||'';

export async function runSelfCheck(){
  const report=window.__scopeCareerSmokeReport||(window.__scopeCareerSmokeReport={checks:{},failed:[],errors:[]});
  const c={};const record=(name,ok)=>{c[`wp2.${name}`]=ok===true};

  // 1 — evidence review renders the four independent dimensions
  await nav('#/career/evidence');
  const row=document.querySelector('[data-claim="claim_apac_scale"]');
  const rt=row?row.textContent:'';
  for(const d of ['Provenance','Evidence status','Interpretation','Usage permission'])
    record(`dim:${d.slice(0,6)}`, rt.includes(d));
  record('attestNotePresent', !!document.querySelector('[data-attest-note]')&&/not.*independently verified/i.test(text('[data-attest-note]')));
  record('aiProposalDistinct', !!row.querySelector('[data-provenance="ai-extraction"]')||!!document.querySelector('[data-provenance="ai-extraction"]'));

  // 2 — attest moves proposed→attested via dispatcher with canonical action
  await nav('#/career/evidence');
  const merger=document.querySelector('[data-claim="claim_merger"]');
  const attestBtn=merger&&merger.querySelector('[data-run="ACT-CAREER-CLAIM-ATTEST"]');
  record('proposedHasAttestAction', !!attestBtn);
  if(attestBtn){attestBtn.click();await sleep(80)}
  record('attestTransitionWorks', Store.get('claims.claim_merger').dims.claim_review_state==='attested');
  const evts=window.__scopeCareerValidationLog.events.filter(e=>e.type==='action_executed'&&e.canonical_action==='ACT-CAREER-CLAIM-ATTEST');
  record('attestLogsCanonicalAction', evts.length>=1);

  // 3 — illegal jump rejected: attested claim cannot silently revert to proposed
  const r=await Actions.run('ACT-CAREER-CLAIM-PROPOSE',{entityId:'claim_apac_scale'});
  record('illegalClaimJumpRejected', r.ok===false&&Store.get('claims.claim_apac_scale').dims.claim_review_state==='attested');

  // 4 — intent editor persists
  await nav('#/career/intent');
  const f=document.querySelector('[data-intent-form]');
  f.querySelector('[name=seniority]').value='VP–C-level';
  document.querySelector('#intentSave').click();
  record('intentPersists', Store.get('careerIntent').seniority==='VP–C-level');

  // 5 — artifacts stories reference existing claims
  await nav('#/career/artifacts');
  const storyIds=[...document.querySelectorAll('[data-story]')].map(x=>x.dataset.story);
  const okRefs=storyIds.every(id=>{
    const st=Store.get(`artifacts.stories`)||[];
    return true;
  });
  const allClaimIds=new Set(Object.keys(Store.get('claims')||{}));
  const stories=Store.get('artifacts').stories||[];
  record('storyClaimsResolve', stories.every(st=>(st.claims||[]).every(cid=>allClaimIds.has(cid))));

  // 6 — onboarding walkable: import proposes two AI-extraction claims, finish lands on briefing
  await nav('#/onboarding?step=1');
  document.querySelector('[data-onb-step="1"] #onbNext')?.click();await sleep(60);
  document.querySelector('[data-onb-step="2"] #onbImport')?.click();await sleep(60);
  const proposedCount=Object.values(Store.get('claims')||{}).filter(x=>x.dims.claim_review_state==='proposed'&&x.provenance==='AI Extraction').length;
  document.querySelector('[data-onb-step="3"] #onbToIntent')?.click();await sleep(40);
  await nav('#/onboarding?step=4');
  document.querySelector('[data-onb-step="4"] #onbFinish')?.click();await sleep(80);
  record('onboardingProposesTwoClaims', proposedCount>=2);
  record('onboardingLandsOnBriefing', location.hash.startsWith('#/briefing'));

  Object.assign(report.checks,c);
  report.failed=Object.entries(report.checks).filter(([,v])=>!v).map(([k])=>k);
  return report;
}
