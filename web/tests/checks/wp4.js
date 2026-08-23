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
const all=t=>[...document.querySelectorAll(t)];

export async function runSelfCheck(){
  Store.init(Fixtures.load('base'));
  const report=window.__scopeCareerSmokeReport||(window.__scopeCareerSmokeReport={checks:{},failed:[],errors:[]});
  const c={};const record=(name,ok)=>{c[`wp4.${name}`]=ok===true};

  // 1 — signals show sample size, window, confidence and preliminary framing; no prescription
  await nav('#/strategy');
  record('signalCardsRendered', all('[data-signal]').length>=2);
  const sigText=document.body.textContent;
  record('signalsHaveSamplesAndWindow', sigText.includes('applications')&&sigText.includes('Last 90 days'));
  record('preliminaryFramingPresent', !!q('[data-framing]')&&/Preliminary signal/i.test(sigText)&&!!q('[data-signal-disclaimer]'));
  record('noPrescriptiveLanguage', !/\byou (must|should) (avoid|quit|stop|only apply)/i.test(sigText));

  // 2 — experiment lifecycle via dispatcher (draft→active)
  const e0=Store.get('experiment.exp_1');
  record('experimentStartsDraft', e0.dims.strategy_experiment_state==='draft');
  q('[data-run="ACT-STRATEGY-EXPERIMENT-ACTIVATE"]')?.click();await sleep(90);
  record('experimentActivates', e0.dims.strategy_experiment_state==='active'&&
    window.__scopeCareerValidationLog.events.some(e=>e.canonical_action==='ACT-STRATEGY-EXPERIMENT-ACTIVATE'));

  // 3 — hypothesis/experiment creation
  await nav('#/strategy');
  q('[data-new-hypothesis]').value='Ops-director mandates fit better than CTO titles.';
  q('[data-new-scope]').value='Operations · India';
  q('#addExperiment').click();await sleep(100);
  record('experimentCreated', Object.keys(Store.get('experiment')||{}).length>=2);

  // 4 — market is contextual: reachable link inside Opportunities, no permanent Market tab
  await nav('#/opportunities');
  record('marketLinkContextual', !!q('[data-market-link]'));
  record('noPermanentMarketTab', !document.querySelector('[data-nav="market"]'));
  await nav('#/market');
  record('marketCompaniesRender', all('[data-company]').length>=3);
  record('marketBackToOpportunities', !!q('[data-back-link]'));
  const unwatched=q('[data-watch]');
  if(unwatched){const cid=unwatched.dataset.watch;unwatched.click();await sleep(80);
    record('companyWatchPersists', Store.get(`companies`).find(x=>x.id===cid).watch===true);}

  // 5 — privacy: sensitivity change persists; stealth preview transforms copy
  await nav('#/settings/privacy');
  const sel=q('[data-level="s_comp"]');
  sel.value='sensitive';sel.dispatchEvent(new Event('change'));await sleep(40);
  record('sensitivityPersists', Store.get('sensitivityFields').find(f=>f.id==='s_comp').level==='sensitive');
  record('stealthPreviewDiscreet', text('[data-stealth-preview]').includes('New opportunity update'));

  // 6 — data rights simulation with cancellation window gating
  q('[data-export]').click();await sleep(60);
  record('exportSimulated', Store.get('settings').exported===true);
  q('[data-delete-request]').click();await sleep(70);
  record('deleteCancellationWindow', Store.get('settings').deleteRequested===true&&!!q('[data-delete-pending]'));
  q('[data-delete-request]').click();await sleep(70);
  record('deleteRequiresDoubleConfirm', Store.get('settings').deleted===true);

  // 7 — audit viewer lists canonical actions with effect class
  await nav('#/settings/audit');
  record('auditListsCanonicalActions', all('[data-audit-table] tbody tr').length>=3&&text('[data-audit-table]').includes('ACT-'));
  record('auditShowsInternalOnly', text('[data-audit-table]').includes('internal only'));

  Object.assign(report.checks,c);
  report.failed=Object.entries(report.checks).filter(([,v])=>!v).map(([k])=>k);
  return report;
}
