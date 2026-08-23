const BASE='/contracts/v1';
let registries=null;
const readyPromise=(async()=>{
  const names=['states/state_registry','actions/action_registry','entities/entity_registry','views/view_model_registry','journeys/journey_registry'];
  const [states,actions,entities,views,journeys]=await Promise.all(names.map(n=>fetch(`${BASE}/${n}.json`).then(r=>{
    if(!r.ok)throw new Error(`contract fetch failed: ${n} ${r.status}`);return r.json();
  })));
  registries={states,actions,entities,views,journeys};
  return registries;
})();

function machine(id){return registries.states.state_machines.find(m=>m.id===id)}
function machines(){return registries.states.state_machines}
function transitionByAction(actionId,currentState){
  for(const m of machines()){
    if(!m.states.includes(currentState))continue;
    const t=m.transitions.find(t=>t.action===actionId&&t.from===currentState);
    if(t)return {ok:true,machine:m.id,dimension:m.dimension,to:t.to,guard:t.guard||null};
  }
  return {ok:false};
}
export const Contracts={
  ready:()=>readyPromise,
  machine,machines,
  transition:(machineId,current,actionId)=>{
    const m=machine(machineId);
    const t=m&&m.transitions.find(t=>t.action===actionId&&t.from===current);
    return t?{ok:true,to:t.to,guard:t.guard||null}:{ok:false};
  },
  transitionAny:(current,actionId)=>transitionByAction(actionId,current),
  action:id=>registries.actions.actions.find(a=>a.id===id),
  actions:()=>registries.actions.actions||[],
  entity:id=>registries.entities.entities.find(e=>e.id===id),
  entities:()=>registries.entities.entities||[],
  view:id=>registries.views.views.find(v=>v.id===id),
  views:()=>registries.views.views||[],
  journey:id=>registries.journeys.journeys.find(j=>j.id===id),
  journeys:()=>registries.journeys.journeys||[]
};
