#!/usr/bin/env python3
"""Idempotent semantic-registry expansion for ScopeCareer contracts v1.

The JSON registries remain authoritative. This utility applies the agreed V1
semantic expansion without selecting persistence/framework technology.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load(rel: str):
    with (ROOT / rel).open("r", encoding="utf-8") as f:
        return json.load(f)


def save(rel: str, doc):
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def upsert(items: list[dict], item: dict):
    for i, current in enumerate(items):
        if current["id"] == item["id"]:
            items[i] = item
            return
    items.append(item)


def upsert_name(items: list[dict], item: dict):
    for i, current in enumerate(items):
        if current["name"] == item["name"]:
            items[i] = item
            return
    items.append(item)


def main():
    entities_doc = load("entities/entity_registry.json")
    states_doc = load("states/state_registry.json")
    actions_doc = load("actions/action_registry.json")
    caps_doc = load("capabilities/capability_registry.json")
    policies_doc = load("policies/policy_registry.json")
    ai_doc = load("ai-functions/ai_function_registry.json")
    conf_doc = load("conformance/cases.json")

    entities = entities_doc["entities"]
    states = states_doc["state_machines"]
    actions = actions_doc["actions"]
    caps = caps_doc["capabilities"]
    policies = policies_doc["policies"]
    ai = ai_doc["functions"]
    conf = conf_doc["cases"]

    new_entities = [
        {"id":"ENT-PRINCIPAL","name":"Principal","domain":"trust","purpose":"Authenticated acting identity resolved for authorization.","fields":["id","user_id","principal_type","candidate_id","trust_plane","tenant_id","created_at"],"invariants":["principal type does not itself grant object access","trust plane is explicit"]},
        {"id":"ENT-DELEGATION-GRANT","name":"DelegationGrant","domain":"trust","purpose":"Candidate-granted bounded authority for a delegated principal such as a coach.","fields":["id","grantor_candidate_id","grantee_principal_id","purpose","capability_scope","action_scope","object_scope","data_scope","sensitivity_ceiling","starts_at","expires_at","revoked_at","created_at"],"state_machine":"SM-DELEGATION-GRANT","invariants":["delegation cannot widen candidate ownership","revocation and expiry take effect at server authorization time"]},
        {"id":"ENT-CONSENT-RECORD","name":"ConsentRecord","domain":"trust","purpose":"Auditable record of explicit consent for a defined purpose/scope.","fields":["id","candidate_id","purpose","scope","recipient_or_processor_ref","consent_text_version","granted_at","withdrawn_at","source_ref"],"invariants":["consent is purpose/scope specific","withdrawal is preserved rather than deleting historical consent evidence"]},
        {"id":"ENT-POLICY-DECISION","name":"PolicyDecision","domain":"trust","purpose":"Auditable authorization decision for a principal/action/object request.","fields":["id","principal_ref","trust_plane","purpose","capability_id","action_id","object_refs","data_scope","decision","policy_refs","decided_at","request_correlation_id"],"invariants":["model output cannot substitute for policy decision","deny remains default when required context is absent"]},
        {"id":"ENT-AI-INTERACTION-RECORD","name":"AIInteractionRecord","domain":"trust","purpose":"Trace material AI execution, inputs, versions, tool proposals and candidate/server review.","fields":["id","principal_ref","ai_function_id","model_provider","model_id","model_version","input_snapshot_ref","source_refs","prompt_or_template_version","tool_proposals","policy_decision_refs","human_review","output_refs","created_at"],"invariants":["AI trace does not imply authority","sensitive input references obey retention policy"]},
        {"id":"ENT-CAREER-PROFILE","name":"CareerProfile","domain":"career","purpose":"Candidate-owned root of the Career Evidence Graph.","fields":["id","candidate_id","current_revision","created_at","updated_at"],"invariants":["profile revision advances when canonical career evidence changes","profile is not equivalent to a resume"]},
        {"id":"ENT-EMPLOYMENT-EPISODE","name":"EmploymentEpisode","domain":"career","purpose":"Employment/leadership episode linking company, role, dates and contextual evidence.","fields":["id","candidate_id","company_ref","role_label","start_date","end_date","location_refs","assertion_refs","source_refs","sensitivity"],"invariants":["role/scope claims remain evidence-backed assertions where material"]},
        {"id":"ENT-LEADERSHIP-MANDATE","name":"LeadershipMandate","domain":"career","purpose":"Problem or mission entrusted to the candidate in a career episode.","fields":["id","candidate_id","employment_episode_ref","mandate_type","description_claim_ref","scope_assertion_refs","outcome_refs","sensitivity"],"invariants":["mandate wording cannot upgrade evidence status","scope is linked rather than copied into untraceable text"]},
        {"id":"ENT-TRANSFORMATION-PROGRAM","name":"TransformationProgram","domain":"career","purpose":"Large change program led or materially influenced by the candidate.","fields":["id","candidate_id","employment_episode_ref","leadership_mandate_ref","program_type","description_claim_ref","scope_assertion_refs","achievement_refs","stakeholder_exposure_refs"]},
        {"id":"ENT-ACHIEVEMENT","name":"Achievement","domain":"career","purpose":"Outcome-bearing career accomplishment linked to claims/evidence.","fields":["id","candidate_id","employment_episode_ref","leadership_mandate_ref","claim_ref","scope_fact_refs","source_refs","sensitivity"],"invariants":["quantified outcome must trace to a claim/assertion and evidence status"]},
        {"id":"ENT-DECISION-EXAMPLE","name":"DecisionExample","domain":"career","purpose":"Executive decision evidence: context, alternatives, rationale, action and result.","fields":["id","candidate_id","employment_episode_ref","context_claim_ref","alternative_claim_refs","decision_claim_ref","rationale_claim_ref","result_claim_ref","source_refs","sensitivity"]},
        {"id":"ENT-SCOPE-FACT","name":"ScopeFact","domain":"career","purpose":"Structured scale evidence such as P&L, budget, team, geography, customers or transaction volume.","fields":["id","candidate_id","scope_type","value","unit","assertion_ref","valid_from","valid_until","sensitivity"],"invariants":["scope value epistemics come from linked assertion","candidate attestation does not imply external verification"]},
        {"id":"ENT-STAKEHOLDER-EXPOSURE","name":"StakeholderExposure","domain":"career","purpose":"Evidence of board/executive/regulator/investor/customer/partner exposure.","fields":["id","candidate_id","employment_episode_ref","stakeholder_type","assertion_ref","context_claim_ref","sensitivity"]},
        {"id":"ENT-SKILL","name":"Skill","domain":"career","purpose":"Canonical capability/skill label referenced by evidence rather than treated as proof itself.","fields":["id","canonical_label","skill_family","aliases"],"invariants":["skill identity is distinct from candidate evidence of skill"]},
        {"id":"ENT-CREDENTIAL","name":"Credential","domain":"career","purpose":"Education, certification or professional qualification record.","fields":["id","candidate_id","credential_type","issuer","name","issued_at","expires_at","assertion_ref","source_refs","sensitivity"]},
        {"id":"ENT-CAREER-TRANSITION","name":"CareerTransition","domain":"career","purpose":"Structured transition between career episodes or intended trajectory states.","fields":["id","candidate_id","from_episode_ref","to_episode_ref","transition_type","assertion_refs","created_at"]},
        {"id":"ENT-TARGET-COMPANY","name":"TargetCompany","domain":"market","purpose":"Candidate-specific relationship to a company as a target/watch object.","fields":["id","candidate_id","company_ref","rationale","created_at","archived_at"],"invariants":["target company does not imply an active opportunity"]},
        {"id":"ENT-MARKET-SIGNAL","name":"MarketSignal","domain":"market","purpose":"Career-relevant observed signal such as leadership change, expansion, funding, M&A or transformation.","fields":["id","subject_ref","signal_type","observation_refs","assertion_refs","observed_at","valid_until","created_at"],"invariants":["market signal does not automatically create an opportunity","signal epistemics remain source-linked"]},
        {"id":"ENT-SEARCH-CONSULTANT","name":"SearchConsultant","domain":"market","purpose":"Search-consultant profile linking a Person to a SearchFirm; specialty claims use assertions.","fields":["id","person_ref","search_firm_ref","assertion_refs","created_at"],"invariants":["relationship to candidate remains a separate Relationship"]},
        {"id":"ENT-ROLE-MANDATE","name":"RoleMandate","domain":"opportunity","purpose":"Versioned synthesis of what the executive role is expected to accomplish.","fields":["id","opportunity_id","input_snapshot_ref","mandate_components","assertion_refs","confidence","created_at","superseded_by"],"invariants":["mandate is evidence-grounded synthesis","new material evidence creates a new version"]},
        {"id":"ENT-SUCCESS-PROFILE","name":"SuccessProfile","domain":"opportunity","purpose":"Versioned outcomes/evidence expected for success in the opportunity.","fields":["id","opportunity_id","input_snapshot_ref","success_dimensions","assertion_refs","confidence","created_at","superseded_by"]},
        {"id":"ENT-MANDATE-EVIDENCE-BINDING","name":"MandateEvidenceBinding","domain":"career","purpose":"Candidate-approved binding between a role-mandate fragment and relevant career evidence.","fields":["id","candidate_id","opportunity_id","role_mandate_ref","mandate_fragment","career_claim_refs","career_object_refs","created_at","updated_at"],"invariants":["binding does not alter evidence status","binding is reusable by positioning/resume/selection under usage policy"]},
        {"id":"ENT-POSITIONING-BRIEF","name":"PositioningBrief","domain":"positioning","purpose":"Opportunity-specific executive positioning strategy grounded in permitted evidence.","fields":["id","candidate_id","opportunity_id","input_snapshot_ref","mandate_evidence_binding_refs","narrative","strengths","anticipated_concerns","unknowns","evidence_refs","created_at","superseded_by"],"invariants":["factual statements trace to permitted evidence","brief itself is not externally shared without a distinct effect"]},
        {"id":"ENT-RESUME-MASTER","name":"ResumeMaster","domain":"positioning","purpose":"Candidate-approved base resume representation distinct from Career Evidence Graph.","fields":["id","candidate_id","source_ref","version","created_at","superseded_by"]},
        {"id":"ENT-RESUME-VARIANT","name":"ResumeVariant","domain":"positioning","purpose":"Opportunity-specific resume variant assembled from permitted career evidence.","fields":["id","candidate_id","opportunity_id","base_resume_ref","positioning_brief_ref","content_ref","evidence_refs","created_at","superseded_by"],"state_machine":"SM-RESUME-VARIANT","invariants":["approved variant cannot contain unsupported factual claims","prepare does not share/apply"]},
        {"id":"ENT-RESUME-CHANGE","name":"ResumeChange","domain":"positioning","purpose":"Reviewable atomic change from base/current resume content to proposed wording.","fields":["id","resume_variant_ref","original_text","proposed_text","reason","career_claim_refs","evidence_refs","interpretation_status","review_state","created_at"]},
        {"id":"ENT-EXECUTIVE-BIO","name":"ExecutiveBio","domain":"positioning","purpose":"Short executive profile generated from approved/permitted career evidence.","fields":["id","candidate_id","purpose","content_ref","evidence_refs","usage_scope","version","created_at"]},
        {"id":"ENT-LEADERSHIP-STORY","name":"LeadershipStory","domain":"positioning","purpose":"Reusable evidence-backed story for executive selection conversations.","fields":["id","candidate_id","story_type","context_claim_refs","action_claim_refs","outcome_claim_refs","evidence_refs","usage_scope","created_at"]},
        {"id":"ENT-SELECTION-STAGE","name":"SelectionStage","domain":"selection","purpose":"Concrete stage node in an opportunity selection process.","fields":["id","selection_process_ref","stage_type","sequence_or_dependencies","scheduled_at","completed_at","participant_refs","source_refs"],"state_machine":"SM-SELECTION-STAGE"},
        {"id":"ENT-SELECTION-PARTICIPANT","name":"SelectionParticipant","domain":"selection","purpose":"Person/stakeholder participating in a selection stage.","fields":["id","selection_stage_ref","person_ref","role_context","assertion_refs","created_at"]},
        {"id":"ENT-STAKEHOLDER-HYPOTHESIS","name":"StakeholderHypothesis","domain":"selection","extends":"ENT-ASSESSMENT","purpose":"Versioned hypothesis about stakeholder agenda, concerns or influence.","fields":["selection_participant_ref","agenda_hypotheses","concerns","influence_hypothesis"],"invariants":["hypothesis is not a fact unless separately supported by assertions"]},
        {"id":"ENT-PREPARATION-BRIEF","name":"PreparationBrief","domain":"selection","purpose":"Stage/participant-specific preparation grounded in career evidence and current opportunity intelligence.","fields":["id","candidate_id","opportunity_id","selection_stage_ref","participant_ref","input_snapshot_ref","positioning_brief_ref","evidence_refs","open_question_refs","created_at","superseded_by"]},
        {"id":"ENT-DEBRIEF","name":"Debrief","domain":"selection","purpose":"Candidate-provided post-interaction note/voice-derived record before extracted assertions are committed.","fields":["id","candidate_id","interaction_ref","source_ref","raw_or_transcript_ref","candidate_reviewed_at","created_at","sensitivity"],"invariants":["debrief extraction proposes observations/assertions; it does not directly rewrite opportunity facts"]},
        {"id":"ENT-OPEN-QUESTION","name":"OpenQuestion","domain":"selection","purpose":"Unresolved question that can materially change pursuit/selection interpretation.","fields":["id","candidate_id","opportunity_id","question","reason","source_refs","resolved_assertion_ref","opened_at","resolved_at"]},
        {"id":"ENT-COMMITMENT","name":"Commitment","domain":"selection","purpose":"Follow-up/action commitment made by candidate or counterpart in an interaction.","fields":["id","candidate_id","opportunity_id","interaction_ref","owner_ref","description","due_at","completed_at","source_refs"]},
        {"id":"ENT-OFFER-COMPONENT","name":"OfferComponent","domain":"outcome","purpose":"Structured financial or non-financial offer term.","fields":["id","offer_ref","component_type","value","currency_or_unit","assertion_ref","sensitivity"]},
        {"id":"ENT-DECISION-CRITERION","name":"DecisionCriterion","domain":"outcome","purpose":"Candidate-defined criterion for evaluating an offer/opportunity decision.","fields":["id","candidate_id","criterion_type","weight_or_priority","notes","version"]},
        {"id":"ENT-DECISION-BRIEF","name":"DecisionBrief","domain":"outcome","purpose":"Versioned decision support over offer terms, mandate, authority, trajectory, risk and candidate criteria.","fields":["id","candidate_id","opportunity_id","offer_ref","input_snapshot_ref","criterion_refs","assessment_refs","tradeoffs","unknowns","confidence","created_at","superseded_by"],"invariants":["decision brief never accepts or declines an offer"]},
        {"id":"ENT-STRATEGY-SIGNAL","name":"StrategySignal","domain":"strategy","purpose":"Longitudinal candidate-facing pattern with explicit sample/context/confidence.","fields":["id","candidate_id","signal_type","time_window","sample_size","context","confidence","supporting_refs","created_at"],"invariants":["small samples remain explicitly low-confidence"]},
        {"id":"ENT-STRATEGY-HYPOTHESIS","name":"StrategyHypothesis","domain":"strategy","purpose":"Testable career-search hypothesis derived from evidence/signals.","fields":["id","candidate_id","statement","supporting_signal_refs","created_at","superseded_by"]},
        {"id":"ENT-STRATEGY-EXPERIMENT","name":"StrategyExperiment","domain":"strategy","purpose":"Bounded experiment over role/geography/mandate/access/positioning strategy.","fields":["id","candidate_id","hypothesis_ref","variables","measurement_plan","start_at","end_at","created_at"],"state_machine":"SM-STRATEGY-EXPERIMENT"},
        {"id":"ENT-EXPERIMENT-OBSERVATION","name":"ExperimentObservation","domain":"strategy","purpose":"Observed outcome/progression evidence associated with a strategy experiment.","fields":["id","experiment_ref","opportunity_ref","interaction_ref","outcome_ref","observed_at","notes"]}
    ]
    for item in new_entities:
        upsert(entities, item)

    # Expand existing canonical objects where the semantic correction changes lifecycle.
    for e in entities:
        if e["id"] == "ENT-MARKET-WATCH":
            e["fields"] = ["id","candidate_id","watch_type","criteria","frequency_policy","created_at","updated_at","archived_at"]
            e["state_machine"] = "SM-MARKET-WATCH"
            e["invariants"] = ["business durability is platform-owned, not protocol-task-owned","watch state is not MCP task state"]
        elif e["id"] == "ENT-SELECTION-PROCESS":
            e["fields"] = ["id","opportunity_id","stage_refs","participant_refs","created_at","updated_at"]
        elif e["id"] == "ENT-OFFER":
            e["fields"] = ["id","opportunity_id","component_refs","source_refs","received_at","sensitivity","created_at"]
            e["state_machine"] = "SM-OFFER-DECISION"
            e["invariants"] = ["offer capture does not imply acceptance","candidate decision intent is distinct from external response"]
        elif e["id"] == "ENT-CAREER-CLAIM":
            e["state_machine"] = "SM-CAREER-CLAIM-REVIEW"

    new_states = [
        {"id":"SM-CAREER-CLAIM-REVIEW","entity":"ENT-CAREER-CLAIM","dimension":"claim_review_state","states":["proposed","under_review","attested","rejected","superseded"],"transitions":[
            {"from":"proposed","to":"under_review","action":"ACT-CAREER-CLAIM-REVIEW"},
            {"from":"proposed","to":"attested","action":"ACT-CAREER-CLAIM-ATTEST"},
            {"from":"under_review","to":"attested","action":"ACT-CAREER-CLAIM-ATTEST"},
            {"from":"proposed","to":"rejected","action":"ACT-CAREER-CLAIM-REJECT"},
            {"from":"under_review","to":"rejected","action":"ACT-CAREER-CLAIM-REJECT"},
            {"from":"attested","to":"superseded","action":"ACT-CAREER-CLAIM-SUPERSEDE"}
        ],"invariants":["attested is self-attestation, not external verification","AI cannot attest for candidate"]},
        {"id":"SM-DELEGATION-GRANT","entity":"ENT-DELEGATION-GRANT","dimension":"delegation_state","states":["draft","active","revoked","expired"],"transitions":[
            {"from":"draft","to":"active","action":"ACT-DELEGATION-ACTIVATE"},
            {"from":"active","to":"revoked","action":"ACT-DELEGATION-REVOKE"},
            {"from":"active","to":"expired","action":"ACT-DELEGATION-EXPIRE"}
        ],"invariants":["revoked/expired grants cannot authorize any call","activation requires candidate approval"]},
        {"id":"SM-RESUME-VARIANT","entity":"ENT-RESUME-VARIANT","dimension":"resume_variant_state","states":["draft","reviewing","approved","rejected","superseded"],"transitions":[
            {"from":"draft","to":"reviewing","action":"ACT-RESUME-VARIANT-REVIEW"},
            {"from":"draft","to":"approved","action":"ACT-RESUME-VARIANT-APPROVE"},
            {"from":"reviewing","to":"approved","action":"ACT-RESUME-VARIANT-APPROVE"},
            {"from":"draft","to":"rejected","action":"ACT-RESUME-VARIANT-REJECT"},
            {"from":"reviewing","to":"rejected","action":"ACT-RESUME-VARIANT-REJECT"},
            {"from":"approved","to":"superseded","action":"ACT-RESUME-VARIANT-SUPERSEDE"}
        ],"invariants":["approved does not mean externally shared or applied","approval requires evidence-grounding policy"]},
        {"id":"SM-SELECTION-STAGE","entity":"ENT-SELECTION-STAGE","dimension":"selection_stage_state","states":["planned","scheduled","completed","cancelled"],"transitions":[
            {"from":"planned","to":"scheduled","action":"ACT-SELECTION-STAGE-SCHEDULE"},
            {"from":"planned","to":"completed","action":"ACT-SELECTION-STAGE-COMPLETE"},
            {"from":"scheduled","to":"completed","action":"ACT-SELECTION-STAGE-COMPLETE"},
            {"from":"planned","to":"cancelled","action":"ACT-SELECTION-STAGE-CANCEL"},
            {"from":"scheduled","to":"cancelled","action":"ACT-SELECTION-STAGE-CANCEL"}
        ]},
        {"id":"SM-MARKET-WATCH","entity":"ENT-MARKET-WATCH","dimension":"market_watch_state","states":["active","paused","archived"],"transitions":[
            {"from":"active","to":"paused","action":"ACT-MARKET-WATCH-PAUSE"},
            {"from":"paused","to":"active","action":"ACT-MARKET-WATCH-RESUME"},
            {"from":"active","to":"archived","action":"ACT-MARKET-WATCH-ARCHIVE"},
            {"from":"paused","to":"archived","action":"ACT-MARKET-WATCH-ARCHIVE"}
        ],"invariants":["watch lifecycle is business state, not MCP task lifecycle"]},
        {"id":"SM-OFFER-DECISION","entity":"ENT-OFFER","dimension":"offer_decision_state","states":["received","under_review","decision_ready","intent_accept","intent_decline","closed"],"transitions":[
            {"from":"received","to":"under_review","action":"ACT-OFFER-REVIEW"},
            {"from":"under_review","to":"decision_ready","action":"ACT-OFFER-DECISION-PREPARE"},
            {"from":"decision_ready","to":"intent_accept","action":"ACT-OFFER-INTENT-ACCEPT"},
            {"from":"decision_ready","to":"intent_decline","action":"ACT-OFFER-INTENT-DECLINE"},
            {"from":"intent_accept","to":"closed","action":"ACT-OFFER-CLOSE"},
            {"from":"intent_decline","to":"closed","action":"ACT-OFFER-CLOSE"}
        ],"invariants":["intent_accept/intent_decline are private candidate intent until an external response action occurs","AI cannot set candidate intent"]},
        {"id":"SM-STRATEGY-EXPERIMENT","entity":"ENT-STRATEGY-EXPERIMENT","dimension":"strategy_experiment_state","states":["draft","active","paused","completed","cancelled"],"transitions":[
            {"from":"draft","to":"active","action":"ACT-STRATEGY-EXPERIMENT-ACTIVATE"},
            {"from":"active","to":"paused","action":"ACT-STRATEGY-EXPERIMENT-PAUSE"},
            {"from":"paused","to":"active","action":"ACT-STRATEGY-EXPERIMENT-ACTIVATE"},
            {"from":"active","to":"completed","action":"ACT-STRATEGY-EXPERIMENT-COMPLETE"},
            {"from":"draft","to":"cancelled","action":"ACT-STRATEGY-EXPERIMENT-CANCEL"},
            {"from":"active","to":"cancelled","action":"ACT-STRATEGY-EXPERIMENT-CANCEL"},
            {"from":"paused","to":"cancelled","action":"ACT-STRATEGY-EXPERIMENT-CANCEL"}
        ]}
    ]
    for item in new_states:
        upsert(states, item)

    new_actions = [
        {"id":"ACT-CAREER-CLAIM-PROPOSE","name":"ProposeCareerClaim","capability":"CAP-CAREER-EVIDENCE","effect_class":"internal_proposal","approval_class":"normal_authorization","reads":["ENT-SOURCE","ENT-OBSERVATION"],"writes":[],"proposes":["ENT-CAREER-CLAIM"]},
        {"id":"ACT-CAREER-CLAIM-REVIEW","name":"ReviewCareerClaim","capability":"CAP-CAREER-EVIDENCE","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-CAREER-CLAIM"],"writes":["ENT-CAREER-CLAIM"]},
        {"id":"ACT-CAREER-CLAIM-ATTEST","name":"AttestCareerClaim","capability":"CAP-CAREER-EVIDENCE","effect_class":"internal_mutation","approval_class":"explicit_user_confirmation","reads":["ENT-CAREER-CLAIM"],"writes":["ENT-CAREER-CLAIM"],"guards":["candidate_is_claim_owner"]},
        {"id":"ACT-CAREER-CLAIM-REJECT","name":"RejectCareerClaim","capability":"CAP-CAREER-EVIDENCE","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-CAREER-CLAIM"],"writes":["ENT-CAREER-CLAIM"]},
        {"id":"ACT-CAREER-CLAIM-SUPERSEDE","name":"SupersedeCareerClaim","capability":"CAP-CAREER-EVIDENCE","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-CAREER-CLAIM"],"writes":["ENT-CAREER-CLAIM"]},
        {"id":"ACT-CAREER-HISTORY-RECORD","name":"RecordCareerHistory","capability":"CAP-CAREER-EVIDENCE","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-CAREER-CLAIM","ENT-ASSERTION"],"writes":["ENT-EMPLOYMENT-EPISODE","ENT-LEADERSHIP-MANDATE","ENT-TRANSFORMATION-PROGRAM","ENT-ACHIEVEMENT","ENT-SCOPE-FACT","ENT-STAKEHOLDER-EXPOSURE"]},
        {"id":"ACT-CAREER-INTENT-UPDATE","name":"UpdateCareerIntent","capability":"CAP-CAREER-INTENT","effect_class":"internal_mutation","approval_class":"explicit_user_confirmation","reads":["ENT-CAREER-INTENT"],"writes":["ENT-CAREER-INTENT"]},
        {"id":"ACT-MANDATE-EVIDENCE-BIND","name":"BindMandateEvidence","capability":"CAP-EVIDENCE-BINDING","effect_class":"internal_mutation","approval_class":"explicit_user_confirmation","reads":["ENT-ROLE-MANDATE","ENT-CAREER-CLAIM","ENT-EMPLOYMENT-EPISODE","ENT-LEADERSHIP-MANDATE","ENT-ACHIEVEMENT"],"writes":["ENT-MANDATE-EVIDENCE-BINDING"]},
        {"id":"ACT-TARGET-COMPANY-ADD","name":"AddTargetCompany","capability":"CAP-MARKET-INTELLIGENCE","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-COMPANY"],"writes":["ENT-TARGET-COMPANY"]},
        {"id":"ACT-TARGET-COMPANY-ARCHIVE","name":"ArchiveTargetCompany","capability":"CAP-MARKET-INTELLIGENCE","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-TARGET-COMPANY"],"writes":["ENT-TARGET-COMPANY"]},
        {"id":"ACT-MARKET-SIGNAL-RECORD","name":"RecordMarketSignal","capability":"CAP-MARKET-INTELLIGENCE","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-OBSERVATION","ENT-ASSERTION"],"writes":["ENT-MARKET-SIGNAL"],"guards":["source_link_preserved"]},
        {"id":"ACT-ROLE-MANDATE-SYNTHESIZE","name":"SynthesizeRoleMandate","capability":"CAP-ROLE-MANDATE","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-OPPORTUNITY","ENT-EVIDENCE-SNAPSHOT","ENT-ASSERTION"],"writes":["ENT-ROLE-MANDATE","ENT-SUCCESS-PROFILE"],"guards":["immutable_input_snapshot"]},
        {"id":"ACT-POSITIONING-PREPARE","name":"PreparePositioningBrief","capability":"CAP-POSITIONING","effect_class":"internal_proposal","approval_class":"normal_authorization","reads":["ENT-OPPORTUNITY","ENT-ROLE-MANDATE","ENT-MANDATE-EVIDENCE-BINDING","ENT-CAREER-CLAIM","ENT-EVIDENCE-SNAPSHOT"],"writes":[],"proposes":["ENT-POSITIONING-BRIEF"]},
        {"id":"ACT-POSITIONING-COMMIT","name":"CommitPositioningBrief","capability":"CAP-POSITIONING","effect_class":"internal_mutation","approval_class":"explicit_user_confirmation","reads":["ENT-POSITIONING-BRIEF","ENT-CAREER-CLAIM"],"writes":["ENT-POSITIONING-BRIEF"],"guards":["usage_permissions_satisfied","factual_statements_evidence_grounded"]},
        {"id":"ACT-RESUME-VARIANT-PREPARE","name":"PrepareResumeVariant","capability":"CAP-RESUME","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-RESUME-MASTER","ENT-POSITIONING-BRIEF","ENT-CAREER-CLAIM","ENT-MANDATE-EVIDENCE-BINDING"],"writes":["ENT-RESUME-VARIANT","ENT-RESUME-CHANGE"],"guards":["usage_permissions_satisfied"]},
        {"id":"ACT-RESUME-VARIANT-REVIEW","name":"ReviewResumeVariant","capability":"CAP-RESUME","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-RESUME-VARIANT","ENT-RESUME-CHANGE"],"writes":["ENT-RESUME-VARIANT"]},
        {"id":"ACT-RESUME-VARIANT-APPROVE","name":"ApproveResumeVariant","capability":"CAP-RESUME","effect_class":"internal_mutation","approval_class":"explicit_user_confirmation","reads":["ENT-RESUME-VARIANT","ENT-RESUME-CHANGE","ENT-CAREER-CLAIM"],"writes":["ENT-RESUME-VARIANT"],"guards":["no_unsupported_factual_claims","usage_permissions_satisfied"]},
        {"id":"ACT-RESUME-VARIANT-REJECT","name":"RejectResumeVariant","capability":"CAP-RESUME","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-RESUME-VARIANT"],"writes":["ENT-RESUME-VARIANT"]},
        {"id":"ACT-RESUME-VARIANT-SUPERSEDE","name":"SupersedeResumeVariant","capability":"CAP-RESUME","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-RESUME-VARIANT"],"writes":["ENT-RESUME-VARIANT"]},
        {"id":"ACT-EXECUTIVE-BIO-PREPARE","name":"PrepareExecutiveBio","capability":"CAP-POSITIONING","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-CAREER-CLAIM","ENT-LEADERSHIP-MANDATE","ENT-ACHIEVEMENT"],"writes":["ENT-EXECUTIVE-BIO"],"guards":["usage_permissions_satisfied"]},
        {"id":"ACT-LEADERSHIP-STORY-CREATE","name":"CreateLeadershipStory","capability":"CAP-POSITIONING","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-CAREER-CLAIM","ENT-DECISION-EXAMPLE","ENT-ACHIEVEMENT"],"writes":["ENT-LEADERSHIP-STORY"]},
        {"id":"ACT-SELECTION-PROCESS-DEFINE","name":"DefineSelectionProcess","capability":"CAP-SELECTION","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-OPPORTUNITY","ENT-ASSERTION"],"writes":["ENT-SELECTION-PROCESS","ENT-SELECTION-STAGE","ENT-SELECTION-PARTICIPANT"]},
        {"id":"ACT-SELECTION-STAGE-SCHEDULE","name":"ScheduleSelectionStage","capability":"CAP-SELECTION","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-SELECTION-STAGE"],"writes":["ENT-SELECTION-STAGE"]},
        {"id":"ACT-SELECTION-STAGE-COMPLETE","name":"CompleteSelectionStage","capability":"CAP-SELECTION","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-SELECTION-STAGE"],"writes":["ENT-SELECTION-STAGE"]},
        {"id":"ACT-SELECTION-STAGE-CANCEL","name":"CancelSelectionStage","capability":"CAP-SELECTION","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-SELECTION-STAGE"],"writes":["ENT-SELECTION-STAGE"]},
        {"id":"ACT-SELECTION-PREPARE","name":"PrepareSelectionStage","capability":"CAP-SELECTION-PREPARATION","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-OPPORTUNITY","ENT-SELECTION-STAGE","ENT-SELECTION-PARTICIPANT","ENT-STAKEHOLDER-HYPOTHESIS","ENT-POSITIONING-BRIEF","ENT-CAREER-CLAIM","ENT-OPEN-QUESTION","ENT-EVIDENCE-SNAPSHOT"],"writes":["ENT-PREPARATION-BRIEF"]},
        {"id":"ACT-DEBRIEF-CAPTURE","name":"CaptureDebrief","capability":"CAP-SELECTION-PREPARATION","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-INTERACTION","ENT-SOURCE"],"writes":["ENT-DEBRIEF","ENT-OBSERVATION"],"proposes":["ENT-ASSERTION"]},
        {"id":"ACT-OPEN-QUESTION-ADD","name":"AddOpenQuestion","capability":"CAP-SELECTION-PREPARATION","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-OPPORTUNITY"],"writes":["ENT-OPEN-QUESTION"]},
        {"id":"ACT-OPEN-QUESTION-RESOLVE","name":"ResolveOpenQuestion","capability":"CAP-SELECTION-PREPARATION","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-OPEN-QUESTION","ENT-ASSERTION"],"writes":["ENT-OPEN-QUESTION"],"guards":["resolved_assertion_present"]},
        {"id":"ACT-COMMITMENT-ADD","name":"AddCommitment","capability":"CAP-SELECTION-PREPARATION","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-INTERACTION"],"writes":["ENT-COMMITMENT"]},
        {"id":"ACT-COMMITMENT-COMPLETE","name":"CompleteCommitment","capability":"CAP-SELECTION-PREPARATION","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-COMMITMENT"],"writes":["ENT-COMMITMENT"]},
        {"id":"ACT-MARKET-WATCH-PAUSE","name":"PauseMarketWatch","capability":"CAP-MARKET-WATCH","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-MARKET-WATCH"],"writes":["ENT-MARKET-WATCH"]},
        {"id":"ACT-MARKET-WATCH-RESUME","name":"ResumeMarketWatch","capability":"CAP-MARKET-WATCH","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-MARKET-WATCH"],"writes":["ENT-MARKET-WATCH"]},
        {"id":"ACT-MARKET-WATCH-ARCHIVE","name":"ArchiveMarketWatch","capability":"CAP-MARKET-WATCH","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-MARKET-WATCH"],"writes":["ENT-MARKET-WATCH"]},
        {"id":"ACT-OFFER-CAPTURE","name":"CaptureOffer","capability":"CAP-OFFER-DECISION","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-SOURCE","ENT-ASSERTION"],"writes":["ENT-OFFER","ENT-OFFER-COMPONENT"]},
        {"id":"ACT-OFFER-REVIEW","name":"ReviewOffer","capability":"CAP-OFFER-DECISION","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-OFFER","ENT-OFFER-COMPONENT"],"writes":["ENT-OFFER"]},
        {"id":"ACT-OFFER-DECISION-PREPARE","name":"PrepareOfferDecision","capability":"CAP-OFFER-DECISION","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-OFFER","ENT-OFFER-COMPONENT","ENT-DECISION-CRITERION","ENT-PURSUIT-ASSESSMENT","ENT-EVIDENCE-SNAPSHOT"],"writes":["ENT-DECISION-BRIEF","ENT-OFFER"]},
        {"id":"ACT-OFFER-INTENT-ACCEPT","name":"SetOfferIntentAccept","capability":"CAP-OFFER-DECISION","effect_class":"internal_mutation","approval_class":"explicit_user_confirmation","reads":["ENT-OFFER","ENT-DECISION-BRIEF"],"writes":["ENT-OFFER"]},
        {"id":"ACT-OFFER-INTENT-DECLINE","name":"SetOfferIntentDecline","capability":"CAP-OFFER-DECISION","effect_class":"internal_mutation","approval_class":"explicit_user_confirmation","reads":["ENT-OFFER","ENT-DECISION-BRIEF"],"writes":["ENT-OFFER"]},
        {"id":"ACT-OFFER-CLOSE","name":"CloseOfferDecision","capability":"CAP-OFFER-DECISION","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-OFFER"],"writes":["ENT-OFFER"]},
        {"id":"ACT-OUTCOME-RECORD","name":"RecordOutcome","capability":"CAP-OUTCOME-STRATEGY","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-OPPORTUNITY","ENT-SOURCE"],"writes":["ENT-OUTCOME"]},
        {"id":"ACT-STRATEGY-SIGNAL-CREATE","name":"CreateStrategySignal","capability":"CAP-OUTCOME-STRATEGY","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-OUTCOME","ENT-INTERACTION","ENT-OPPORTUNITY"],"writes":["ENT-STRATEGY-SIGNAL"],"guards":["sample_size_and_context_present"]},
        {"id":"ACT-STRATEGY-HYPOTHESIS-CREATE","name":"CreateStrategyHypothesis","capability":"CAP-OUTCOME-STRATEGY","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-STRATEGY-SIGNAL"],"writes":["ENT-STRATEGY-HYPOTHESIS"]},
        {"id":"ACT-STRATEGY-EXPERIMENT-CREATE","name":"CreateStrategyExperiment","capability":"CAP-OUTCOME-STRATEGY","effect_class":"internal_mutation","approval_class":"explicit_user_confirmation","reads":["ENT-STRATEGY-HYPOTHESIS"],"writes":["ENT-STRATEGY-EXPERIMENT"]},
        {"id":"ACT-STRATEGY-EXPERIMENT-ACTIVATE","name":"ActivateStrategyExperiment","capability":"CAP-OUTCOME-STRATEGY","effect_class":"internal_mutation","approval_class":"explicit_user_confirmation","reads":["ENT-STRATEGY-EXPERIMENT"],"writes":["ENT-STRATEGY-EXPERIMENT"]},
        {"id":"ACT-STRATEGY-EXPERIMENT-PAUSE","name":"PauseStrategyExperiment","capability":"CAP-OUTCOME-STRATEGY","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-STRATEGY-EXPERIMENT"],"writes":["ENT-STRATEGY-EXPERIMENT"]},
        {"id":"ACT-STRATEGY-EXPERIMENT-COMPLETE","name":"CompleteStrategyExperiment","capability":"CAP-OUTCOME-STRATEGY","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-STRATEGY-EXPERIMENT","ENT-EXPERIMENT-OBSERVATION"],"writes":["ENT-STRATEGY-EXPERIMENT"]},
        {"id":"ACT-STRATEGY-EXPERIMENT-CANCEL","name":"CancelStrategyExperiment","capability":"CAP-OUTCOME-STRATEGY","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-STRATEGY-EXPERIMENT"],"writes":["ENT-STRATEGY-EXPERIMENT"]},
        {"id":"ACT-DELEGATION-CREATE","name":"CreateDelegationGrant","capability":"CAP-DELEGATION-CONSENT","effect_class":"internal_mutation","approval_class":"explicit_user_confirmation","reads":["ENT-PRINCIPAL"],"writes":["ENT-DELEGATION-GRANT"]},
        {"id":"ACT-DELEGATION-ACTIVATE","name":"ActivateDelegationGrant","capability":"CAP-DELEGATION-CONSENT","effect_class":"internal_mutation","approval_class":"step_up","reads":["ENT-DELEGATION-GRANT"],"writes":["ENT-DELEGATION-GRANT"]},
        {"id":"ACT-DELEGATION-REVOKE","name":"RevokeDelegationGrant","capability":"CAP-DELEGATION-CONSENT","effect_class":"internal_mutation","approval_class":"explicit_user_confirmation","reads":["ENT-DELEGATION-GRANT"],"writes":["ENT-DELEGATION-GRANT"]},
        {"id":"ACT-DELEGATION-EXPIRE","name":"ExpireDelegationGrant","capability":"CAP-DELEGATION-CONSENT","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-DELEGATION-GRANT"],"writes":["ENT-DELEGATION-GRANT"]},
        {"id":"ACT-CONSENT-RECORD","name":"RecordConsent","capability":"CAP-DELEGATION-CONSENT","effect_class":"internal_mutation","approval_class":"explicit_user_confirmation","reads":[],"writes":["ENT-CONSENT-RECORD"]},
        {"id":"ACT-POLICY-DECISION-RECORD","name":"RecordPolicyDecision","capability":"CAP-AUDIT-GOVERNANCE","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-PRINCIPAL"],"writes":["ENT-POLICY-DECISION"]},
        {"id":"ACT-AI-INTERACTION-RECORD","name":"RecordAIInteraction","capability":"CAP-AUDIT-GOVERNANCE","effect_class":"internal_mutation","approval_class":"normal_authorization","reads":["ENT-PRINCIPAL","ENT-EVIDENCE-SNAPSHOT"],"writes":["ENT-AI-INTERACTION-RECORD"]}
    ]
    for item in new_actions:
        upsert(actions, item)

    new_caps = [
        {"id":"CAP-CAREER-EVIDENCE","name":"Career Evidence Graph","domain":"career","purpose":"Build and maintain candidate career evidence without conflating attestation, evidence status and external verification.","owns":["ENT-CAREER-PROFILE","ENT-CAREER-CLAIM","ENT-EMPLOYMENT-EPISODE","ENT-LEADERSHIP-MANDATE","ENT-TRANSFORMATION-PROGRAM","ENT-ACHIEVEMENT","ENT-DECISION-EXAMPLE","ENT-SCOPE-FACT","ENT-STAKEHOLDER-EXPOSURE","ENT-CREDENTIAL","ENT-CAREER-TRANSITION"],"reads":["ENT-SOURCE","ENT-OBSERVATION","ENT-ASSERTION","ENT-SKILL"],"actions":["ACT-CAREER-CLAIM-PROPOSE","ACT-CAREER-CLAIM-REVIEW","ACT-CAREER-CLAIM-ATTEST","ACT-CAREER-CLAIM-REJECT","ACT-CAREER-CLAIM-SUPERSEDE","ACT-CAREER-HISTORY-RECORD"],"state_machines":["SM-CAREER-CLAIM-REVIEW"],"ai_role":"extract/propose; candidate attests; evidence status remains policy-governed","external_effects":[]},
        {"id":"CAP-CAREER-INTENT","name":"Career Intent","domain":"career","purpose":"Maintain candidate-owned desired trajectory and constraints as a versioned decision input.","owns":["ENT-CAREER-INTENT"],"reads":[],"actions":["ACT-CAREER-INTENT-UPDATE"],"external_effects":[]},
        {"id":"CAP-EVIDENCE-BINDING","name":"Mandate Evidence Binding","domain":"career","purpose":"Bind role-mandate fragments to candidate-selected career evidence for downstream reuse.","owns":["ENT-MANDATE-EVIDENCE-BINDING"],"reads":["ENT-ROLE-MANDATE","ENT-CAREER-CLAIM","ENT-EMPLOYMENT-EPISODE","ENT-LEADERSHIP-MANDATE","ENT-ACHIEVEMENT"],"actions":["ACT-MANDATE-EVIDENCE-BIND"],"external_effects":[],"invariants":["binding does not change evidence truth status"]},
        {"id":"CAP-MARKET-INTELLIGENCE","name":"Market and Target Intelligence","domain":"market","purpose":"Represent target companies, market signals and executive-search context without inventing opportunities.","owns":["ENT-TARGET-COMPANY","ENT-MARKET-SIGNAL","ENT-SEARCH-CONSULTANT"],"reads":["ENT-COMPANY","ENT-PERSON","ENT-SEARCH-FIRM","ENT-OBSERVATION","ENT-ASSERTION","ENT-CAREER-INTENT"],"actions":["ACT-TARGET-COMPANY-ADD","ACT-TARGET-COMPANY-ARCHIVE","ACT-MARKET-SIGNAL-RECORD"],"external_effects":[],"invariants":["market signal does not automatically create opportunity"]},
        {"id":"CAP-ROLE-MANDATE","name":"Role Mandate Intelligence","domain":"opportunity","purpose":"Build versioned evidence-grounded role mandate and success-profile syntheses.","owns":["ENT-ROLE-MANDATE","ENT-SUCCESS-PROFILE"],"reads":["ENT-OPPORTUNITY","ENT-ASSERTION","ENT-EVIDENCE-SNAPSHOT"],"actions":["ACT-ROLE-MANDATE-SYNTHESIZE"],"ai_role":"synthesize from snapshot; do not promote inference to fact","external_effects":[]},
        {"id":"CAP-POSITIONING","name":"Executive Positioning","domain":"positioning","purpose":"Prepare opportunity-specific positioning, executive bio and leadership stories from permitted evidence.","owns":["ENT-POSITIONING-BRIEF","ENT-EXECUTIVE-BIO","ENT-LEADERSHIP-STORY"],"reads":["ENT-ROLE-MANDATE","ENT-MANDATE-EVIDENCE-BINDING","ENT-CAREER-CLAIM","ENT-LEADERSHIP-MANDATE","ENT-ACHIEVEMENT","ENT-DECISION-EXAMPLE"],"actions":["ACT-POSITIONING-PREPARE","ACT-POSITIONING-COMMIT","ACT-EXECUTIVE-BIO-PREPARE","ACT-LEADERSHIP-STORY-CREATE"],"ai_role":"draft/restructure; factual wording remains evidence/usage constrained","external_effects":[]},
        {"id":"CAP-RESUME","name":"Evidence-Grounded Resume","domain":"positioning","purpose":"Prepare and review opportunity-specific resume variants without fabricated claims.","owns":["ENT-RESUME-MASTER","ENT-RESUME-VARIANT","ENT-RESUME-CHANGE"],"reads":["ENT-POSITIONING-BRIEF","ENT-MANDATE-EVIDENCE-BINDING","ENT-CAREER-CLAIM"],"actions":["ACT-RESUME-VARIANT-PREPARE","ACT-RESUME-VARIANT-REVIEW","ACT-RESUME-VARIANT-APPROVE","ACT-RESUME-VARIANT-REJECT","ACT-RESUME-VARIANT-SUPERSEDE"],"state_machines":["SM-RESUME-VARIANT"],"ai_role":"propose wording/change; candidate approves","external_effects":[]},
        {"id":"CAP-SELECTION-PREPARATION","name":"Selection Preparation and Debrief","domain":"selection","purpose":"Prepare for specific stages/stakeholders and convert debriefs into reviewable intelligence.","owns":["ENT-STAKEHOLDER-HYPOTHESIS","ENT-PREPARATION-BRIEF","ENT-DEBRIEF","ENT-OPEN-QUESTION","ENT-COMMITMENT"],"reads":["ENT-SELECTION-STAGE","ENT-SELECTION-PARTICIPANT","ENT-OPPORTUNITY","ENT-POSITIONING-BRIEF","ENT-CAREER-CLAIM","ENT-EVIDENCE-SNAPSHOT","ENT-INTERACTION"],"actions":["ACT-SELECTION-PREPARE","ACT-DEBRIEF-CAPTURE","ACT-OPEN-QUESTION-ADD","ACT-OPEN-QUESTION-RESOLVE","ACT-COMMITMENT-ADD","ACT-COMMITMENT-COMPLETE"],"ai_role":"prepare/extract proposals; candidate reviews material debrief updates","external_effects":[]},
        {"id":"CAP-OFFER-DECISION","name":"Offer and Decision Intelligence","domain":"outcome","purpose":"Capture offer terms and prepare decision support without autonomously accepting/declining.","owns":["ENT-OFFER","ENT-OFFER-COMPONENT","ENT-DECISION-CRITERION","ENT-DECISION-BRIEF"],"reads":["ENT-OPPORTUNITY","ENT-PURSUIT-ASSESSMENT","ENT-EVIDENCE-SNAPSHOT","ENT-SOURCE","ENT-ASSERTION"],"actions":["ACT-OFFER-CAPTURE","ACT-OFFER-REVIEW","ACT-OFFER-DECISION-PREPARE","ACT-OFFER-INTENT-ACCEPT","ACT-OFFER-INTENT-DECLINE","ACT-OFFER-CLOSE"],"state_machines":["SM-OFFER-DECISION"],"ai_role":"decision support only; candidate intent actions are explicit","external_effects":[]},
        {"id":"CAP-OUTCOME-STRATEGY","name":"Outcome and Career Strategy Learning","domain":"strategy","purpose":"Capture outcomes, produce uncertainty-aware strategy signals and run bounded strategy experiments.","owns":["ENT-OUTCOME","ENT-STRATEGY-SIGNAL","ENT-STRATEGY-HYPOTHESIS","ENT-STRATEGY-EXPERIMENT","ENT-EXPERIMENT-OBSERVATION"],"reads":["ENT-OPPORTUNITY","ENT-INTERACTION"],"actions":["ACT-OUTCOME-RECORD","ACT-STRATEGY-SIGNAL-CREATE","ACT-STRATEGY-HYPOTHESIS-CREATE","ACT-STRATEGY-EXPERIMENT-CREATE","ACT-STRATEGY-EXPERIMENT-ACTIVATE","ACT-STRATEGY-EXPERIMENT-PAUSE","ACT-STRATEGY-EXPERIMENT-COMPLETE","ACT-STRATEGY-EXPERIMENT-CANCEL"],"state_machines":["SM-STRATEGY-EXPERIMENT"],"ai_role":"identify provisional patterns with sample/context/confidence","external_effects":[]},
        {"id":"CAP-DELEGATION-CONSENT","name":"Delegation and Consent","domain":"trust","purpose":"Manage candidate-controlled delegated access and auditable consent.","owns":["ENT-DELEGATION-GRANT","ENT-CONSENT-RECORD"],"reads":["ENT-PRINCIPAL"],"actions":["ACT-DELEGATION-CREATE","ACT-DELEGATION-ACTIVATE","ACT-DELEGATION-REVOKE","ACT-DELEGATION-EXPIRE","ACT-CONSENT-RECORD"],"state_machines":["SM-DELEGATION-GRANT"],"external_effects":[]},
        {"id":"CAP-AUDIT-GOVERNANCE","name":"Policy and AI Audit","domain":"trust","purpose":"Persist auditable authorization and AI-use records without making audit logs authority sources.","owns":["ENT-POLICY-DECISION","ENT-AI-INTERACTION-RECORD"],"reads":["ENT-PRINCIPAL","ENT-EVIDENCE-SNAPSHOT"],"actions":["ACT-POLICY-DECISION-RECORD","ACT-AI-INTERACTION-RECORD"],"external_effects":[]}
    ]
    for item in new_caps:
        upsert(caps, item)

    # Expand existing capabilities with the new selection/watch semantics.
    for cap in caps:
        if cap["id"] == "CAP-SELECTION":
            cap["owns"] = ["ENT-SELECTION-PROCESS","ENT-SELECTION-STAGE","ENT-SELECTION-PARTICIPANT"]
            cap["actions"] = ["ACT-SELECTION-STATE-UPDATE","ACT-SELECTION-PROCESS-DEFINE","ACT-SELECTION-STAGE-SCHEDULE","ACT-SELECTION-STAGE-COMPLETE","ACT-SELECTION-STAGE-CANCEL"]
            cap["state_machines"] = ["SM-CANDIDATE-SELECTION","SM-SELECTION-STAGE"]
        elif cap["id"] == "CAP-MARKET-WATCH":
            cap["actions"] = ["ACT-MARKET-WATCH-CREATE","ACT-MARKET-WATCH-PAUSE","ACT-MARKET-WATCH-RESUME","ACT-MARKET-WATCH-ARCHIVE"]
            cap["state_machines"] = ["SM-MARKET-WATCH"]

    new_policies = [
        {"id":"POL-CAREER-CLAIM-ATTESTATION","effect":"guard","actions":["ACT-CAREER-CLAIM-ATTEST"],"condition":"principal is owning candidate AND explicit candidate confirmation","invariants":["AI/delegated coach cannot attest on candidate behalf","attestation does not set externally_verified"]},
        {"id":"POL-CAREER-USAGE-PERMISSION","effect":"guard","actions":["ACT-POSITIONING-COMMIT","ACT-RESUME-VARIANT-PREPARE","ACT-RESUME-VARIANT-APPROVE","ACT-EXECUTIVE-BIO-PREPARE","ACT-SELECTION-PREPARE"],"condition":"every externally wordable factual claim is permitted for requested purpose","invariants":["private_only claim cannot appear in external artifact","usage permission is independent from truth/evidence status"]},
        {"id":"POL-EVIDENCE-BINDING","effect":"guard","actions":["ACT-MANDATE-EVIDENCE-BIND"],"condition":"candidate owns evidence AND role_mandate belongs to candidate opportunity AND evidence usage permits downstream purpose","invariants":["binding does not upgrade evidence status"]},
        {"id":"POL-RESUME-NO-FABRICATION","effect":"guard","actions":["ACT-RESUME-VARIANT-PREPARE","ACT-RESUME-VARIANT-APPROVE"],"condition":"every factual resume statement resolves to candidate career claim/assertion with permitted usage","invariants":["suggested wording cannot create employer/title/scope/achievement not supported by evidence"]},
        {"id":"POL-ROLE-MANDATE-VERSIONING","effect":"guard","actions":["ACT-ROLE-MANDATE-SYNTHESIZE"],"condition":"immutable_input_snapshot AND assertion/source links preserved","invariants":["material new evidence creates a new mandate version"]},
        {"id":"POL-DEBRIEF-EXTRACTION-BOUNDARY","effect":"guard","actions":["ACT-DEBRIEF-CAPTURE"],"condition":"candidate-provided content may create observation plus proposed assertions only","invariants":["debrief cannot directly rewrite known opportunity/company facts"]},
        {"id":"POL-DELEGATION-LIFECYCLE","effect":"guard","actions":["ACT-DELEGATION-ACTIVATE","ACT-DELEGATION-REVOKE","ACT-DELEGATION-EXPIRE"],"condition":"grantor candidate owns delegation AND current delegation state permits transition","invariants":["revoked/expired grant denied immediately at authorization time"]},
        {"id":"POL-OFFER-NO-AUTONOMOUS-DECISION","effect":"guard","actions":["ACT-OFFER-INTENT-ACCEPT","ACT-OFFER-INTENT-DECLINE"],"condition":"explicit owning-candidate confirmation","invariants":["AI cannot set accept/decline intent","intent is not external response"]},
        {"id":"POL-STRATEGY-UNCERTAINTY","effect":"guard","actions":["ACT-STRATEGY-SIGNAL-CREATE"],"condition":"sample_size AND time_window AND context AND confidence present","invariants":["small samples cannot be rendered as strong deterministic prescription"]},
        {"id":"POL-ASSESSMENT-STALE-INPUT","effect":"guard","condition":"assessment/recommendation derived views compare current evidence revision to input snapshot revision","invariants":["stale assessment is flagged or superseded rather than silently treated current"]},
        {"id":"POL-MARKET-SIGNAL-NOT-OPPORTUNITY","effect":"guard","actions":["ACT-MARKET-SIGNAL-RECORD"],"condition":"signal remains distinct from Opportunity unless a separate opportunity capture action has sufficient basis","invariants":["market signal alone does not fabricate vacancy"]}
    ]
    for item in new_policies:
        upsert(policies, item)

    # Candidate policy gains the newly defined candidate-owned internal actions.
    candidate_policy = next(p for p in policies if p["id"] == "POL-CANDIDATE-OWN-DATA")
    candidate_actions = set(candidate_policy.get("actions", []))
    candidate_actions.update(a["id"] for a in new_actions if a["capability"] not in {"CAP-AUDIT-GOVERNANCE"})
    candidate_policy["actions"] = sorted(candidate_actions)

    new_ai = [
        {"id":"AIF-CAREER-EXTRACT","name":"Career Evidence Extraction","inputs":["ENT-SOURCE","ENT-OBSERVATION"],"outputs":["ENT-CAREER-CLAIM","ENT-EMPLOYMENT-EPISODE","ENT-LEADERSHIP-MANDATE","ENT-ACHIEVEMENT","ENT-SCOPE-FACT"],"may_commit":False,"human_or_server_gate":"outputs are proposals; candidate attests claims and server validates evidence semantics","eval_dimensions":["claim_faithfulness","scope_value_accuracy","provenance_preservation","no_fabrication"]},
        {"id":"AIF-MARKET-RESEARCH","name":"Market and Target Research","inputs":["ENT-COMPANY","ENT-CAREER-INTENT","ENT-SOURCE","ENT-ASSERTION"],"outputs":["ENT-OBSERVATION","ENT-ASSERTION","ENT-MARKET-SIGNAL"],"may_commit":False,"human_or_server_gate":"signals/assertions use source and assertion policies","eval_dimensions":["source_quality","freshness","signal_precision","opportunity_non_fabrication"]},
        {"id":"AIF-ROLE-MANDATE","name":"Role Mandate Synthesis","inputs":["ENT-OPPORTUNITY","ENT-EVIDENCE-SNAPSHOT","ENT-ASSERTION"],"outputs":["ENT-ROLE-MANDATE","ENT-SUCCESS-PROFILE"],"may_commit":False,"human_or_server_gate":"server commits versioned synthesis against snapshot","eval_dimensions":["mandate_grounding","success_profile_relevance","unknown_preservation","version_sensitivity"]},
        {"id":"AIF-FIT-ASSESS","name":"Fit Assessment","inputs":["ENT-OPPORTUNITY","ENT-ROLE-MANDATE","ENT-CAREER-INTENT","ENT-CAREER-CLAIM","ENT-MANDATE-EVIDENCE-BINDING","ENT-EVIDENCE-SNAPSHOT"],"outputs":["ENT-FIT-ASSESSMENT"],"may_commit":False,"human_or_server_gate":"versioned assessment action; no disposition mutation","eval_dimensions":["evidence_coverage","mandate_alignment","gap_precision","calibration"]},
        {"id":"AIF-QUALITY-ASSESS","name":"Opportunity Quality Assessment","inputs":["ENT-OPPORTUNITY","ENT-ROLE-MANDATE","ENT-ASSERTION","ENT-EVIDENCE-SNAPSHOT"],"outputs":["ENT-QUALITY-ASSESSMENT"],"may_commit":False,"human_or_server_gate":"versioned assessment action","eval_dimensions":["quality_dimension_grounding","unknown_preservation","source_sensitivity"]},
        {"id":"AIF-TRANSITION-ASSESS","name":"Transition Assessment","inputs":["ENT-OPPORTUNITY","ENT-CAREER-INTENT","ENT-CAREER-PROFILE","ENT-EVIDENCE-SNAPSHOT"],"outputs":["ENT-TRANSITION-ASSESSMENT"],"may_commit":False,"human_or_server_gate":"versioned assessment action","eval_dimensions":["trajectory_reasoning","scope_comparison","risk_grounding","uncertainty"]},
        {"id":"AIF-POSITIONING-PREPARE","name":"Executive Positioning Preparation","inputs":["ENT-ROLE-MANDATE","ENT-MANDATE-EVIDENCE-BINDING","ENT-CAREER-CLAIM","ENT-EVIDENCE-SNAPSHOT"],"outputs":["ENT-POSITIONING-BRIEF"],"may_commit":False,"human_or_server_gate":"candidate/server confirms evidence and usage permissions before canonical commit","eval_dimensions":["evidence_grounding","narrative_relevance","no_fabrication","usage_permission_compliance"]},
        {"id":"AIF-RESUME-VARIANT","name":"Resume Variant Preparation","inputs":["ENT-RESUME-MASTER","ENT-POSITIONING-BRIEF","ENT-CAREER-CLAIM","ENT-MANDATE-EVIDENCE-BINDING"],"outputs":["ENT-RESUME-VARIANT","ENT-RESUME-CHANGE"],"may_commit":False,"human_or_server_gate":"candidate reviews/approves; no external share","eval_dimensions":["claim_faithfulness","change_relevance","ATS_terminology_semantic_fidelity","no_fabrication"]},
        {"id":"AIF-SELECTION-PREPARE","name":"Selection Preparation","inputs":["ENT-SELECTION-STAGE","ENT-SELECTION-PARTICIPANT","ENT-POSITIONING-BRIEF","ENT-CAREER-CLAIM","ENT-OPEN-QUESTION","ENT-EVIDENCE-SNAPSHOT"],"outputs":["ENT-STAKEHOLDER-HYPOTHESIS","ENT-PREPARATION-BRIEF"],"may_commit":False,"human_or_server_gate":"hypotheses remain labeled; preparation is internal","eval_dimensions":["stakeholder_hypothesis_labeling","evidence_relevance","question_quality","unknown_preservation"]},
        {"id":"AIF-OFFER-DECISION","name":"Offer Decision Support","inputs":["ENT-OFFER","ENT-OFFER-COMPONENT","ENT-DECISION-CRITERION","ENT-PURSUIT-ASSESSMENT","ENT-EVIDENCE-SNAPSHOT"],"outputs":["ENT-DECISION-BRIEF"],"may_commit":False,"human_or_server_gate":"candidate decides; AI cannot set accept/decline intent","eval_dimensions":["term_faithfulness","tradeoff_completeness","uncertainty","no_autonomous_decision"]},
        {"id":"AIF-STRATEGY-ANALYZE","name":"Career Strategy Analysis","inputs":["ENT-OUTCOME","ENT-INTERACTION","ENT-OPPORTUNITY","ENT-STRATEGY-EXPERIMENT"],"outputs":["ENT-STRATEGY-SIGNAL","ENT-STRATEGY-HYPOTHESIS"],"may_commit":False,"human_or_server_gate":"signal contract requires sample/time/context/confidence","eval_dimensions":["sample_awareness","confounder_awareness","confidence_calibration","non_prescriptive_small_sample"]}
    ]
    for item in new_ai:
        upsert(ai, item)

    new_conf = [
        {"id":"CONF-CAREER-001","name":"Candidate attestation is not external verification","given":{"claim_state":"attested","evidence_status":"self_attested"},"expect":"valid_and_not_externally_verified"},
        {"id":"CONF-CAREER-002","name":"AI cannot attest career claim","given":{"principal_type":"system_service","action":"ACT-CAREER-CLAIM-ATTEST"},"expect":"deny"},
        {"id":"CONF-EVIDENCE-001","name":"Evidence binding preserves truth status","given":{"claim_evidence_status":"self_attested","action":"ACT-MANDATE-EVIDENCE-BIND"},"expect":"binding_created_claim_remains_self_attested"},
        {"id":"CONF-MARKET-001","name":"Market signal does not fabricate opportunity","given":{"market_signal":"company_expansion","separate_opportunity_basis":False},"expect":"no_opportunity_created"},
        {"id":"CONF-MANDATE-001","name":"Role mandate is versioned by snapshot","given":{"old_snapshot":"snap-1","new_material_evidence":True},"expect":"new_role_mandate_version"},
        {"id":"CONF-RESUME-001","name":"Unsupported factual resume wording denied","given":{"action":"ACT-RESUME-VARIANT-APPROVE","factual_statement_has_claim_ref":False},"expect":"deny"},
        {"id":"CONF-RESUME-002","name":"Resume approval is not share/apply","given":{"resume_variant_state":"approved"},"expect":"no_external_effect"},
        {"id":"CONF-DEBRIEF-001","name":"Debrief cannot directly write known fact","given":{"action":"ACT-DEBRIEF-CAPTURE","requested_assertion_state":"known","evidence_policy_transition":False},"expect":"proposal_only_for_assertion"},
        {"id":"CONF-DELEGATION-001","name":"Expired delegation denied immediately","given":{"delegation_state":"expired","cached_tool_visible":True},"expect":"deny"},
        {"id":"CONF-OFFER-001","name":"AI cannot set offer acceptance intent","given":{"principal_type":"system_service","action":"ACT-OFFER-INTENT-ACCEPT"},"expect":"deny"},
        {"id":"CONF-OFFER-002","name":"Intent accept is not external acceptance","given":{"offer_state":"intent_accept","external_effect_receipt":None},"expect":"no_external_acceptance_claim"},
        {"id":"CONF-STRATEGY-001","name":"Strategy signal requires sample/context/confidence","given":{"sample_size":3,"context":None,"confidence":None},"expect":"deny_or_incomplete"},
        {"id":"CONF-WATCH-001","name":"Market watch survives MCP task lifetime","given":{"mcp_task":"completed","market_watch_state":"active"},"expect":"market_watch_remains_active"}
    ]
    for item in new_conf:
        upsert(conf, item)

    save("entities/entity_registry.json", entities_doc)
    save("states/state_registry.json", states_doc)
    save("actions/action_registry.json", actions_doc)
    save("capabilities/capability_registry.json", caps_doc)
    save("policies/policy_registry.json", policies_doc)
    save("ai-functions/ai_function_registry.json", ai_doc)
    save("conformance/cases.json", conf_doc)

    print("ScopeCareer V1 semantic expansion applied")


if __name__ == "__main__":
    main()
