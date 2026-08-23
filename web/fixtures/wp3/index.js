export const positioningBrief={
  status:'draft',
  headline:'Technology executive who scales platform organisations internationally and lands transformation mandates.',
  bullets:[
    'Three-country engineering scale-up (18 → 67) with source-backed evidence',
    'Post-merger platform consolidation across 12 business units',
    'Operating-cost transformation: 28% infrastructure reduction'
  ],
  usage:'Approved for recruiter sharing after candidate commit'
};
export const resumeVariants=[{
  id:'rv_apac_v1',oppId:'opp_apac_vpt_01',label:'VP Technology — APAC variant',
  dims:{resume_variant_state:'draft'},
  changes:[
    {id:'ch_1',section:'Summary',original:'Senior technology leader.',proposed:'Technology executive who scaled platform organisations across three countries.',reason:'Leads with mandate-relevant scale; wording only, no new facts.',claimId:'claim_apac_scale',usage:'Approved for resume',accepted:null},
    {id:'ch_2',section:'Experience — Asteria-relevant episode',original:'Led platform teams.',proposed:'Consolidated platform teams post-acquisition while cutting infrastructure cost 28%.',reason:'Surfaces corroborated cost outcome the JD explicitly asks for.',claimId:'claim_cost',usage:'Approved for resume',accepted:null},
    {id:'ch_3',section:'Leadership',original:'Managed engineers.',proposed:'Led post-merger consolidation of engineering platforms.',reason:'Terminology aligned to JD ("post-merger integration") where meaning matches approved claim.',claimId:'claim_merger',usage:'Private only — needs attestation first',accepted:null}
  ]
}];
export const participants=[
  {id:'part_ceo',name:'CEO',when:'26 Aug · 10:00',agenda:['International expansion pace','Technology operating leverage','Leadership maturity at regional scale'],concerns:['Direct fintech experience is adjacent, not exact'],evidence:['Three-country platform expansion (source-backed)','Regulated-industry transformation story'],questions:['Does strategy ownership include budget authority?']},
  {id:'part_chro',name:'CHRO screen',when:'Completed 24 Aug',agenda:['Leadership style under restructuring'],concerns:[],evidence:['Post-merger consolidation story'],questions:[]}
];
export const debrief={
  id:'deb_recruiter_01',stageVisible:true,observed:'Recruiter asked for an updated CV and confirmed reporting line.',
  proposals:[
    {id:'ast_debrief_pnl',label:'P&L ownership',value:'Material ownership indicated',status:'estimate',source:'Recruiter call debrief · 22 Aug',dims:{epistemic_status:'needs_research'}},
    {id:'ast_debrief_comp',label:'Compensation',value:'Range discussed; not yet confirmed',status:'estimate',source:'Recruiter call debrief · 22 Aug',confidence:'Low',dims:{epistemic_status:'needs_research'}}
  ],
  suggestedCommitment:'Send CV after scope questions are answered'
};
export const offer={
  id:'offer_apac_01',oppId:'opp_apac_vpt_01',
  terms:[['Base','SGD 310k'],['Bonus','30% target'],['Equity','4-year grant · details under review'],['Authority','Strategy ownership confirmed in offer brief']],
  criteria:[['Mandate quality',30],['Authority & scope',25],['Compensation',20],['Trajectory & optionality',15],['Risk',10]],
  dims:{offer_decision_state:'received'}
};
export const interactions=[
  ['18 Aug','Company leadership announcement captured'],
  ['20 Aug','Recruiter call: reporting line = CEO'],
  ['21 Aug','Role page snapshot captured'],
  ['22 Aug','Recruiter debrief: CV requested, P&L signal noted']
];
export const commitments=[
  {id:'cmt_cv',text:'Send updated CV to Jane Liu',due:'After scope questions answered',done:false}
];
export const openQuestions=[
  {id:'oq_strategy',text:'Strategy ownership confirmed?',resolved:true},
  {id:'oq_comp',text:'Compensation range credible?',resolved:false}
];
