import fs from 'node:fs';
const target=JSON.parse(fs.readFileSync(process.env.SCOPECAREER_CDP_TARGET,'utf8'));
const ws=new WebSocket(target.webSocketDebuggerUrl);let seq=0;const pending=new Map();const errors=[];
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(new Error(`timeout ${method}`))}},10000)});
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result);return}if(m.method==='Runtime.exceptionThrown')errors.push(m.params?.exceptionDetails?.text||'runtime exception');if(m.method==='Runtime.consoleAPICalled'&&['error','assert'].includes(m.params?.type))errors.push((m.params.args||[]).map(x=>x.value??x.description).join(' '))};
await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});await send('Runtime.enable');await send('Page.enable');await send('Log.enable');
for(let i=0;i<100;i++){const q=await send('Runtime.evaluate',{expression:`Boolean(document.querySelector('#briefingLedger .ledger-event')&&window.__scopeCareerValidationLog&&window.__scopeCareerAssertions)`,returnByValue:true});if(q.result.value)break;await new Promise(r=>setTimeout(r,40))}
const evalv=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

// 1 — Briefing is a temporal event/action ledger, not a job feed.
const briefing=await evalv(`({
  groups:[...document.querySelectorAll('.ledger-group-head strong')].map(x=>x.textContent.trim()),
  events:document.querySelectorAll('.ledger-event').length,
  kinds:[...document.querySelectorAll('.event-time strong')].map(x=>x.textContent.trim()),
  hasRelationshipEvent:[...document.querySelectorAll('.event-subject strong')].some(x=>x.textContent.trim()==='Sarah Tan'),
  opportunityRows:document.querySelectorAll('#briefingView .opp-row').length,
  reportingText:[...document.querySelectorAll('.event-change')].map(x=>x.textContent.trim()).find(x=>x.includes('Reporting line')),
  genericGreeting:/good (morning|afternoon|evening)/i.test(document.getElementById('briefingView').textContent)
})`);

// 2 — Briefing event opens the opportunity dossier.
await evalv(`document.querySelector('[data-event="evt_reporting"] [data-event-open]').click();true`);await sleep(50);
const detail=await evalv(`({
  active:document.querySelector('#opportunitiesView').classList.contains('active'),
  role:document.querySelector('.insp-role')?.textContent.trim(),
  sections:[...document.querySelectorAll('#oppDetail .detail-section h3')].map(x=>x.textContent.trim()),
  reporting:[...document.querySelectorAll('[data-assertion="ast_reports_to"]')].map(x=>x.textContent.trim()).join(' '),
  team:[...document.querySelectorAll('[data-assertion="ast_team_size"]')].map(x=>x.textContent.trim()).join(' '),
  strategy:[...document.querySelectorAll('[data-assertion="ast_strategy_authority"]')].map(x=>x.textContent.trim()).join(' '),
  hasMetricCard:!!document.querySelector('.metric-card,.score-card,.metric-bar,[data-metric]'),
  cta:document.querySelector('.actions .btn.primary')?.textContent.trim()
})`);

// 3 — Explore is bounded research; Pursue is a separate commitment.
await evalv(`document.querySelector('[data-action="research"]').click();true`);await sleep(35);
const explore=await evalv(`({
  state:document.querySelector('.insp-status b')?.textContent.trim(),
  researchOpen:document.querySelector('#researchBlock')?.classList.contains('open'),
  pursueCta:document.querySelector('[data-action="pursue"]')?.textContent.trim(),
  event:window.__scopeCareerValidationLog.events.filter(x=>x.type==='disposition_changed').at(-1),
  external:window.__scopeCareerValidationLog.events.filter(x=>/send|apply|submit|external_effect/.test(x.type)).length
})`);

// Evidence binding is still truth-preserving.
await evalv(`document.querySelector('#evidenceToggle').click();true`);await sleep(15);
await evalv(`document.querySelector('.ev-opt').click();true`);await sleep(15);
await evalv(`document.querySelector('#bindEvidence').click();true`);await sleep(15);
const evidenceBound=await evalv(`window.__scopeCareerValidationLog.events.filter(x=>x.type==='evidence_bound').at(-1)`);

// 4/5 — Pursue activates the pre-contact working file; no external effect.
await evalv(`document.querySelector('[data-action="pursue"]').click();true`);await sleep(50);
const precontact=await evalv(`({
  active:document.querySelector('#pursuitView').classList.contains('active'),
  stage:document.querySelector('#pursuitStageEyebrow')?.textContent.trim(),
  nav:[...document.querySelectorAll('.workspace-nav-item')].map(x=>x.textContent.trim()),
  next:document.querySelector('.next-move h3')?.textContent.trim(),
  working:document.querySelector('#workspaceContent')?.textContent,
  rail:document.querySelector('#workspaceRail')?.textContent,
  event:window.__scopeCareerValidationLog.events.filter(x=>x.type==='disposition_changed'&&x.to==='pursuing').at(-1),
  external:window.__scopeCareerValidationLog.events.filter(x=>/send|apply|submit|external_effect/.test(x.type)).length
})`);

// 6 — recruiter conversation projection.
await evalv(`window.__scopeCareerSetWorkspaceStage('recruiter');true`);await sleep(35);
await evalv(`document.querySelector('[data-workspace-section="people"]').click();true`);await sleep(20);
const recruiterPeople=await evalv(`document.querySelector('#workspaceContent').textContent`);
await evalv(`document.querySelector('[data-workspace-section="record"]').click();true`);await sleep(20);
const recruiterRecord=await evalv(`document.querySelector('#workspaceContent').textContent`);
const recruiterAssertions=await evalv(`({pnl:window.__scopeCareerAssertions.pnl,comp:window.__scopeCareerAssertions.compensation})`);

// 7 — selection projection.
await evalv(`window.__scopeCareerSetWorkspaceStage('selection');document.querySelector('[data-workspace-section="process"]').click();true`);await sleep(35);
const selection=await evalv(`({content:document.querySelector('#workspaceContent').textContent,stage:document.querySelector('#pursuitStageEyebrow').textContent,authority:window.__scopeCareerAssertions.strategy_authority})`);

// 8 — final and offer projections.
await evalv(`window.__scopeCareerSetWorkspaceStage('final');document.querySelector('[data-workspace-section="process"]').click();true`);await sleep(30);
const finalStage=await evalv(`document.querySelector('#workspaceContent').textContent`);
await evalv(`window.__scopeCareerSetWorkspaceStage('offer');document.querySelector('[data-workspace-section="process"]').click();true`);await sleep(30);
const offer=await evalv(`({content:document.querySelector('#workspaceContent').textContent,comp:window.__scopeCareerAssertions.compensation,strategy:window.__scopeCareerAssertions.strategy_authority,pnl:window.__scopeCareerAssertions.pnl})`);

// 9 — cross-surface evidence revision: Offer snapshot must project back into Opportunity Detail.
await evalv(`document.querySelector('#backToOpportunities').click();true`);await sleep(30);
const offerDetail=await evalv(`({
  strategy:[...document.querySelectorAll('[data-assertion="ast_strategy_authority"]')].map(x=>x.textContent.trim()).join(' '),
  comp:[...document.querySelectorAll('[data-assertion="ast_comp"]')].map(x=>x.textContent.trim()).join(' '),
  decision:document.querySelector('.decision-line')?.textContent.trim()
})`);

// Reset to pre-contact snapshot and test same reporting-line assertion across Briefing, Detail and Workspace.
await evalv(`window.__scopeCareerSetWorkspaceStage('precontact');document.querySelector('#backToOpportunities').click();true`);await sleep(25);
const detailCEO=await evalv(`document.querySelector('[data-assertion="ast_reports_to"]')?.textContent.includes('CEO')`);
await evalv(`document.querySelector('.nav-item[data-view="briefing"]').click();true`);await sleep(20);
const briefingCEO=await evalv(`[...document.querySelectorAll('.event-change')].some(x=>x.textContent.includes('Reporting line confirmed: CEO'))`);
await evalv(`window.__scopeCareerSetWorkspaceStage('precontact');true`);await sleep(20);
const workspaceCEO=await evalv(`document.querySelector('#workspaceContent')?.textContent.includes('CEO · confirmed')`);

// 10 — shortlist + compare remains a collection/workbench affordance.
await evalv(`document.querySelector('#backToOpportunities').click();document.querySelector('[data-filter="shortlist"]').click();true`);await sleep(30);
await evalv(`document.querySelector('[data-compare="opp_dubai_platform_02"]').click();document.querySelector('[data-compare="opp_india_transform_03"]').click();true`);await sleep(25);
const compareBar=await evalv(`!document.querySelector('#compareBar').hidden`);
await evalv(`document.querySelector('#compareGo').click();true`);await sleep(30);
const compare=await evalv(`({visible:!document.querySelector('#compareView').hidden,cols:document.querySelectorAll('.cmp-table thead th').length-1,dims:[...document.querySelectorAll('.cmp-table tbody th')].map(x=>x.textContent.trim()),hasWinner:/winner|best score|match %/i.test(document.querySelector('#compareView').textContent)})`);
await evalv(`document.querySelector('#cmpBack').click();document.querySelector('[data-pin="opp_india_transform_03"]').click();true`);await sleep(30);
const shortlist=await evalv(`({count:document.querySelector('#countShortlist').textContent,all:(()=>{document.querySelector('[data-filter="all"]').click();return [...document.querySelectorAll('[data-row]')].some(r=>r.dataset.row==='opp_india_transform_03')})()})`);

// 11 — mobile uses list -> detail navigation instead of stacking both as one desktop page.
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await sleep(50);
await evalv(`document.querySelector('.nav-item[data-view="opportunities"]').click();document.querySelector('[data-filter="all"]').click();document.getElementById('workbench').classList.remove('mobile-detail-open');true`);await sleep(30);
const mobileBefore=await evalv(`({listVisible:getComputedStyle(document.querySelector('.list-pane')).display!=='none',detailVisible:getComputedStyle(document.querySelector('.inspector')).display!=='none'})`);
await evalv(`document.querySelector('[data-select="opp_dubai_platform_02"]').click();true`);await sleep(30);
const mobileDetail=await evalv(`({open:document.getElementById('workbench').classList.contains('mobile-detail-open'),listVisible:getComputedStyle(document.querySelector('.list-pane')).display!=='none',detailVisible:getComputedStyle(document.querySelector('.inspector')).display!=='none',back:!!document.querySelector('#mobileBackList')})`);
await evalv(`document.querySelector('#mobileBackList').click();true`);await sleep(20);
const mobileAfter=await evalv(`({open:document.getElementById('workbench').classList.contains('mobile-detail-open'),listVisible:getComputedStyle(document.querySelector('.list-pane')).display!=='none'})`);
await send('Emulation.clearDeviceMetricsOverride');

const checks={
  briefingIsTemporalLedger:briefing.groups.join('|')==='Now|Due today|Tomorrow'&&briefing.events===4&&briefing.hasRelationshipEvent&&briefing.opportunityRows===0&&!briefing.genericGreeting,
  briefingProjectsCanonicalAssertion:briefing.reportingText==='Reporting line confirmed: CEO.',
  opportunityDetailIsDecisionDossier:detail.active&&detail.role==='VP Technology'&&['What is supported','What could change the decision','Career move','Route in','Source trail'].every(x=>detail.sections.includes(x))&&!detail.hasMetricCard,
  provenanceIsVisible:detail.reporting.includes('CEO')&&detail.reporting.includes('Recruiter call')&&detail.reporting.includes('20 Aug')&&detail.reporting.includes('Confirmed')&&detail.team.includes('Estimate')&&detail.strategy.includes('Open'),
  contextualResearchCta:detail.cta==='Investigate authority & pay',
  exploreIsBoundedInternalResearch:explore.state==='Under review'&&explore.researchOpen&&explore.pursueCta==='Open pursuit workspace'&&explore.event?.canonical_action==='ACT-OPPORTUNITY-EXPLORE'&&explore.external===0,
  evidenceBindingPreservesTruth:evidenceBound?.truth_status_changed===false&&evidenceBound?.canonical_action==='ACT-MANDATE-EVIDENCE-BIND',
  pursueActivatesWorkspaceOnly:precontact.active&&precontact.stage==='PRE-CONTACT'&&precontact.event?.canonical_action==='ACT-OPPORTUNITY-PURSUE'&&precontact.event?.external_effect===false&&precontact.external===0,
  workspaceHasStableFiveAreaIA:['Brief','People','Positioning','Process','Record'].every(x=>(precontact.nav||[]).includes(x))&&(precontact.nav||[]).length===5,
  precontactIsNextMoveDriven:(precontact.next||'').includes('Confirm strategy ownership')&&(precontact.working||'').includes('Current picture')&&(precontact.working||'').includes('Open questions')&&(precontact.rail||'').includes('Selection')&&(precontact.rail||'').includes('Not started'),
  recruiterConversationIsStageAware:recruiterPeople.includes('Jane Liu')&&recruiterPeople.includes('Search consultant')&&recruiterRecord.includes('Latest debrief')&&recruiterRecord.includes('Proposed assertion')&&recruiterAssertions.pnl.status==='Estimate',
  selectionIsStakeholderAware:selection.stage==='SELECTION'&&selection.content.includes('CEO interview')&&selection.content.includes('Known concern')&&selection.content.includes('Direct fintech experience')&&selection.authority.status==='Confirmed',
  finalRoundIsContextual:finalStage.includes('15-minute operating thesis')&&finalStage.includes('References'),
  offerIsDecisionSurface:offer.content.includes('Offer terms')&&offer.content.includes('SGD 310k')&&offer.strategy.status==='Confirmed'&&offer.comp.status==='Confirmed'&&offer.pnl.status==='Confirmed',
  evidenceRevisionProjectsAcrossSurfaces:offerDetail.strategy.includes('Owns regional technology strategy')&&offerDetail.strategy.includes('Confirmed')&&offerDetail.comp.includes('SGD 310k')&&offerDetail.comp.includes('Confirmed')&&offerDetail.decision.includes('Authority and package are now known'),
  sameFactProjectsBriefDetailWorkspace:detailCEO&&briefingCEO&&workspaceCEO,
  compareIsTradeoffNotWinner:compareBar&&compare.visible&&compare.cols===2&&compare.dims.includes('Trajectory')&&compare.dims.includes('Biggest unknown')&&!compare.hasWinner,
  shortlistMembershipIndependent:shortlist.count==='2'&&shortlist.all===true,
  mobileUsesDedicatedListDetail:mobileBefore.listVisible&&!mobileBefore.detailVisible&&mobileDetail.open&&!mobileDetail.listVisible&&mobileDetail.detailVisible&&mobileDetail.back&&!mobileAfter.open&&mobileAfter.listVisible,
  noRuntimeErrors:errors.length===0
};
const failed=Object.entries(checks).filter(([,v])=>!v).map(([k])=>k);
const report={checks,failed,errors,briefing,detail,explore,evidenceBound,precontact,recruiterPeople,recruiterRecord,recruiterAssertions,selection,finalStage,offer,offerDetail,crossSurface:{detailCEO,briefingCEO,workspaceCEO},compare,shortlist,mobile:{before:mobileBefore,detail:mobileDetail,after:mobileAfter}};
fs.writeFileSync(new URL('./prototype_smoke_v3_report.json',import.meta.url),JSON.stringify(report,null,2));
console.log(JSON.stringify({checks:Object.keys(checks).length,passed:Object.keys(checks).length-failed.length,failed,errors},null,2));
ws.close();if(failed.length)process.exit(1);
