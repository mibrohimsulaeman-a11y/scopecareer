#!/usr/bin/env python3
"""Close assessment/action gaps before freezing Candidate MCP schemas."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def load(rel):
    with (ROOT/rel).open('r', encoding='utf-8') as f: return json.load(f)

def save(rel, doc):
    (ROOT/rel).write_text(json.dumps(doc, indent=2, ensure_ascii=False)+'\n', encoding='utf-8')

def upsert(items, item):
    for i,x in enumerate(items):
        if x['id']==item['id']:
            items[i]=item; return
    items.append(item)

def main():
    ed=load('entities/entity_registry.json'); ad=load('actions/action_registry.json'); cd=load('capabilities/capability_registry.json'); pd=load('policies/policy_registry.json'); aid=load('ai-functions/ai_function_registry.json'); confd=load('conformance/cases.json')
    E,A,C,P,F,Q=ed['entities'],ad['actions'],cd['capabilities'],pd['policies'],aid['functions'],confd['cases']

    upsert(E,{"id":"ENT-OPPORTUNITY-TRUST-ASSESSMENT","name":"OpportunityTrustAssessment","domain":"trust","extends":"ENT-ASSESSMENT","purpose":"Versioned assessment of source/recruiter/opportunity trust evidence and unresolved risk.","fields":["opportunity_id","trust_band","source_integrity","identity_consistency","freshness","risk_signals","unresolved_risks"],"invariants":["trust band is evidence-based assessment, not certainty of real/fake","new material source evidence creates a new version"]})

    for item in [
      {"id":"ACT-FIT-ASSESS","name":"AssessFit","capability":"CAP-PURSUIT","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-OPPORTUNITY","ENT-ROLE-MANDATE","ENT-CAREER-INTENT","ENT-CAREER-CLAIM","ENT-MANDATE-EVIDENCE-BINDING","ENT-EVIDENCE-SNAPSHOT"],"writes":["ENT-FIT-ASSESSMENT"],"guards":["immutable_input_snapshot"]},
      {"id":"ACT-QUALITY-ASSESS","name":"AssessOpportunityQuality","capability":"CAP-PURSUIT","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-OPPORTUNITY","ENT-ROLE-MANDATE","ENT-ASSERTION","ENT-EVIDENCE-SNAPSHOT"],"writes":["ENT-QUALITY-ASSESSMENT"],"guards":["immutable_input_snapshot"]},
      {"id":"ACT-TRANSITION-ASSESS","name":"AssessTransition","capability":"CAP-PURSUIT","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-OPPORTUNITY","ENT-CAREER-INTENT","ENT-CAREER-PROFILE","ENT-EVIDENCE-SNAPSHOT"],"writes":["ENT-TRANSITION-ASSESSMENT"],"guards":["immutable_input_snapshot"]},
      {"id":"ACT-RELATIONSHIP-ASSESS","name":"AssessRelationship","capability":"CAP-ACCESS-INTELLIGENCE","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-RELATIONSHIP","ENT-RELATIONSHIP-EVIDENCE","ENT-INTERACTION","ENT-EVIDENCE-SNAPSHOT"],"writes":["ENT-RELATIONSHIP-ASSESSMENT"],"guards":["immutable_input_snapshot"]},
      {"id":"ACT-ACCESS-ROUTE-ASSESS","name":"AssessAccessRoute","capability":"CAP-ACCESS-INTELLIGENCE","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-OPPORTUNITY","ENT-RELATIONSHIP-ASSESSMENT","ENT-ASSERTION","ENT-EVIDENCE-SNAPSHOT"],"writes":["ENT-ACCESS-ROUTE-ASSESSMENT"],"guards":["immutable_input_snapshot"]},
      {"id":"ACT-OPPORTUNITY-TRUST-ASSESS","name":"AssessOpportunityTrust","capability":"CAP-OPPORTUNITY-TRUST","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-OPPORTUNITY","ENT-SOURCE","ENT-OBSERVATION","ENT-ASSERTION","ENT-PERSON","ENT-SEARCH-FIRM","ENT-EVIDENCE-SNAPSHOT"],"writes":["ENT-OPPORTUNITY-TRUST-ASSESSMENT"],"guards":["immutable_input_snapshot"]}
    ]: upsert(A,item)

    pursuit=next(x for x in C if x['id']=='CAP-PURSUIT')
    pursuit['actions']=["ACT-FIT-ASSESS","ACT-QUALITY-ASSESS","ACT-TRANSITION-ASSESS","ACT-PURSUIT-ASSESS"]
    access=next(x for x in C if x['id']=='CAP-ACCESS-INTELLIGENCE')
    access['actions']=["ACT-RELATIONSHIP-ASSESS","ACT-ACCESS-ROUTE-ASSESS","ACT-ACCESS-PLAN-CREATE"]
    upsert(C,{"id":"CAP-OPPORTUNITY-TRUST","name":"Opportunity Trust Intelligence","domain":"trust","purpose":"Produce versioned evidence-based trust assessment for opportunity/source/recruiter context without false certainty.","owns":["ENT-OPPORTUNITY-TRUST-ASSESSMENT"],"reads":["ENT-OPPORTUNITY","ENT-SOURCE","ENT-OBSERVATION","ENT-ASSERTION","ENT-PERSON","ENT-SEARCH-FIRM","ENT-EVIDENCE-SNAPSHOT"],"actions":["ACT-OPPORTUNITY-TRUST-ASSESS"],"ai_role":"identify/correlate trust and risk evidence; preserve unresolved state","external_effects":[]})

    upsert(P,{"id":"POL-OPPORTUNITY-TRUST-NO-FALSE-CERTAINTY","effect":"guard","actions":["ACT-OPPORTUNITY-TRUST-ASSESS"],"condition":"input snapshot preserves source identity/freshness and unresolved evidence","invariants":["assessment cannot assert real/fake certainty beyond evidence","unresolved remains valid output"]})
    versioning=next(x for x in P if x['id']=='POL-ASSESSMENT-VERSIONING')
    for act in ["ACT-FIT-ASSESS","ACT-QUALITY-ASSESS","ACT-TRANSITION-ASSESS","ACT-RELATIONSHIP-ASSESS","ACT-ACCESS-ROUTE-ASSESS","ACT-OPPORTUNITY-TRUST-ASSESS"]:
        if act not in versioning['actions']: versioning['actions'].append(act)
    candidate=next(x for x in P if x['id']=='POL-CANDIDATE-OWN-DATA')
    for act in ["ACT-FIT-ASSESS","ACT-QUALITY-ASSESS","ACT-TRANSITION-ASSESS","ACT-RELATIONSHIP-ASSESS","ACT-ACCESS-ROUTE-ASSESS","ACT-OPPORTUNITY-TRUST-ASSESS"]:
        if act not in candidate['actions']: candidate['actions'].append(act)
    candidate['actions']=sorted(candidate['actions'])

    upsert(F,{"id":"AIF-OPPORTUNITY-TRUST","name":"Opportunity Trust Assessment","inputs":["ENT-OPPORTUNITY","ENT-SOURCE","ENT-OBSERVATION","ENT-ASSERTION","ENT-EVIDENCE-SNAPSHOT"],"outputs":["ENT-OPPORTUNITY-TRUST-ASSESSMENT"],"may_commit":False,"human_or_server_gate":"versioned assessment action; no binary authenticity claim without evidence","eval_dimensions":["risk_signal_precision","identity_consistency_grounding","freshness_awareness","false_certainty_rate","unknown_preservation"]})

    for item in [
      {"id":"CONF-PURSUIT-001","name":"Pursuit components have canonical producers","given":{"required":["fit","quality","transition"]},"expect":"canonical_actions_exist_before_pursuit_synthesis"},
      {"id":"CONF-ACCESS-002","name":"Access plan inputs are versioned assessments","given":{"relationship_fact":"worked_together","route":"warm_intro"},"expect":"relationship_assessment_then_route_assessment_then_access_plan"},
      {"id":"CONF-TRUST-001","name":"Unresolved trust evidence stays unresolved","given":{"identity_corroboration":"insufficient"},"expect":"unresolved_or_elevated_risk_not_fake_real_certainty"}
    ]: upsert(Q,item)

    save('entities/entity_registry.json',ed); save('actions/action_registry.json',ad); save('capabilities/capability_registry.json',cd); save('policies/policy_registry.json',pd); save('ai-functions/ai_function_registry.json',aid); save('conformance/cases.json',confd)
    print('ScopeCareer assessment dependency gaps closed')

if __name__=='__main__': main()
