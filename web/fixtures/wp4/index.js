export const strategySignals=[
  {id:'sig_hoe_vs_cto',title:'Head of Engineering roles progress more often than CTO searches',sample:{applied:8,interviews:5},window:'Last 90 days',confidence:'LOW–MODERATE',note:'CTO sample too small for a strong strategic conclusion.',framing:'Preliminary signal'},
  {id:'sig_recruiter_route',title:'Recruiter-led conversations convert better than cold applications',sample:{applications:12,responses:7},window:'Last 6 months',confidence:'MODERATE',note:'Consistent across two geographies.',framing:'Signal'}
];
export const experiments=[
  {id:'exp_1',hypothesis:'Transformation-mandate VP roles respond better than generic CTO applications.',scope:'VP Technology · Singapore & UAE',dims:{strategy_experiment_state:'draft'}}
];
export const companies=[
  {id:'co_asteria',name:'Asteria Group',industry:'Financial infrastructure',signal:'Regional engineering hub announced',watch:true},
  {id:'co_meridian',name:'Meridian Commerce',industry:'E-commerce platform',signal:'Role reopened after two months',watch:true},
  {id:'co_northstar',name:'Northstar Industries',industry:'Industrial',signal:'Post-acquisition integration underway',watch:false}
];
export const sensitivityFields=[
  {id:'s_comp',label:'Current compensation',level:'highly_confidential',hidden:false},
  {id:'s_intent',label:'Intention to leave current employer',level:'highly_confidential',hidden:false},
  {id:'s_searches',label:'Active confidential searches',level:'sensitive',hidden:false},
  {id:'s_relationships',label:'Recruiter relationships',level:'sensitive',hidden:false}
];
export const stealthSamples=[
  {bad:'94% MATCH — CFO ROLE AT YOUR COMPETITOR',good:'New opportunity update'},
  {bad:'Korn Ferry wants your CV',good:'Follow-up due today'}
];
