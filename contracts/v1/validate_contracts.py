#!/usr/bin/env python3
import json
from pathlib import Path
import sys

from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parent


def load(rel):
    with (ROOT / rel).open("r", encoding="utf-8") as f:
        return json.load(f)


def ids(items):
    vals = [x["id"] for x in items]
    if len(vals) != len(set(vals)):
        dup = sorted({x for x in vals if vals.count(x) > 1})
        raise AssertionError(f"duplicate ids: {dup}")
    return set(vals)


def main():
    vocab = load("vocabulary.json")
    entities_doc = load("entities/entity_registry.json")
    states_doc = load("states/state_registry.json")
    actions_doc = load("actions/action_registry.json")
    caps_doc = load("capabilities/capability_registry.json")
    policies_doc = load("policies/policy_registry.json")
    clients_doc = load("clients/client_registry.json")
    ai_doc = load("ai-functions/ai_function_registry.json")
    ai_eval_doc = load("ai-functions/eval_cases.json")
    mcp_doc = load("mcp/candidate_tools.json")
    mcp_schema_doc = load("mcp/candidate_schema_registry.json")
    mcp_resources_doc = load("mcp/candidate_resources.json")
    views_doc = load("views/view_model_registry.json")
    journeys_doc = load("journeys/journey_registry.json")
    conf_doc = load("conformance/cases.json")

    entities = entities_doc["entities"]
    states = states_doc["state_machines"]
    actions = actions_doc["actions"]
    caps = caps_doc["capabilities"]
    policies = policies_doc["policies"]
    clients = clients_doc["clients"]
    ai_functions = ai_doc["functions"]
    ai_eval_cases = ai_eval_doc["cases"]
    tools = mcp_doc["tools"]
    resources = mcp_resources_doc["resources"]
    views = views_doc["views"]
    journeys = journeys_doc["journeys"]
    conformance = conf_doc["cases"]

    entity_ids = ids(entities)
    state_ids = ids(states)
    action_ids = ids(actions)
    cap_ids = ids(caps)
    policy_ids = ids(policies)
    client_ids = ids(clients)
    ai_ids = ids(ai_functions)
    ai_eval_ids = ids(ai_eval_cases)
    resource_ids = ids(resources)
    view_ids = ids(views)
    journey_ids = ids(journeys)
    conf_ids = ids(conformance)

    action_by_id = {x["id"]: x for x in actions}
    cap_by_id = {x["id"]: x for x in caps}
    entity_by_id = {x["id"]: x for x in entities}

    # Entity references and anti-collapse invariants.
    for e in entities:
        if "extends" in e:
            assert e["extends"] in entity_ids, (e["id"], e["extends"])
        if "state_machine" in e:
            assert e["state_machine"] in state_ids, (e["id"], e["state_machine"])
        for sm in e.get("state_machines", []):
            assert sm in state_ids, (e["id"], sm)

    opportunity = entity_by_id["ENT-OPPORTUNITY"]
    assert "status" not in opportunity.get("fields", []), "Generic Opportunity.status is prohibited"
    assert set(opportunity["state_machines"]) >= {
        "SM-CANDIDATE-DISPOSITION",
        "SM-PRIORITY-ALLOCATION",
        "SM-OPPORTUNITY-SEARCH",
        "SM-CANDIDATE-SELECTION",
    }
    relationship = entity_by_id["ENT-RELATIONSHIP"]
    assert "strength" not in relationship.get("fields", [])
    assert "confidence" not in relationship.get("fields", [])
    assert "input_snapshot_ref" in entity_by_id["ENT-ROLE-MANDATE"].get("fields", [])
    assert entity_by_id["ENT-RESUME-VARIANT"].get("state_machine") == "SM-RESUME-VARIANT"
    assert entity_by_id["ENT-DELEGATION-GRANT"].get("state_machine") == "SM-DELEGATION-GRANT"

    # State machines and transition/action write consistency.
    for sm in states:
        assert sm["entity"] in entity_ids, (sm["id"], sm["entity"])
        state_set = set(sm["states"])
        for tr in sm.get("transitions", []):
            assert tr["from"] in state_set, (sm["id"], tr)
            assert tr["to"] in state_set, (sm["id"], tr)
            assert tr["action"] in action_ids, (sm["id"], tr["action"])
            action = action_by_id[tr["action"]]
            assert sm["entity"] in action.get("writes", []), (
                f"{tr['action']} transitions {sm['id']} but does not write {sm['entity']}"
            )
        for other in sm.get("orthogonal_to", []):
            assert other in state_ids, (sm["id"], other)

    disposition = next(x for x in states if x["id"] == "SM-CANDIDATE-DISPOSITION")
    assert "priority" not in disposition["states"]
    priority = next(x for x in states if x["id"] == "SM-PRIORITY-ALLOCATION")
    assert set(priority["states"]) == {"inactive", "active"}
    offer_sm = next(x for x in states if x["id"] == "SM-OFFER-DECISION")
    assert "accepted" not in offer_sm["states"] and "declined" not in offer_sm["states"]

    # Actions and capability ownership.
    allowed_effects = set(vocab["enums"]["effect_class"])
    for action in actions:
        assert action["capability"] in cap_ids, (action["id"], action["capability"])
        assert action["effect_class"] in allowed_effects, action["id"]
        for ref in action.get("reads", []) + action.get("writes", []) + action.get("proposes", []):
            assert ref in entity_ids, (action["id"], ref)
        assert action["id"] in cap_by_id[action["capability"]].get("actions", []), (
            f"Action {action['id']} not declared by capability {action['capability']}"
        )
        if action["effect_class"] == "external_effect":
            assert action["approval_class"] in {"explicit_user_confirmation", "step_up"}

    for cap in caps:
        for ref in cap.get("owns", []) + cap.get("reads", []) + cap.get("projects", []):
            assert ref in entity_ids, (cap["id"], ref)
        for act in cap.get("actions", []):
            assert act in action_ids, (cap["id"], act)
            assert action_by_id[act]["capability"] == cap["id"]
        for sm in cap.get("state_machines", []):
            assert sm in state_ids, (cap["id"], sm)
        for act in cap.get("external_effects", []):
            assert act in action_ids
            assert action_by_id[act]["effect_class"] == "external_effect"

    # Policy references and governance coverage.
    for policy in policies:
        for act in policy.get("actions", []) + policy.get("forbidden_actions", []):
            assert act in action_ids, (policy["id"], act)
    required_policy_ids = {
        "POL-ASSERTION-KNOWN-EVIDENCE",
        "POL-ASSESSMENT-VERSIONING",
        "POL-CAREER-CLAIM-ATTESTATION",
        "POL-CAREER-USAGE-PERMISSION",
        "POL-RESUME-NO-FABRICATION",
        "POL-DELEGATION-LIFECYCLE",
        "POL-OFFER-NO-AUTONOMOUS-DECISION",
        "POL-OPPORTUNITY-TRUST-NO-FALSE-CERTAINTY",
        "POL-EXTENSION-UNTRUSTED-CONTENT",
        "POL-MCP-REAUTHORIZE-EVERY-CALL",
    }
    assert required_policy_ids <= policy_ids, sorted(required_policy_ids - policy_ids)

    extension = next(x for x in clients if x["id"] == "CLI-BROWSER-EXTENSION")
    assert extension["untrusted_content_ingestion"] is True
    assert "external_effect_from_page_content" in extension["forbidden"]

    # AI functions remain bounded and do not self-commit canonical mutations.
    for fn in ai_functions:
        for ref in fn.get("inputs", []) + fn.get("outputs", []):
            assert ref in entity_ids, (fn["id"], ref)
        assert fn.get("may_commit") is False, f"AI function unexpectedly self-commits: {fn['id']}"

    # Exact Candidate MCP tool schemas.
    tool_names = set()
    for tool in tools:
        assert tool["name"] not in tool_names, tool["name"]
        tool_names.add(tool["name"])
        for act in tool.get("canonical_actions", []):
            assert act in action_ids, (tool["name"], act)
        sm = tool.get("output_contract", {}).get("state_machine")
        if sm:
            assert sm in state_ids, (tool["name"], sm)
        assert tool.get("input_schema_ref")
        assert tool.get("output_schema_ref")

    assert "opportunity.update_state" not in tool_names
    assert {
        "opportunity.set_disposition",
        "selection.update_state",
        "opportunity.set_priority",
        "career.bind_evidence",
    } <= tool_names

    schema_names = set(mcp_schema_doc["tools"].keys())
    assert schema_names == tool_names, (
        f"MCP schema/tool mismatch missing_schema={sorted(tool_names-schema_names)} "
        f"extra_schema={sorted(schema_names-tool_names)}"
    )
    for name, spec in mcp_schema_doc["tools"].items():
        assert spec["input_schema"].get("type") == "object", name
        assert spec["output_schema"].get("type") == "object", name
        Draft202012Validator.check_schema(spec["input_schema"])
        Draft202012Validator.check_schema(spec["output_schema"])

    # Candidate resources are private bounded projections, never authority.
    assert resource_ids
    for resource in resources:
        assert resource["uri_template"], resource["id"]
        assert resource["cache_scope"].startswith("principal_private"), resource["id"]
        for ref in resource.get("entity_refs", []):
            assert ref in entity_ids, (resource["id"], ref)
        for ref in resource.get("policy_refs", []):
            assert ref in policy_ids, (resource["id"], ref)
        Draft202012Validator.check_schema(resource["output_schema"])

    # View models are projections over canonical semantics.
    for view in views:
        for ref in view.get("reads", []):
            assert ref in entity_ids, (view["id"], ref)
        for act in view.get("actions", []):
            assert act in action_ids, (view["id"], act)
        for client in view.get("clients", []):
            assert client in client_ids, (view["id"], client)

    # AI evaluation cases bind to functions and semantic inputs.
    for case in ai_eval_cases:
        assert case["ai_function"] in ai_ids, (case["id"], case["ai_function"])
        for ref in case.get("input_refs", []):
            assert ref in entity_ids, (case["id"], ref)
        assert case.get("expected"), case["id"]

    # Journey references are canonical.
    for journey in journeys:
        for ref in (
            journey.get("reads", [])
            + journey.get("writes", [])
            + journey.get("semantic_chain", [])
            + journey.get("flow", [])
        ):
            assert ref in entity_ids, (journey["id"], ref)
        for act in journey.get("allowed_user_actions", []):
            assert act in action_ids, (journey["id"], act)
        if "exit_action" in journey:
            assert journey["exit_action"] in action_ids
        if "client" in journey:
            assert journey["client"] in client_ids

    required_conf = {
        "CONF-STATE-001",
        "CONF-ASSERT-001",
        "CONF-ASSESS-001",
        "CONF-ACCESS-001",
        "CONF-CLIENT-001",
        "CONF-CAREER-001",
        "CONF-MARKET-001",
        "CONF-RESUME-001",
        "CONF-DEBRIEF-001",
        "CONF-DELEGATION-001",
        "CONF-OFFER-001",
        "CONF-STRATEGY-001",
        "CONF-PURSUIT-001",
        "CONF-TRUST-001",
    }
    assert required_conf <= conf_ids, sorted(required_conf - conf_ids)

    assert vocab["enums"]["effect_class"] == [
        "read",
        "internal_proposal",
        "internal_mutation",
        "external_effect",
    ]

    print("ScopeCareer contracts v1: VALID")
    print(
        f"entities={len(entity_ids)} states={len(state_ids)} actions={len(action_ids)} "
        f"capabilities={len(cap_ids)} policies={len(policy_ids)} clients={len(client_ids)} "
        f"ai_functions={len(ai_ids)} ai_eval_cases={len(ai_eval_ids)} "
        f"mcp_tools={len(tool_names)} mcp_resources={len(resource_ids)} views={len(view_ids)} "
        f"journeys={len(journey_ids)} conformance_cases={len(conf_ids)}"
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ScopeCareer contracts v1: INVALID: {exc}", file=sys.stderr)
        raise
