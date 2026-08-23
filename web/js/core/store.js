let state={};
const subscribers=new Set();
const startedAt=performance.now();
const session={started_at:new Date().toISOString(),events:[]};
window.__scopeCareerValidationLog=session;

function get(path){
  return path.split('.').reduce((o,k)=>(o==null?undefined:o[k]),state);
}
function set(path,value){
  const keys=path.split('.');const last=keys.pop();
  let o=state;for(const k of keys){if(o[k]==null)o[k]={};o=o[k]}
  o[last]=value;
  subscribers.forEach(fn=>fn(path,value));
}
function log(type,detail={}){
  const e={t_ms:Math.round(performance.now()-startedAt),type,...detail};
  session.events.push(e);
  return e;
}
export const Store={
  init(seed){state=seed},
  get,set,
  subscribe:fn=>{subscribers.add(fn);return()=>subscribers.delete(fn)},
  log,
  snapshot:()=>state,
  dims(opportunityId,dimension){return get(`opportunities.${opportunityId}.dims.${dimension}`)},
  setDim(opportunityId,dimension,value){set(`opportunities.${opportunityId}.dims.${dimension}`,value)}
};
