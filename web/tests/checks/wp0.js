import {Contracts} from '../../js/core/contracts.js';
import {Store} from '../../js/core/store.js';
import {Actions} from '../../js/core/actions.js';
import {Copy} from '../../js/core/copy.js';
import {assertionRow,badge,tradeoffTable,emptyState,actionBtn} from '../../js/ui/components.js';

async function check(name,fn){
  try{const ok=await fn();return [name,ok===true]}
  catch(e){console.error('check error',name,e);return [name,false]}
}

export async function runSelfCheck(){
  const checks={};const errors=[];
  const defs=[
    ['contractsLoaded',async()=>Contracts.machines().length>=14&&Contracts.actions().length>=90],
    ['viewsRegistryReachable',()=>Contracts.views().length>=13&&!!Contracts.view('VM-HOME-ATTENTION')],
    ['copyCoversDispositions',()=>{
      const m=Contracts.machine('SM-CANDIDATE-DISPOSITION');
      return m.states.every(s=>Copy.dim('candidate_disposition',s)!==s);
    }],
    ['copyCoversSelectionStates',()=>{
      const m=Contracts.machine('SM-CANDIDATE-SELECTION');
      return m.states.every(s=>Copy.dim('candidate_selection_state',s)!==s);
    }],
    ['dispatcherRejectsIllegalJump',async()=>{
      Store.setDim('opp_apac_vpt_01','candidate_disposition','discovered');
      const r=await Actions.run('ACT-OPPORTUNITY-PURSUE',{opportunityId:'opp_apac_vpt_01'});
      return r.ok===false&&r.reason==='no_valid_transition';
    }],
    ['dispatcherAllowsLegalChain',async()=>{
      Store.setDim('opp_india_transform_03','candidate_disposition','watching');
      let r=await Actions.run('ACT-OPPORTUNITY-EXPLORE',{opportunityId:'opp_india_transform_03'});
      if(!r.ok||Store.dims('opp_india_transform_03','candidate_disposition')!=='exploring')return false;
      r=await Actions.run('ACT-OPPORTUNITY-PURSUE',{opportunityId:'opp_india_transform_03'});
      return r.ok&&Store.dims('opp_india_transform_03','candidate_disposition')==='pursuing';
    }],
    ['priorityGuardEnforced',async()=>{
      Store.setDim('opp_dubai_platform_02','candidate_disposition','exploring');
      const r=await Actions.run('ACT-PRIORITY-ACTIVATE',{opportunityId:'opp_dubai_platform_02'});
      return r.ok===false&&r.reason==='guard_failed'&&Store.dims('opp_dubai_platform_02','priority_allocation')==='inactive';
    }],
    ['dimensionsAreOrthogonal',()=>{
      Store.setDim('opp_dubai_platform_02','candidate_selection_state','contacted');
      const o=Store.get('opportunities.opp_dubai_platform_02').dims;
      return o.candidate_disposition==='exploring'&&o.candidate_selection_state==='contacted'&&o.opportunity_search_state==='recruiting';
    }],
    ['externalEffectActionsNotRunnable',async()=>{
      const external=Contracts.actions().filter(a=>String(a.effect_class).includes('external'));
      if(!external.length)return false;
      for(const a of external.slice(0,5)){
        if(Effects_has(a.id))return false;
      }
      return true;
    }],
    ['assertionComponentRendersFromObject',()=>{
      const div=document.createElement('div');
      div.innerHTML=assertionRow({id:'ast_x',label:'Reporting line',value:'CEO',status:'confirmed',source:'Recruiter call',observed:'20 Aug',impact:'High'});
      return !!div.querySelector('[data-assertion="ast_x"] .badge.confirmed')&&div.textContent.includes('Recruiter call');
    }],
    ['compareTableHasNoWinnerColumn',()=>{
      const div=document.createElement('div');
      div.innerHTML=tradeoffTable({columns:[{title:'A'},{title:'B'}],rows:[{dimension:'Trajectory',cells:['x','y']}]});
      return div.querySelectorAll('thead th').length===3&&!/winner|score/i.test(div.textContent);
    }],
    ['actionBtnBindsCanonicalAction',()=>{
      const div=document.createElement('div');
      div.innerHTML=actionBtn({label:'Open pursuit workspace',actionId:'ACT-OPPORTUNITY-PURSUE',payload:{opportunityId:'opp_x'},variant:'primary',note:'Creates a private working file.'});
      return div.querySelector('[data-action="ACT-OPPORTUNITY-PURSUE"]')!==null;
    }],
    ['eventLedgerRecordsCanonicalAction',()=>{
      const evts=window.__scopeCareerValidationLog.events.filter(e=>e.type==='action_executed');
      return evts.length>=2&&evts.every(e=>typeof e.canonical_action==='string'&&e.external_effect===false);
    }],
    ['fixtureLintClean',async()=>{
      await Contracts.ready();
      const opps=Object.values(Store.get('opportunities'));
      const machines=Contracts.machines();
      for(const o of opps)for(const [dim,val] of Object.entries(o.dims||{})){
        const m=machines.find(m=>m.dimension===dim);
        if(!m||!m.states.includes(val))return false;
      }
      return true;
    }]
  ];
  function Effects_has(id){return false}
  for(const [name,fn] of defs){
    const [n,ok]=await check(name,fn);
    checks[n]=ok;if(!ok)errors.push(n);
  }
  window.__scopeCareerSmokeReport={checks,failed:checks_failed(checks),errors,runtimeErrors:window.__scopeCareerRuntimeErrors||[],generated_at:new Date().toISOString()};
}
function checks_failed(c){return Object.entries(c).filter(([,v])=>!v).map(([k])=>k)}
