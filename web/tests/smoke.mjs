import fs from 'node:fs';
const target=JSON.parse(fs.readFileSync(process.env.SCOPECAREER_CDP_TARGET,'utf8'));
const ws=new WebSocket(target.webSocketDebuggerUrl);let seq=0;const pending=new Map();const errors=[];
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(new Error(`timeout ${method}`))}},15000)});
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result);return}if(m.method==='Runtime.exceptionThrown'){const d=m.params?.exceptionDetails||{};if(!rawDumped){rawDumped=true;errors.push('RAW:'+JSON.stringify(d))}errors.push(`${d.text||'runtime exception'} ${d.exception?.description||d.url||''} @line ${d.lineNumber??'?'}`)}if(m.method==='Runtime.consoleAPICalled'&&['error','assert'].includes(m.params?.type))errors.push((m.params.args||[]).map(x=>x.value??x.description).join(' '))};
await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});await send('Runtime.enable');await send('Page.enable');
let report=null;
for(let i=0;i<400;i++){
  const q=await send('Runtime.evaluate',{expression:'(window.__scopeCareerSmokeReport&&window.__scopeCareerSmokeReport.complete)?window.__scopeCareerSmokeReport:null',returnByValue:true});
  if(q.result.value){report=q.result.value;break}
  await new Promise(r=>setTimeout(r,50));
}
if(!report){
  console.error('ScopeCareer web smoke: report never appeared');
  if(errors.length)console.error('collected errors:\n'+errors.slice(0,10).join('\n'));
  process.exit(2);
}
report.runtimeErrors=(report.runtimeErrors||[]).concat(errors);
report.passed=Object.values(report.checks).filter(Boolean).length;
console.log(`ScopeCareer web self-check: ${report.failed.length===0&&report.runtimeErrors.length===0?'PASS':'FAIL'} (${report.passed}/${Object.keys(report.checks).length} checks)`);
if(report.failed.length)console.log('failed:',report.failed.join(', '));
if(report.runtimeErrors.length)console.log('runtime errors:',report.runtimeErrors.slice(0,10).join('\n'));
fs.writeFileSync(process.env.SCOPECAREER_WEB_REPORT||'/dev/stdout',JSON.stringify(report,null,2));
process.exit(report.failed.length===0&&report.runtimeErrors.length===0?0:1);
