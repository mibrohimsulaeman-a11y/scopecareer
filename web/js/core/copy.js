const GROUPS={
  candidate_disposition:{discovered:'New',passed:'Passed',watching:'Saved',exploring:'Under review',pursuing:'Active',closed:'Closed'},
  priority_allocation:{inactive:'Standard attention',active:'Priority'},
  opportunity_search_state:{hypothesis:'Unconfirmed role',open:'Search open',recruiting:'Recruiting',paused:'Paused',filled:'Filled',cancelled:'Cancelled',unknown:'Not known'},
  candidate_selection_state:{not_started:'Not started',contacted:'Contacted',applied:'Applied',recruiter_screen:'Recruiter screen',interview:'Interview',final:'Final round',reference:'References',offer:'Offer',closed:'Closed'},
  epistemic_status:{unknown:'Unknown',needs_research:'Needs research',inferred:'Inferred',known:'Known'},
  epistemic_display:{confirmed:'Confirmed',estimate:'Estimate',open:'Open',inferred:'Inferred',unknown:'Unknown'},
  claim_review_state:{proposed:'Proposed',under_review:'In review',attested:'Attested',rejected:'Rejected',superseded:'Superseded'},
  resume_variant_state:{draft:'Draft',reviewing:'In review',approved:'Approved',rejected:'Rejected',superseded:'Superseded'},
  selection_stage_state:{planned:'Planned',scheduled:'Scheduled',completed:'Completed',cancelled:'Cancelled'},
  offer_decision_state:{received:'Received',under_review:'In review',decision_ready:'Decision ready',intent_accept:'Intent to accept',intent_decline:'Intent to decline',closed:'Closed'},
  strategy_experiment_state:{draft:'Draft',active:'Active',paused:'Paused',completed:'Completed',cancelled:'Cancelled'},
  market_watch_state:{active:'Watching',paused:'Paused',archived:'Archived'},
  share_packet_state:{draft:'Draft',approved:'Approved',shared:'Shared',expired:'Expired',revoked:'Revoked'},
  external_effect_state:{draft:'Draft',awaiting_confirmation:'Awaiting confirmation',authorized:'Authorized',executing:'Executing',succeeded:'Done',failed:'Failed',outcome_unknown:'Outcome unknown',cancelled:'Cancelled'},
  delegation_state:{draft:'Draft',active:'Active',revoked:'Revoked',expired:'Expired'}
};
const TRUST={high:'Trust: high',medium:'Trust: medium',low:'Trust: low',unresolved:'Trust: unresolved'};
function t(group,value){return GROUPS[group]?.[value]??null}
function unmapped(){
  const missing=[];
  for(const [g,states] of Object.entries(GROUPS._required||{}))for(const s of states)if(!GROUPS[g]?.[s])missing.push(`${g}.${s}`);
  return missing;
}
export const Copy={
  t,
  trust:v=>TRUST[String(v).toLowerCase()]??`Trust: ${v}`,
  dim:(dimension,stateValue)=>t(dimension,stateValue)??String(stateValue),
  unmapped
};
