import {Store} from '../../js/core/store.js';
import {Router} from '../../js/router.js';
import {Fixtures} from '../../fixtures/index.js';

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function nav(hash){
  if(location.hash===hash){location.hash='#/';await sleep(40)}
  location.hash=hash;await sleep(170);
}
const q=sel=>document.querySelector(sel);

export async function runSelfCheck(){
  const report=window.__scopeCareerSmokeReport||(window.__scopeCareerSmokeReport={checks:{},failed:[],errors:[]});
  const c={};const record=(name,ok)=>{c[`wp5.${name}`]=ok===true};

  // 1 — error boundary catches a broken mount and offers recovery
  let boom=true;
  Router.registerRoutes([{id:'wp5-boom',path:'boom',clients:['web'],async mount(){if(boom)throw new Error('intentional test failure');}}]);
  await nav('#/boom');
  record('errorBoundaryCatches', !!q('[data-error-state]'));
  record('renderErrorLogged', window.__scopeCareerValidationLog.events.some(e=>e.type==='render_error'));
  boom=false;
  await nav('#/boom');
  record('errorRecoveryPossible', !q('[data-error-state]'));

  // 2 — degraded mode banner on web-only surfaces at mobile widths
  const om=window.matchMedia;
  window.matchMedia=query=>query.includes('760')?{matches:true,media:query}:om(query);
  Store.setDim('opp_apac_vpt_01','candidate_disposition','pursuing');
  await nav('#/workspace/opp_apac_vpt_01/brief');
  record('degradedBannerWebOnly', !!q('[data-degraded-banner]'));
  window.matchMedia=om;
  await nav('#/opportunities');
  record('noDegradedOnPwaSurface', !q('[data-degraded-banner]'));

  // 3 — stale evidence banner on flagged dossier
  await nav('#/opportunities/opp_india_transform_03');
  record('staleBannerWhenFlagged', !!q('[data-stale-banner]'));
  await nav('#/opportunities/opp_apac_vpt_01');
  record('noStaleBannerWhenFresh', !q('[data-stale-banner]'));

  // 4.5 — confidence rendering visible on estimates (fresh dossier)
  await nav('#/opportunities/opp_apac_vpt_01');
  let confSeen=false;
  for(let i=0;i<10&&!confSeen;i++){confSeen=/moderate/i.test(document.body.textContent)&&document.body.textContent.includes('confidence');if(!confSeen)await sleep(60)}
  record('confidenceLabelRendered', confSeen);
  if(!confSeen){report.debug={hash:location.hash,head:document.getElementById('app').innerHTML.replace(/\s+/g,' ').slice(0,240),impacts:[...document.querySelectorAll('.impact')].map(x=>x.textContent).slice(0,5)}}

  // 4 — ai-pending placeholder for un-researched captured opportunity
  Store.set(`opportunities.opp_cap_test`,{id:'opp_cap_test',role:'Capture Test',company:'X',location:'—',shortlisted:false,updated:'Now',fresh:'Captured',trajectory:'Not yet assessed',routeShort:'None known',cta:'Investigate',decision:'Draft captured.',sources:[['Manual capture','Now','Draft']],routes:[],research:{supports:[],unknowns:['Scope']},dims:{candidate_disposition:'discovered',opportunity_search_state:'unknown',candidate_selection_state:'not_started',priority_allocation:'inactive'}});
  await nav('#/opportunities/opp_cap_test');
  record('aiPendingPlaceholder', !!q('[data-ai-pending]'));


  // 6 — accessibility tokens present
  let css='';for(const sh of document.styleSheets){try{for(const r of sh.cssRules)css+=r.cssText.replace(/\s+/g,'')+'\n'}catch(e){}}
  record('focusVisibleStyled', css.includes(':focus-visible'));
  record('reducedMotionHonored', css.includes('prefers-reduced-motion'));
  record('sidebarMobileScrollable', css.includes('overflow-x:auto'));

  // 7 — PWA shell
  record('manifestLinked', !!document.querySelector('link[rel=manifest]')&&document.querySelector('link[rel=manifest]').href.includes('manifest.webmanifest'));
  const offlineOk=await fetch('./offline.html').then(r=>r.ok).catch(()=>false);
  record('offlineFallbackExists', offlineOk===true);
  const manifestOk=await fetch('./manifest.webmanifest').then(r=>r.json()).then(j=>!!j.icons&&j.display==='standalone').catch(()=>false);
  record('manifestInstallable', manifestOk===true);

  // 8 — badge aria labeling
  const b=q('[role="status"][aria-label]');
  record('badgesHaveAriaLabels', !!b&&(b.getAttribute('aria-label')||'').length>3);

  Object.assign(report.checks,c);
  report.failed=Object.entries(report.checks).filter(([,v])=>!v).map(([k])=>k);
  return report;
}
