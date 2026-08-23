import fs from 'node:fs';
const target=JSON.parse(fs.readFileSync(process.env.SCOPECAREER_CDP_TARGET,'utf8'));
const ws=new WebSocket(target.webSocketDebuggerUrl);let seq=0;const pending=new Map();const errors=[];
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(new Error(`timeout ${method}`))}},10000)});
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result);return}if(m.method==='Runtime.exceptionThrown')errors.push(m.params?.exceptionDetails?.text||'runtime exception');if(m.method==='Runtime.consoleAPICalled'&&['error','assert'].includes(m.params?.type))errors.push((m.params.args||[]).map(x=>x.value??x.description).join(' '))};
await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});await send('Runtime.enable');await send('Page.enable');await send('Log.enable');
for(let i=0;i<80;i++){const q=await send('Runtime.evaluate',{expression:`Boolean(document.querySelector('#briefingGroups .brief-item')&&window.__scopeCareerValidationLog)`,returnByValue:true});if(q.result.value)break;await new Promise(r=>setTimeout(r,40))}
const evalv=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

/* 1 — briefing is a temporal action queue */
const initial=await evalv(`({
  groups:[...document.querySelectorAll('.group-label')].map(x=>x.dataset.kind),
  items:document.querySelectorAll('.brief-item').length,
  eventLabels:[...document.querySelectorAll('.brief-event')].map(x=>x.textContent.trim()),
  genericDecisionRepeat:(document.getElementById('briefingGroups').textContent.match(/DECISION/g)||[]).length,
  researchVisible:!document.querySelector('#researchToggle').hidden,
  todayNav:[...document.querySelectorAll('.nav-item')].some(x=>x.textContent.trim()==='Today')
})`);

/* 2 — briefing CTA opens the right opportunity with structured argument */
await evalv(`document.querySelector('[data-brief-cta="open_brief"]').click();true`);await sleep(50);
const opened=await evalv(`({
  oppView:document.querySelector('#opportunitiesView').classList.contains('active'),
  shortlistTab:document.querySelector('.tab.active')?.dataset.filter,
  listRows:document.querySelectorAll('.opp-row').length,
  detailRole:document.querySelector('.insp-role')?.textContent,
  sections:['Evidence for','Open questions','Route in','Sources'].map(t=>document.getElementById('oppDetail').textContent.includes(t)),
  metricBars:!!document.querySelector('.metric-bar,.score-bar,[data-metric]'),
  actions:[...document.querySelectorAll('.actions [data-action]')].map(x=>x.textContent.trim())
})`);

/* 3 — contextual CTA follows missing work */
await evalv(`document.querySelector('[data-select="opp_dubai_platform_02"]').click();true`);await sleep(35);
const meridianCta=await evalv(`document.querySelector('.actions .btn.primary')?.textContent.trim()`);
await evalv(`document.querySelector('[data-select="opp_india_transform_03"]').click();true`);await sleep(35);
const northstarCta=await evalv(`document.querySelector('.actions .btn.primary')?.textContent.trim()`);
await evalv(`document.querySelector('[data-select="opp_apac_vpt_01"]').click();true`);await sleep(35);

/* 4 — explore via contextual CTA maps to canonical action; research is progressive */
await evalv(`document.querySelector('.actions [data-action="research"]').click();true`);await sleep(40);
const researching=await evalv(`({
  state:document.querySelector('.insp-status b')?.textContent.trim(),
  researchOpen:document.querySelector('#researchBlock')?.classList.contains('open'),
  hasRoutes:document.querySelectorAll('.route-opt').length,
  actions:[...document.querySelectorAll('.actions [data-action]')].map(x=>x.textContent.trim())
})`);
const canonicalExplore=await evalv(`window.__scopeCareerValidationLog.events.filter(x=>x.type==='disposition_changed').at(-1)`);

/* 5 — evidence binding never changes truth status */
await evalv(`document.querySelector('#evidenceToggle').click();true`);await sleep(20);
await evalv(`document.querySelector('.ev-opt').click();true`);await sleep(25);
await evalv(`document.querySelector('#bindEvidence').click();true`);await sleep(20);

/* 6 — pursue stays internal and explicit */
await evalv(`document.querySelector('[data-action="pursue"]').click();true`);await sleep(40);
const final=await evalv(`(()=>{
  const ev=window.__scopeCareerValidationLog.events;
  return{
    state:document.querySelector('.insp-status b')?.textContent.trim(),
    actions:[...document.querySelectorAll('.actions [data-action]')].map(x=>x.textContent.trim()),
    workspace:!!document.querySelector('.workspace-strip'),
    evidenceBound:ev.filter(x=>x.type==='evidence_bound').at(-1),
    pursuing:ev.filter(x=>x.type==='disposition_changed'&&x.to==='pursuing').at(-1),
    externalEffects:ev.filter(x=>/send|apply|external_effect/.test(x.type)).length
  }
})()`);

/* 7 — compare affordance across shortlist */
await evalv(`document.querySelector('[data-compare="opp_dubai_platform_02"]').click();true`);await sleep(25);
await evalv(`document.querySelector('[data-compare="opp_india_transform_03"]').click();true`);await sleep(25);
const barVisible=await evalv(`!document.querySelector('#compareBar').hidden`);
await evalv(`document.querySelector('#compareGo').click();true`);await sleep(40);
const compare=await evalv(`({
  visible:!document.querySelector('#compareView').hidden,
  columns:[...document.querySelectorAll('.cmp-table thead th')].length-1,
  dimensions:[...document.querySelectorAll('.cmp-table tbody th')].map(x=>x.textContent.trim()),
  workbenchHidden:document.querySelector('#workbench').hidden
})`);
await evalv(`document.querySelector('#cmpBack').click();true`);await sleep(30);

/* 8 — shortlist is a pinned collection, independent of disposition */
await evalv(`document.querySelector('[data-pin="opp_india_transform_03"]').click();true`);await sleep(35);
const pin=await evalv(`({
  shortlistCount:document.querySelector('#countShortlist').textContent,
  stillInAll:(()=>{document.querySelector('[data-filter="all"]').click();return [...document.querySelectorAll('[data-row]')].some(r=>r.dataset.row==='opp_india_transform_03')})(),
  statePreserved:document.querySelector('[data-row="opp_india_transform_03"] .row-fresh')!==undefined
})`);

const checks={
  briefingIsActionQueue:initial.groups.includes('Needs a decision')&&initial.groups.includes('Due today')&&initial.items===3&&initial.genericDecisionRepeat===0&&initial.eventLabels.every(t=>t.length>0),
  noDuplicateTodayNav:initial.todayNav===false,
  researcherHiddenByDefault:initial.researchVisible===false,
  shortlistVisibleInOpportunities:opened.oppView&&opened.shortlistTab==='shortlist'&&opened.listRows===3,
  splitDetailWorks:opened.detailRole==='VP Technology',
  structuredArgumentNotDataModel:opened.sections.every(Boolean)&&opened.metricBars===false,
  contextualCtaFollowsMissingWork:meridianCta==='Investigate scope & reporting'&&northstarCta==='Prepare for call',
  initialCtaClear:opened.actions.includes('Investigate authority & pay')&&opened.actions.includes('Save for later')&&opened.actions.includes('Close'),
  researchProgressive:researching.state==='Under review'&&researching.researchOpen===true&&researching.hasRoutes>=2,
  ctaMapsToCanonicalExplore:canonicalExplore?.canonical_action==='ACT-OPPORTUNITY-EXPLORE'&&canonicalExplore?.surface_label==='Investigate authority & pay',
  pursuingCtaClear:researching.actions.includes('Open pursuit workspace'),
  evidenceTruthUnchanged:final.evidenceBound?.truth_status_changed===false&&final.evidenceBound?.canonical_action==='ACT-MANDATE-EVIDENCE-BIND',
  pursuingActionsAligned:final.state==='Active'&&final.actions.includes('Open workspace')&&final.actions.includes('Add note')&&!final.actions.includes('Investigate authority & pay'),
  pursueNotExternal:final.pursuing?.canonical_action==='ACT-OPPORTUNITY-PURSUE'&&final.externalEffects===0,
  compareAffordanceWorks:barVisible&&compare.visible&&compare.columns===2&&compare.dimensions.length>=5&&compare.workbenchHidden===true,
  shortlistIsCollectionNotLifecycle:pin.shortlistCount==='2'&&pin.stillInAll===true&&pin.statePreserved===true,
  noRuntimeErrors:errors.length===0
};
const failed=Object.entries(checks).filter(([,v])=>!v).map(([k])=>k);
const report={checks,failed,errors,initial,opened,ctas:{meridianCta,northstarCta},researching,canonicalExplore,final,compare,pin};
fs.writeFileSync(new URL('./prototype_smoke_report.json',import.meta.url),JSON.stringify(report,null,2));
console.log(JSON.stringify({checks:Object.keys(checks).length,passed:Object.keys(checks).length-failed.length,failed,errors},null,2));
ws.close();if(failed.length)process.exit(1);
