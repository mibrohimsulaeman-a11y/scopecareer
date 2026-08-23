#!/usr/bin/env python3
"""Freeze exact Candidate MCP V1 tool I/O schemas and bind tools to canonical actions."""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

def load(rel):
    with (ROOT/rel).open('r',encoding='utf-8') as f:return json.load(f)

def save(rel,doc):
    (ROOT/rel).write_text(json.dumps(doc,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')

def obj(props, required=None, additional=False, **extra):
    d={"type":"object","properties":props,"additionalProperties":additional}
    if required:d["required"]=required
    d.update(extra);return d

def arr(items, **extra):
    d={"type":"array","items":items};d.update(extra);return d

REF={"type":"string","minLength":1}
STR={"type":"string"}
NONEMPTY={"type":"string","minLength":1}
BOOL={"type":"boolean"}
CONF={"type":"string","enum":["low","moderate","high"]}
EPI={"type":"string","enum":["unknown","needs_research","inferred","known"]}
TRUST={"type":"string","enum":["high","moderate","unresolved","elevated_risk"]}
DISP={"type":"string","enum":["passed","watching","exploring","pursuing","closed"]}
SEL={"type":"string","enum":["contacted","applied","recruiter_screen","interview","final","reference","offer","closed"]}

ASSERTION_PROPOSAL=obj({
  "subject_ref":REF,"predicate":NONEMPTY,"value":{},"epistemic_status":EPI,
  "observation_refs":arr(REF),"source_refs":arr(REF),"confidence":CONF,
  "sensitivity":{"type":"string","enum":["public","career_internal","sensitive","highly_confidential"]}
},["subject_ref","predicate","epistemic_status","observation_refs","source_refs"])
UNKNOWN=obj({"label":NONEMPTY,"reason":NONEMPTY,"research_question":STR},["label","reason"])
STATE_RECEIPT=obj({
  "entity_ref":REF,"state_machine":REF,"from_state":STR,"to_state":NONEMPTY,
  "action_id":REF,"recorded_at":{"type":"string","format":"date-time"}
},["entity_ref","state_machine","to_state","action_id","recorded_at"])
ROUTE=obj({
  "route_type":NONEMPTY,"viability":NONEMPTY,"relationship_assessment_refs":arr(REF),
  "evidence_refs":arr(REF),"unknowns":arr(UNKNOWN),"confidence":CONF
},["route_type","viability","relationship_assessment_refs","evidence_refs","unknowns","confidence"])

SCHEMAS={}
def add(name, input_schema, output_schema):
    SCHEMAS[name]={"input_schema":input_schema,"output_schema":output_schema}

add("career.get_context",
    obj({"purpose":NONEMPTY,"opportunity_id":REF,"requested_dimensions":arr(NONEMPTY,uniqueItems=True)},["purpose"]),
    obj({"purpose":NONEMPTY,"candidate_ref":REF,"career_intent_version":STR,"career_claim_refs":arr(REF),"career_object_refs":arr(REF),"assertions":arr(ASSERTION_PROPOSAL),"restrictions":arr(NONEMPTY),"unknowns":arr(UNKNOWN),"context_revision":NONEMPTY},["purpose","candidate_ref","career_claim_refs","career_object_refs","assertions","restrictions","unknowns","context_revision"]))
add("career.review_strategy",
    obj({"time_window":STR,"hypothesis":STR}),
    obj({"signals":arr(obj({"signal_ref":REF,"statement":NONEMPTY,"sample_size":{"type":"integer","minimum":0},"time_window":NONEMPTY,"context":NONEMPTY,"confidence":CONF,"supporting_refs":arr(REF)},["statement","sample_size","time_window","context","confidence","supporting_refs"])),"limitations":arr(NONEMPTY),"generated_at":{"type":"string","format":"date-time"}},["signals","limitations","generated_at"]))
add("career.bind_evidence",
    obj({"opportunity_id":REF,"role_mandate_ref":REF,"mandate_fragment":NONEMPTY,"career_claim_refs":arr(REF,minItems=1,uniqueItems=True),"career_object_refs":arr(REF,uniqueItems=True)},["opportunity_id","role_mandate_ref","mandate_fragment","career_claim_refs"]),
    obj({"binding_id":REF,"opportunity_id":REF,"role_mandate_ref":REF,"career_claim_refs":arr(REF,minItems=1),"career_object_refs":arr(REF),"evidence_status_unchanged":{"const":True},"created_at":{"type":"string","format":"date-time"}},["binding_id","opportunity_id","role_mandate_ref","career_claim_refs","evidence_status_unchanged","created_at"]))
add("market.discover_targets",
    obj({"intent_scope":STR,"limit":{"type":"integer","minimum":1,"maximum":50}}),
    obj({"targets":arr(obj({"company_ref":REF,"rationale":arr(NONEMPTY,minItems=1),"signal_refs":arr(REF),"assertion_refs":arr(REF),"confidence":CONF},["company_ref","rationale","signal_refs","assertion_refs","confidence"])),"unknowns":arr(UNKNOWN)},["targets","unknowns"]))
add("market.research",
    obj({"subject_ref":REF,"research_questions":arr(NONEMPTY,uniqueItems=True)},["subject_ref"]),
    obj({"subject_ref":REF,"observation_refs":arr(REF),"assertion_proposals":arr(ASSERTION_PROPOSAL),"market_signal_proposals":arr(obj({"signal_type":NONEMPTY,"observation_refs":arr(REF),"assertion_refs":arr(REF)},["signal_type","observation_refs","assertion_refs"])),"unknowns":arr(UNKNOWN)},["subject_ref","observation_refs","assertion_proposals","market_signal_proposals","unknowns"]))
add("market.create_watch",
    obj({"watch_type":NONEMPTY,"criteria":{"type":"object"},"frequency_policy":NONEMPTY},["watch_type","criteria","frequency_policy"]),
    obj({"watch_id":REF,"state":{"const":"active"},"watch_type":NONEMPTY,"criteria":{"type":"object"},"frequency_policy":NONEMPTY,"created_at":{"type":"string","format":"date-time"}},["watch_id","state","watch_type","criteria","frequency_policy","created_at"]))
add("opportunity.discover",
    obj({"intent_scope":STR,"limit":{"type":"integer","minimum":1,"maximum":50},"include_confidential_manual":BOOL}),
    obj({"opportunities":arr(obj({"opportunity_id":REF,"role_label":NONEMPTY,"company_ref":REF,"disposition":{"type":"string","enum":["discovered","passed","watching","exploring","pursuing","closed"]},"priority":{"type":"string","enum":["inactive","active"]},"search_state":{"type":"string","enum":["hypothesis","open","recruiting","paused","filled","cancelled","unknown"]},"selection_state":{"type":"string","enum":["not_started","contacted","applied","recruiter_screen","interview","final","reference","offer","closed"]},"why_surfaced":arr(NONEMPTY),"top_upside":STR,"top_concern":STR,"trust_band":TRUST,"access_summary":STR},["opportunity_id","role_label","disposition","priority","search_state","selection_state","why_surfaced"])),"generated_at":{"type":"string","format":"date-time"}},["opportunities","generated_at"]))
add("opportunity.capture",
    {"type":"object","properties":{"source_url":{"type":"string","format":"uri"},"pasted_text":{"type":"string","minLength":1},"source_ref":REF,"confidential":BOOL},"anyOf":[{"required":["source_url"]},{"required":["pasted_text"]},{"required":["source_ref"]}],"additionalProperties":False},
    obj({"source_ref":REF,"observation_refs":arr(REF),"opportunity_id":REF,"candidate_disposition":{"const":"discovered"},"assertion_proposals":arr(ASSERTION_PROPOSAL),"confidential":BOOL},["source_ref","observation_refs","opportunity_id","candidate_disposition","assertion_proposals","confidential"]))
add("opportunity.research",
    obj({"opportunity_id":REF,"questions":arr(NONEMPTY,uniqueItems=True)},["opportunity_id"]),
    obj({"opportunity_id":REF,"observation_refs":arr(REF),"assertion_proposals":arr(ASSERTION_PROPOSAL),"open_questions":arr(UNKNOWN),"research_snapshot_ref":REF},["opportunity_id","observation_refs","assertion_proposals","open_questions","research_snapshot_ref"]))
add("opportunity.check_trust",
    obj({"opportunity_id":REF},["opportunity_id"]),
    obj({"opportunity_id":REF,"assessment_id":REF,"input_snapshot_ref":REF,"trust_band":TRUST,"evidence_refs":arr(REF),"risk_signals":arr(NONEMPTY),"unresolved_risks":arr(UNKNOWN),"confidence":CONF,"created_at":{"type":"string","format":"date-time"}},["opportunity_id","assessment_id","input_snapshot_ref","trust_band","evidence_refs","risk_signals","unresolved_risks","confidence","created_at"]))
add("opportunity.assess_pursuit",
    obj({"opportunity_id":REF,"force_refresh":BOOL},["opportunity_id"]),
    obj({"opportunity_id":REF,"input_snapshot_ref":REF,"fit_assessment_ref":REF,"quality_assessment_ref":REF,"transition_assessment_ref":REF,"access_plan_ref":REF,"pursuit_assessment_ref":REF,"recommendation_ref":REF,"recommendation":NONEMPTY,"reasons":arr(NONEMPTY),"concerns":arr(NONEMPTY),"unknowns":arr(UNKNOWN),"confidence":CONF,"created_at":{"type":"string","format":"date-time"}},["opportunity_id","input_snapshot_ref","fit_assessment_ref","quality_assessment_ref","transition_assessment_ref","pursuit_assessment_ref","recommendation_ref","recommendation","reasons","concerns","unknowns","confidence","created_at"]))
add("access.plan",
    obj({"opportunity_id":REF,"allowed_relationship_scope":arr(REF,uniqueItems=True)},["opportunity_id"]),
    obj({"opportunity_id":REF,"access_plan_id":REF,"input_snapshot_ref":REF,"route_assessments":arr(ROUTE),"recommended_route":NONEMPTY,"confidence":CONF,"unknowns":arr(UNKNOWN),"no_external_outreach":{"const":True},"created_at":{"type":"string","format":"date-time"}},["opportunity_id","access_plan_id","input_snapshot_ref","route_assessments","recommended_route","confidence","unknowns","no_external_outreach","created_at"]))
add("positioning.prepare",
    obj({"opportunity_id":REF,"purpose":NONEMPTY},["opportunity_id","purpose"]),
    obj({"opportunity_id":REF,"proposal":{"type":"object","properties":{"narrative":NONEMPTY,"strengths":arr(NONEMPTY),"anticipated_concerns":arr(NONEMPTY),"unknowns":arr(UNKNOWN),"evidence_refs":arr(REF),"career_claim_refs":arr(REF),"usage_permission_checks":arr(obj({"claim_ref":REF,"purpose":NONEMPTY,"allowed":BOOL},["claim_ref","purpose","allowed"]))},"required":["narrative","strengths","anticipated_concerns","unknowns","evidence_refs","career_claim_refs","usage_permission_checks"],"additionalProperties":False},"proposal_only":{"const":True}},["opportunity_id","proposal","proposal_only"]))
add("resume.prepare_variant",
    obj({"opportunity_id":REF,"base_resume_ref":REF},["opportunity_id"]),
    obj({"opportunity_id":REF,"resume_variant_id":REF,"state":{"const":"draft"},"change_proposals":arr(obj({"change_id":REF,"original_text":STR,"proposed_text":NONEMPTY,"reason":NONEMPTY,"career_claim_refs":arr(REF,minItems=1),"evidence_refs":arr(REF),"interpretation_status":{"type":"string","enum":["fact","inference","suggested_wording"]}},["change_id","proposed_text","reason","career_claim_refs","evidence_refs","interpretation_status"])),"evidence_refs":arr(REF),"no_external_share":{"const":True}},["opportunity_id","resume_variant_id","state","change_proposals","evidence_refs","no_external_share"]))
add("selection.prepare",
    obj({"opportunity_id":REF,"stage_ref":REF,"participant_ref":REF},["opportunity_id"]),
    obj({"opportunity_id":REF,"preparation_brief_id":REF,"stage_ref":REF,"participant_ref":REF,"agenda_hypotheses":arr(obj({"statement":NONEMPTY,"confidence":CONF,"evidence_refs":arr(REF)},["statement","confidence","evidence_refs"])),"evidence_refs":arr(REF),"open_questions":arr(UNKNOWN),"confidence":CONF},["opportunity_id","preparation_brief_id","agenda_hypotheses","evidence_refs","open_questions","confidence"]))
add("interaction.debrief",
    obj({"opportunity_id":REF,"interaction_type":NONEMPTY,"content":{"type":"string","minLength":1},"occurred_at":{"type":"string","format":"date-time"}},["interaction_type","content"]),
    obj({"debrief_id":REF,"observation_refs":arr(REF),"assertion_proposals":arr(ASSERTION_PROPOSAL),"commitment_proposals":arr(obj({"description":NONEMPTY,"owner_ref":REF,"due_at":{"type":"string","format":"date-time"}},["description"])),"open_question_proposals":arr(UNKNOWN),"candidate_review_required":{"const":True}},["debrief_id","observation_refs","assertion_proposals","commitment_proposals","open_question_proposals","candidate_review_required"]))
add("opportunity.set_disposition",
    obj({"opportunity_id":REF,"disposition":DISP,"reason":STR},["opportunity_id","disposition"]),
    obj({"receipt":STATE_RECEIPT},["receipt"]))
add("opportunity.set_priority",
    obj({"opportunity_id":REF,"active":BOOL},["opportunity_id","active"]),
    obj({"receipt":STATE_RECEIPT,"active_priority_count":{"type":"integer","minimum":0},"policy_max_active":{"type":["integer","null"],"minimum":1}},["receipt","active_priority_count","policy_max_active"]))
add("selection.update_state",
    {"type":"object","properties":{"opportunity_id":REF,"selection_state":SEL,"basis_ref":REF},"required":["opportunity_id","selection_state"],"allOf":[{"if":{"properties":{"selection_state":{"const":"applied"}}},"then":{"required":["basis_ref"]}}],"additionalProperties":False},
    obj({"receipt":STATE_RECEIPT,"external_effect_performed":{"const":False}},["receipt","external_effect_performed"]))


def main():
    doc=load('mcp/candidate_tools.json')
    tools=doc['tools']
    by={t['name']:t for t in tools}
    if 'career.bind_evidence' not in by:
        tools.insert(2,{"name":"career.bind_evidence","effect_class":"internal_mutation","canonical_actions":["ACT-MANDATE-EVIDENCE-BIND"],"output_contract":{"entities":["ENT-MANDATE-EVIDENCE-BINDING"],"evidence_status_unchanged":True}})
        by={t['name']:t for t in tools}
    updates={
      'opportunity.check_trust':('internal_mutation',["ACT-OPPORTUNITY-TRUST-ASSESS"]),
      'opportunity.assess_pursuit':('internal_mutation',["ACT-FIT-ASSESS","ACT-QUALITY-ASSESS","ACT-TRANSITION-ASSESS","ACT-PURSUIT-ASSESS"]),
      'access.plan':('internal_mutation',["ACT-RELATIONSHIP-ASSESS","ACT-ACCESS-ROUTE-ASSESS","ACT-ACCESS-PLAN-CREATE"]),
      'positioning.prepare':('internal_proposal',["ACT-POSITIONING-PREPARE"]),
      'resume.prepare_variant':('internal_mutation',["ACT-RESUME-VARIANT-PREPARE"]),
      'selection.prepare':('internal_mutation',["ACT-SELECTION-PREPARE"]),
      'interaction.debrief':('internal_mutation',["ACT-DEBRIEF-CAPTURE","ACT-ASSERTION-PROPOSE"])
    }
    for name,(effect,acts) in updates.items():
        by[name]['effect_class']=effect;by[name]['canonical_actions']=acts
    for t in tools:
        t.pop('input_schema',None)
        t['input_schema_ref']=f"candidate_schema_registry.json#/tools/{t['name']}/input_schema"
        t['output_schema_ref']=f"candidate_schema_registry.json#/tools/{t['name']}/output_schema"
    doc['schema_registry']='candidate_schema_registry.json'
    save('mcp/candidate_tools.json',doc)
    schema_doc={"$schema":"https://json-schema.org/draft/2020-12/schema","registry_id":"REG-MCP-CANDIDATE-SCHEMA-V1","version":"1.0.0-draft","rules":["schemas define transport shape; canonical semantics remain entity/action/policy contracts","additional properties are denied unless explicitly allowed","external-effect absence is explicit where consequential"],"tools":SCHEMAS}
    save('mcp/candidate_schema_registry.json',schema_doc)
    print(f'Candidate MCP schemas frozen for {len(SCHEMAS)} tools')

if __name__=='__main__':main()
