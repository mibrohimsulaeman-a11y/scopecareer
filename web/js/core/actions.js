import {Contracts} from './contracts.js';
import {Store} from './store.js';

const effects=new Map();
const guards=new Map();

guards.set('supporting_observation_or_source AND confidence_present',()=>true);
guards.set('accepted_source_evidence',payload=>!!(payload&&payload.entityId));
guards.set('new_accepted_source_evidence',payload=>!!(payload&&payload.entityId));
guards.set('candidate_disposition == pursuing AND priority_policy_allows',payload=>{
  if(Store.dims(payload.opportunityId,'candidate_disposition')!=='pursuing')return false;
  const policy=Store.get('policy.priority')||{max_active:3};
  const active=Object.values(Store.get('opportunities')||{}).filter(o=>o.dims?.priority_allocation==='active').length;
  return active<policy.max_active;
});

function resolveHolder(entityId){
  for(const base of ['opportunities','claims','assertions','offers','resumeVariants','experiment']){
    const h=entityId&&Store.get(`${base}.${entityId}`);
    if(h)return {base,holder:h};
  }
  return null;
}
function dimPathsFor(actionId,payload){
  const out=[];
  const entityId=payload.entityId||payload.opportunityId;
  const found=resolveHolder(entityId);
  const opp=found&&found.holder;
  if(opp?.dims){
    for(const dimension of Object.keys(opp.dims)){
      const cur=opp.dims[dimension];
      const r=Contracts.transitionAny(cur,actionId);
      if(r.ok)out.push({dimension,...r});
    }
  }
  return out;
}

async function run(actionId,payload={}){
  await Contracts.ready();
  const transitions=dimPathsFor(actionId,payload);
  const entityId=payload.entityId||payload.opportunityId;
  const base=resolveHolder(entityId)?.base||'opportunities';
  for(const tr of transitions){
    if(tr.guard&&!guards.get(tr.guard)?.(payload)){
      Store.log('action_blocked',{canonical_action:actionId,reason:'guard_failed',guard:tr.guard,...summary(payload)});
      return {ok:false,reason:'guard_failed',guard:tr.guard};
    }
  }
  if(!transitions.length&&!effects.has(actionId)){
    Store.log('action_blocked',{canonical_action:actionId,reason:'no_valid_transition',...summary(payload)});
    return {ok:false,reason:'no_valid_transition'};
  }
  for(const tr of transitions)Store.set(`${base}.${entityId}.dims.${tr.dimension}`,tr.to);
  const effect=effects.get(actionId);
  let result=null;
  if(effect)result=await effect(payload,transitions);
  Store.log('action_executed',{canonical_action:actionId,external_effect:false,
    transitions:transitions.map(t=>({machine:t.machine,dimension:t.dimension,to:t.to})),...summary(payload)});
  return {ok:true,transitions,result};
}
function summary(p){
  const s={};
  for(const k of ['opportunityId','claimId','personId','variantId','offerId','experimentId','stage','value'])if(p[k]!=null)s[k]=p[k];
  return s;
}
export const Actions={
  run,
  register:(actionId,fn)=>effects.set(actionId,fn),
  guard:(expr,fn)=>guards.set(expr,fn)
};
