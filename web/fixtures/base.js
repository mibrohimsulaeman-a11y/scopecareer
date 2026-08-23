import {Contracts} from '../js/core/contracts.js';

const dims=(disposition='discovered',search='unknown',selection='not_started',priority='inactive')=>({
  candidate_disposition:disposition,
  opportunity_search_state:search,
  candidate_selection_state:selection,
  priority_allocation:priority
});

const assertions={
  ast_apac_remit:{id:'ast_apac_remit',label:'Scope',value:'APAC remit',status:'confirmed',source:'Company leadership announcement',observed:'18 Aug',impact:'High'},
  ast_reports_to:{id:'ast_reports_to',label:'Reporting line',value:'CEO',status:'confirmed',source:'Recruiter call',observed:'20 Aug',impact:'High'},
  ast_team_size:{id:'ast_team_size',label:'Team size',value:'~180',status:'estimate',source:'Leadership announcement',observed:'18 Aug',confidence:'Moderate',impact:'Medium'},
  ast_strategy_authority:{id:'ast_strategy_authority',label:'Strategy ownership',value:'Not confirmed',status:'open',source:'No direct evidence',observed:'—',impact:'High'},
  ast_pnl:{id:'ast_pnl',label:'P&L ownership',value:'Not known',status:'open',source:'No direct evidence',observed:'—',impact:'Medium'},
  ast_comp:{id:'ast_comp',label:'Compensation',value:'Not disclosed',status:'open',source:'No credible range',observed:'—',impact:'Medium'}
};

const opportunities=[
  {
    id:'opp_apac_vpt_01',role:'VP Technology',company:'Asteria Group',location:'Singapore',
    shortlisted:true,updated:'2h',fresh:'New evidence',trajectory:'Likely step-up',
    routeShort:'Sarah Tan · former colleague',cta:'Investigate authority & pay',
    decision:'Likely step-up. The decision turns on strategy authority.',
    mandate:'Build and scale an international platform engineering organisation while moving the regional technology function toward strategic ownership.',
    confirmed:['ast_apac_remit','ast_reports_to'],estimates:['ast_team_size'],
    open:['ast_strategy_authority','ast_pnl','ast_comp'],
    sources:[['Recruiter call','20 Aug','Reporting line'],['Company leadership announcement','18 Aug','APAC remit · team estimate'],['Role page','21 Aug','Role description']],
    routes:[
      {name:'Sarah Tan',personId:'person_sarah_tan',viability:'Best known route',fact:'Worked together in 2021; Sarah is in the regional unit.',interpretation:'Credible warm route, but current relationship strength is not assumed.'},
      {name:'Search consultant',personId:'person_jane_liu',viability:'Alternative',fact:'Handled adjacent APAC mandates.',interpretation:'No evidence this consultant holds the Asteria search.'},
      {name:'Direct application',viability:'Available',fact:'Official application route exists.',interpretation:'Available, but it bypasses the warm route already visible.'}
    ],
    research:{supports:['Transformation work maps to two approved leadership episodes.','The remit expands from national to APAC responsibility.','The company is investing in a regional engineering hub.'],unknowns:['Does the role own technology strategy?','What is the compensation structure?','What P&L authority comes with the mandate?']},
    stageOverlays:{
      recruiter:{ast_comp:{value:'Range discussed; not yet confirmed',status:'estimate',source:'Recruiter call',observed:'22 Aug',confidence:'Low'},ast_pnl:{value:'Material ownership indicated',status:'estimate',source:'Recruiter call',observed:'22 Aug',confidence:'Moderate'}},
      selection:{ast_strategy_authority:{value:'Owns regional technology strategy',status:'confirmed',source:'CEO interview brief',observed:'26 Aug'}},
      final:{},
      offer:{ast_strategy_authority:{value:'Owns regional technology strategy',status:'confirmed',source:'Written offer brief',observed:'04 Sep'},ast_pnl:{value:'Technology budget authority confirmed; no business-unit P&L',status:'confirmed',source:'Written offer brief',observed:'04 Sep'},ast_comp:{value:'SGD 310k base · 30% target bonus · equity grant',status:'confirmed',source:'Written offer',observed:'04 Sep'}}
    },
    dims:dims('exploring')
  },
  {
    id:'opp_dubai_platform_02',role:'Head of Platform Engineering',company:'Meridian Commerce',location:'Dubai',
    shortlisted:true,updated:'Today',fresh:'Reopened',trajectory:'Lateral?',
    routeShort:'No warm route',cta:'Investigate scope & reporting',
    decision:'Strong platform relevance. Career value depends on organisation size and authority.',
    inlineFacts:[['Mandate','Platform scale and reliability','Confirmed','Official role page · Today'],['Geography','Dubai','Confirmed','Official role page · Today']],
    inlineOpen:[['Organisation size','May be smaller than current role','High'],['Reporting line','Not known','High'],['Budget authority','Not known','Medium']],
    sources:[['Official careers page','Today','Role reopened']],routes:[],
    research:{supports:['Platform scale maps closely to approved experience.','Geography matches stated international intent.'],unknowns:['Reporting line','Budget authority','Why the role reopened']},
    dims:dims('watching','recruiting')
  },
  {
    id:'opp_india_transform_03',role:'Digital Transformation Director',company:'Northstar Industries',location:'Mumbai',stale:true,
    shortlisted:true,updated:'Tomorrow',fresh:'Recruiter call',trajectory:'Possible down-level',
    routeShort:'Recruiter-led',cta:'Prepare for call',
    decision:'Direct transformation fit. Authority may sit below the intended trajectory.',
    inlineFacts:[['Mandate','Post-acquisition integration','Confirmed','Recruiter conversation · Yesterday'],['Access','Recruiter already engaged','Confirmed','Recruiter conversation · Yesterday']],
    inlineOpen:[['Executive authority','Not confirmed','High'],['Reporting line','Not known','High'],['Team size','Not known','Medium']],
    sources:[['Recruiter conversation','Yesterday','Initial mandate']],routes:[],
    research:{supports:['Post-merger transformation evidence is directly relevant.','A recruiter route already exists.'],unknowns:['Executive committee exposure','Team size','Mandate duration']},
    dims:dims('discovered','hypothesis','contacted')
  }
];

const people={
  person_sarah_tan:{id:'person_sarah_tan',name:'Sarah Tan',sub:"Former colleague · worked together 2021",fact:"Worked together previously and Sarah is in Asteria's regional unit.",assessment:'Credible warm route; current relationship strength is not assumed.'},
  person_jane_liu:{id:'person_jane_liu',name:'Jane Liu',sub:'Search consultant',fact:'Current search contact for the Asteria mandate.',assessment:'Asked for an updated CV; checking P&L ownership and compensation range.',stageVisible:['recruiter','selection','final','offer']}
};

const careerClaims=[
  {id:'claim_apac_scale',title:'APAC engineering scale-up',detail:'Built an engineering organisation across 3 countries; grew platform team from 18 to 67.',evidenceStatus:'Source-backed'},
  {id:'claim_merger',title:'Post-merger platform consolidation',detail:'Consolidated platform teams and operating processes after an acquisition.',evidenceStatus:'Self-attested'},
  {id:'claim_cost',title:'Infrastructure economics',detail:'Reduced infrastructure operating cost by 28% during platform modernization.',evidenceStatus:'Corroborated'}
];

const briefingEvents=[
  {id:'evt_reporting',group:'Now',kind:'Evidence changed',time:'2h',subject:'VP Technology',sub:'Asteria Group · Singapore',change:()=>'Reporting line confirmed: CEO.',context:'One high-impact question resolved',detail:'Strategy ownership remains open',target:'opp_apac_vpt_01',cta:'Open brief'},
  {id:'evt_reopened',group:'Now',kind:'Role reopened',time:'Today',subject:'Head of Platform Engineering',sub:'Meridian Commerce · Dubai',change:'Role is live again after two months.',context:'Scope still unclear',detail:'Reporting line not known',target:'opp_dubai_platform_02',cta:'Review scope'},
  {id:'evt_followup',group:'Due today',kind:'Follow-up',time:'8d',subject:'Sarah Tan',sub:'Former colleague · Asteria route',change:'Last contact was eight days ago.',context:'Relevant to VP Technology',detail:'No outreach sent',target:'opp_apac_vpt_01',cta:'Open route'},
  {id:'evt_call',group:'Tomorrow',kind:'Prepare',time:'10:30',subject:'Digital Transformation Director',sub:'Northstar Industries · Mumbai',change:'Recruiter call tomorrow. Three authority questions remain open.',context:'Recruiter-led',detail:'Possible down-level',target:'opp_india_transform_03',cta:'Prepare for call'}
];

function seed(){
  const oppMap=Object.fromEntries(opportunities.map(o=>[o.id,structuredClone(o)]));
  const baseline={...assertions};
  return {
    opportunities:oppMap,
    assertions:baseline,
    assertionBaseline:JSON.parse(JSON.stringify(baseline)),
    people, careerClaims:JSON.parse(JSON.stringify(careerClaims)), briefingEvents:JSON.parse(JSON.stringify(briefingEvents)),
    ui:{selectedOpportunityId:opportunities[0].id,workspaceStage:'precontact',compareSelection:[],selectedEvidence:[]},
    policy:{priority:{max_active:3}}
  };
}

export async function fixtureLint(){
  await Contracts.ready();
  const problems=[];
  const machines=Contracts.machines();
  for(const o of Object.values(Store_opportunities())){
    for(const [dim,val] of Object.entries(o.dims||{})){
      const m=machines.find(m=>m.dimension===dim);
      if(!m)problems.push(`unknown dimension ${dim}`);
      else if(!m.states.includes(val))problems.push(`${o.id}.${dim} invalid state ${val}`);
    }
  }
  return problems;
}
function Store_opportunities(){return (window.__scopeCareerState?.snapshot?.().opportunities)||{}}

export const BaseFixture={seed,assertions,opportunities,people, careerClaims:JSON.parse(JSON.stringify(careerClaims)), briefingEvents:JSON.parse(JSON.stringify(briefingEvents)),dims,fixtureLint};
