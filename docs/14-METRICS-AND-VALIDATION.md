# ScopeCareer — Metrics and Validation Model

Status: Working measurement model
Last updated: 2026-08-21

## 1. North star

# Qualified Career Progression

Avoid optimizing raw applications sent.

## 2. MVP validation questions

### Better Opportunity Selection

Can ScopeCareer surface opportunities the executive regards as genuinely worthy of attention?

### Better Pursuit Decisions

Can it distinguish strong capability fit from strategically strong career move?

### Better Access

Can it produce actionable, credible routes beyond default direct apply?

### Better Executive Preparation

Can it reduce work and improve positioning/selection readiness without fabricating experience?

## 3. Discovery metrics

- opportunities surfaced;
- shortlist attention rate;
- Pass / Watch / Explore distribution;
- Explore→Pursue conversion;
- reasons for Pass;
- discovery source usefulness;
- duplicate/stale rate;
- user-rated relevance.

Do not interpret high Explore rate alone as quality; users may explore because information is incomplete.

## 4. Pursuit metrics

- Pursue rate;
- Priority Pursuit rate;
- user override/correction of recommendation;
- assessment confidence distribution;
- unknowns resolved before pursuit;
- later outcome by initial pursuit recommendation.

Long-term calibration question:

Does `Strong` pursuit correlate with qualified progression better than baseline user selection?

## 5. Access metrics

- direct vs recruiter vs referral vs network-first routes;
- warm route identified rate;
- route actually used;
- introduction success;
- recruiter response/conversation rate;
- time to meaningful conversation;
- access-plan user acceptance/correction.

## 6. Positioning/evidence metrics

- AI-proposed resume changes accepted/edited/rejected;
- fabricated-claim rate — target effectively zero;
- unsupported-claim detection;
- evidence-link completeness;
- candidate correction rate;
- time to application-ready packet;
- reuse of evidence bindings across resume/selection.

## 7. Selection metrics

- recruiter/search-consultant screen progression;
- interview progression;
- final-round progression;
- offer conversion;
- unresolved concern closure;
- debrief capture adoption;
- follow-up completion.

## 8. Strategy metrics

- role-family progression;
- geography progression;
- company-type progression;
- access-route progression;
- source progression;
- mandate-type progression;
- strategy experiment outcomes.

Every analytical signal should carry:

- sample size;
- observation window;
- source/context;
- confidence/uncertainty.

## 9. Trust/privacy metrics

- unintended external disclosure incidents;
- denied unauthorized access;
- Share Packet use/revocation;
- sensitive-field access counts;
- audit completeness;
- delegation revocation correctness;
- suspicious opportunity/recruiter reports;
- user trust/confidence feedback.

## 10. MCP metrics

- active MCP users;
- read vs mutation tool use;
- successful tool calls;
- authorization denials;
- host capability degradation frequency;
- task completion/cancel/failure;
- MCP→first-party deep link handoff;
- tool-result correction rate;
- cached-catalog policy incidents — target zero.

## 11. Interaction metrics

- time to first disposition;
- card→Explore time;
- Explore→Pursue time;
- accidental disposition undo;
- Daily Shortlist review rate;
- Priority slot churn;
- deep-work session duration;
- mobile/PWA vs desktop task distribution.

Avoid optimizing swipe volume or daily-open streaks if they conflict with high-quality decision-making.

## 12. User-research validation

Before full implementation, test prototypes with initial ICP.

Key questions:

- Does `Pass / Watch / Explore / Pursue` match actual mental models?
- Is Pursuit more useful than a Match Score?
- Is Access Plan valuable enough to change behavior?
- Does evidence binding feel trustworthy or burdensome?
- Are confidential opportunities represented naturally?
- Which parts should be done in ChatGPT/Claude via MCP versus first-party UI?
- What data will users refuse to connect/store?
- Does Daily Shortlist reduce cognitive load?

## 13. Go/no-go signals

V1 should not be considered validated simply because all screens exist.

Evidence of category validation should include:

- users repeatedly return before applications are due, for intelligence/decision support;
- users pursue fewer but higher-conviction opportunities;
- Access Intelligence changes route choice in meaningful cases;
- evidence-grounded positioning materially reduces preparation effort;
- Candidate MCP is used for real reasoning workflows, not demo novelty;
- trust/privacy controls are understandable;
- progression/outcome data can feed useful strategy learning without false certainty.
