# ScopeCareer — Product Concept v2.1

Status: Canonical product direction
Last updated: 2026-08-21

## 1. Product definition

ScopeCareer is an **Executive Career Intelligence Platform** for senior leaders and executives.

It helps a user understand:

- who they are as an executive, based on structured evidence;
- which leadership mandates they are strongest for;
- which companies and markets deserve attention;
- which opportunities are worth pursuing;
- how to gain access to those opportunities;
- how to position their evidence accurately;
- how to navigate a multi-stakeholder selection process;
- how an offer affects career trajectory;
- how outcomes should update future strategy.

It is not primarily a job board, resume generator, application tracker, match-score engine, interview-question generator, or mass-application bot.

## 2. Category thesis

The nucleus is:

`Career Evidence + Market Intelligence + Opportunity Intelligence + Pursuit Intelligence + Access Intelligence`

For conventional job search, the common funnel is:

`Find → Match → Tailor → Apply → Interview`

For executive careers, the product model must support:

`Career Intelligence`
→ `Market / Target Intelligence`
→ `Opportunity Discovery`
→ `Opportunity Quality`
→ `Fit + Pursuit Intelligence`
→ `Access Intelligence`
→ `Opportunity Workspace`
→ `Selection Process Intelligence`
→ `Offer / Outcome`
→ `Career Strategy Learning`

Published vacancies are only one opportunity source. Other sources can include retained search, recruiter outreach, network conversations, confidential mandates, leadership changes, succession signals, expansion, funding/M&A, transformation, and candidate-led research.

## 3. Initial market wedge

Initial ICP:

**Director, VP, and C-level technology, digital, transformation, and operations leaders targeting India, APAC, and international opportunities.**

Initial role examples:

- CTO / CIO / CDO / COO;
- VP Engineering / VP Technology;
- Head of Engineering / Head of Digital;
- Technology Director / Transformation Director / Operations Director;
- enterprise, platform, transformation, and technology-strategy leadership roles.

Reason for wedge: executive search semantics differ materially across CFO, CTO, CHRO, commercial, general-management, and board markets. V1 should build depth before horizontal expansion.

## 4. Core product lifecycle

```text
Career Evidence Graph
        ↓
Career Intent
        ↓
Market Intelligence
        ↓
Opportunity Discovery
        ↓
Opportunity Intelligence
        ↓
Pursuit Intelligence
   ┌────┼─────┐
   Fit Quality Access
   └────┼─────┘
        ↓
Candidate Decision
        ↓
Opportunity Workspace
        ↓
Positioning + Relationships + Research
        ↓
Selection Process
        ↓
Offer / Outcome
        ↓
Career Strategy Learning
```

## 5. Career Evidence Graph

The candidate profile is not a structured CV. It is a graph of career claims and context.

Key areas:

- employment history;
- leadership mandates;
- transformation programs;
- achievements;
- business scale;
- P&L / budget scope;
- organisation scale;
- geographic scope;
- board / executive exposure;
- stakeholder relationships;
- business models;
- company stages;
- growth / turnaround / restructuring / integration experience;
- decision examples;
- career transitions;
- education and credentials;
- skills and domain knowledge.

Example evidence bundle:

```text
Leadership Mandate: Post-merger technology consolidation
Context: 12 business units, 3 countries
Scope: operating budget, organisation, stakeholder set
Outcome: measurable consolidation result
Stakeholders: CEO, CFO, BU presidents
Evidence: resume claim + linked report + candidate attestation
```

## 6. Career claim dimensions

A career claim has independent dimensions.

### Provenance

- Resume
- User Input
- Linked Document
- Public Source
- Imported System
- AI Extraction

### Evidence status

- Self-Attested
- Source-Backed
- Corroborated
- Externally Verified

### Interpretation

- Fact
- Inference
- Suggested Wording

### Usage permission

- Private Only
- Approved for Resume
- Approved for Executive Bio
- Approved for Interview
- Approved for Recruiter Sharing
- Approved for External Sharing

**Invariant:** candidate approval changes usage permission/attestation; it does not magically convert a claim into external verification.

## 7. Career Intent

Career Intent must represent trajectory, not only titles.

Include:

- target role families;
- target seniority;
- desired leadership mandates;
- industries and adjacent industries;
- company type / ownership / stage;
- geographies;
- compensation expectations and floor;
- relocation/travel/work-model preferences;
- desired step-up/lateral/transition pattern;
- board exposure objective;
- career constraints;
- explicit avoidance criteria.

## 8. Market Intelligence

The system should help users identify where opportunity may emerge before a vacancy exists.

Core concepts:

- Target Company Watchlist;
- target-role landscape;
- leadership changes;
- organisational restructuring;
- geographic expansion;
- funding/M&A;
- strategic transformation;
- major platform/technology initiatives;
- relevant executive-search firms and consultants.

Signals are hypotheses, not automatic job opportunities.

## 9. Executive Opportunity Model

An opportunity may be public, recruiter-led, confidential, network-sourced, or manually created.

It can exist without a public URL or JD.

Key fields:

- Role
- Company
- Source
- Recruiter / Search Firm
- Confidentiality
- Role Mandate
- Reporting Line
- Team / Organisation Scope
- Business Scope
- P&L / Budget Scope
- Geographic Scope
- Ownership Model
- Company Stage
- Why Role Exists
- Success Profile
- Leadership Expectations
- Compensation
- Search Stage
- Access Routes
- Evidence / Confidence

Information state:

- Known
- Inferred
- Unknown
- Needs Research

## 10. Fit Intelligence

Do not default to a single candidate-facing pseudo-precise `86% fit`.

Prefer dimensions such as:

- Eligibility: Pass / Blocked
- Evidence Coverage
- Mandate Fit
- Leadership Scope Fit
- Functional Fit
- Industry Fit
- Scale Fit
- Geographic Fit
- Career Intent Fit
- Assessment Confidence

Numeric scores may exist internally for ranking/retrieval if calibrated, but the product-facing surface should foreground evidence and uncertainty.

## 11. Opportunity Quality

High fit does not imply a good opportunity.

Quality dimensions may include:

- mandate clarity;
- strategic relevance;
- leadership sponsorship;
- reporting-line quality;
- role authority;
- organisational scope;
- compensation credibility;
- employer/company trajectory;
- source quality;
- search freshness;
- mandate feasibility.

Unknown data remains unknown.

## 12. Transition Intelligence

Assess how an opportunity affects trajectory.

Possible classifications:

- Significant Step-Up
- Step-Up
- Strategic Lateral
- Lateral
- Domain Transition
- Geographic Expansion
- Stretch
- Potential Down-Level
- Career Risk

Evaluate scope, authority, market value, learning, leadership visibility, future optionality, compensation, and strategic relevance.

## 13. Pursuit Intelligence

Fit asks: **Can this candidate perform this role?**

Pursuit asks: **Should this opportunity consume limited time, reputation, and network capital?**

Conceptual model:

`Candidate Fit + Career Intent + Role Mandate + Company/Opportunity Quality + Access Strength + Transition Value - Career/Company Risk → Pursuit Recommendation`

Default candidate-facing output:

- Recommendation: Strong / Worth Exploring / Watch / Pass;
- reasons for;
- concerns;
- open questions;
- confidence;
- evidence sources.

## 14. Access Intelligence

Access is a signature capability.

Possible routes:

- Direct Apply
- Recruiter First
- Search Consultant
- Warm Referral
- Internal Introduction
- Network First
- Executive Outreach
- Watch
- Pass

The product should answer not only "where is the job?" but "what is the strongest route into this opportunity?"

## 15. Recruiter and Relationship Intelligence Lite

V1 candidate side should represent:

- Person
- Relationship
- Company
- Search Firm
- Recruiter / Consultant
- Interaction
- Introduction
- Referral
- Opportunity

This is not a social network replacement. The goal is career-access context.

## 16. Executive Positioning

Positioning is broader than resume tailoring.

Artifacts:

- Executive Narrative
- Opportunity Positioning Brief
- Executive Resume Variant
- Executive Bio
- Leadership Story Library

All factual output must be grounded in permitted career claims.

## 17. Selection Process Intelligence

Replace a narrow interview-question module with a selection-process model.

Possible stages:

`Search Consultant → Hiring Executive → Functional Peers → CHRO/Assessment → CEO → Board/Committee → Case/Presentation → References → Offer`

Each stakeholder can carry:

- agenda;
- influence;
- known concerns;
- previous conversation;
- candidate evidence to demonstrate;
- open questions;
- follow-up commitments.

Post-call/interview debrief must be able to update the opportunity hypothesis after user review.

## 18. Offer and decision intelligence

Offer capture is core V1, even if advanced compensation benchmarking/negotiation is later.

Capture:

- base;
- bonus;
- equity;
- sign-on;
- benefits;
- title;
- reporting line;
- scope;
- location;
- start date;
- conditions.

Decision dimensions include mandate, authority, leadership team, trajectory, compensation, risk, lifestyle, geography, and future optionality.

## 19. Career Strategy Intelligence

The platform should learn from:

`Target → Opportunity → Access Route → Positioning → Selection Process → Outcome`

Analytics must include sample size, time period, source/context, and confidence. Do not turn a three-observation pattern into a career prescription.

The system should support explicit strategy experiments across role family, geography, mandate, access route, and positioning.

## 20. Human decision model

`AI discovers → researches → structures evidence → assesses → recommends → candidate reviews → candidate decides → system assists execution`

Human approval is required for material external actions, including external resume sharing, outreach, referral request, application submission, and confidential data sharing.

## 21. Category differentiation

Commodity envelope:

`Search + Resume + Match + Apply + Track + Interview`

ScopeCareer differentiation:

`Career Evidence + Market Understanding + Role Mandate + Opportunity Quality + Career Trajectory + Pursuit Decision + Access Strategy + Executive Positioning + Selection Strategy + Career Learning`

## 22. Product moat hypothesis

Long-term defensibility can compound through:

1. Career Evidence Graph
2. Mandate Graph
3. Opportunity Graph
4. Relationship / Access Graph
5. Outcome Graph

The moat is longitudinal, permissioned, candidate-specific intelligence, not agent count.

## 23. North-star outcome

**Qualified Career Progression**

The product should not optimize number of applications.

## 24. Positioning

Long form:

> An executive career intelligence system that helps senior leaders understand the market, identify the right opportunities, determine whether they are worth pursuing, find the strongest route in, position their leadership evidence accurately, and navigate each opportunity from first signal to final decision.

Short form:

> **Know where to play. Know what to pursue. Know how to get in.**

## 25. End-state usage

The product should remain useful before, during, and after an active career transition by maintaining evidence, intent, target companies, recruiter/search-firm relationships, market signals, and career strategy.
