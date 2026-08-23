# ScopeCareer — Web UI Reference Implementation

Status: Complete through WP-5 (all candidate-facing surfaces implemented)
Last updated: 2026-08-22

## What this is

The complete candidate-facing V1 UI as a fixture-driven, zero-dependency front-end that
projects `contracts/v1/` semantics into interface. It is the reference implementation for a
future production stack — semantics live in contracts, never in these files.

## Run

```bash
cd Documents/KnowledgeHub/ScopeCareer
python3 web/tests/run_smoke.py     # full suite (must be green)
python3 -m http.server 8800        # then open http://127.0.0.1:8800/web/
```

Self-check URL: `/web/?selfcheck=1` (writes `docs/validation/web_smoke_report.json`).
Probe URL without selfcheck: `/web/`.

## Screen inventory (route → view model)

| Route | View model / journey | Clients |
|---|---|---|
| `#/briefing` | VM-HOME-ATTENTION | web, pwa |
| `#/opportunities` (+ segments) | VM-DAILY-SHORTLIST, VM-OPPORTUNITY-CARD | web, pwa |
| `#/opportunities/:id` | VM-OPPORTUNITY-INTELLIGENCE | web, pwa |
| `#/opportunities/compare?ids=` | VM-OPPORTUNITY-COMPARE | web |
| `#/opportunities/capture` | JRN-BROWSER-CAPTURE (manual + extension-mock) | web, pwa |
| `#/workspace/:id/{brief·people·positioning·process·record}` | VM-OPPORTUNITY-WORKSPACE (+ resume diff, selection prep, debrief, offer decision, priority) | web (`?stage=` override for research) |
| `#/career`, `#/career/evidence`, `#/career/intent`, `#/career/artifacts` | VM-CAREER-EVIDENCE-REVIEW + intent/artifacts | web (hub+intent pwa) |
| `#/onboarding?step=` | JRN-CAREER-EVIDENCE-ONBOARDING | web, pwa |
| `#/strategy` | VM-STRATEGY-INTELLIGENCE | web |
| `#/settings{,/privacy,/audit,/data}` | Data Vault admin, audit, data summary | web |
| `#/market` | Market contextual mode (no permanent tab) | web, pwa |

## Architecture seams (frozen interfaces)

- `js/core/contracts.js` — fetches registries from `/contracts/v1/*.json`; transition lookup.
- `js/core/store.js` — orthogonal state dimensions per entity; event ledger
  (`window.__scopeCareerValidationLog`).
- `js/core/actions.js` — single dispatcher: validates every mutation against contract state
  machines and registered guards; logs `canonical_action` with `external_effect:false`.
- `js/core/copy.js` — canonical enums → candidate language (raw enums must never render).
- `js/ui/components.js` — assertion/provenance component kit (epistemic badges carry ARIA labels).
- `js/router.js` — path+query params merged; error boundary (`[data-error-state]`);
  degraded-mode banner for web-only routes at ≤760px.

## State coverage

Empty states on all lists · AI-pending placeholder for un-researched captures · stale-evidence
banner on flagged dossiers · degraded banner (mobile × desktop-only views) · render error card
with recovery · confidence always rendered as label, never pseudo-precise score.

## PWA

`manifest.webmanifest` (standalone, SVG icon), `sw.js` (navigation offline fallback to
`offline.html`). Decoration only — failure paths are guarded no-ops.

## Known gaps / deferred

- MCP App card renderer (stretch item, post-validation).
- Real capture extension (popup flow is mocked in-app).
- Production auth (onboarding sign-in is explicitly simulated).
- Mobile layouts are responsive-web only; native companions remain post-validation.
