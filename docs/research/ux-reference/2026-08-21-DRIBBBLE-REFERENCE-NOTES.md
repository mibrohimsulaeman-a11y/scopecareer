# ScopeCareer UX Reference Notes — 2026-08-21

Status: reference research, not product authority

## Research question

Which visual and interaction patterns are useful for an executive career-intelligence workspace without collapsing ScopeCareer into a generic AI job dashboard, ATS, or card-heavy SaaS interface?

## References retained

### Ghiyaats Muhammad — Job Listing Dashboard · Job Details & Talent List

- Discovery: https://dribbble.com/search/job-listing-dashboard
- Useful pattern: master list with persistent selected-item detail.
- ScopeCareer adaptation: opportunity rows on the left, decision inspector on the right.
- Do not copy: recruiter/admin framing, orange styling, ATS mechanics.

### Ronas IT — CRM Dashboard Web UI Design

- https://dribbble.com/shots/25790893-CRM-Dashboard-Web-UI-Design
- Useful pattern: prolonged-use neutral data workspace and detailed table/list as the primary surface.
- ScopeCareer adaptation: high information density without card proliferation; hairline separators and readable rows.

### Stephanie Howden — Financial Portfolio Management Dashboard UI

- https://dribbble.com/shots/27011894-Financial-Portfolio-Management-Dashboard-UI
- Useful pattern: high-density information with layered navigation and progressive detail for daily professional use.
- ScopeCareer adaptation: opportunity as a decision thesis with evidence, risks, unknowns and route; deeper detail remains accessible without dominating the first scan.

### Outcrowd — Investment Dashboard

- https://dribbble.com/shots/26847991-Investment-Dashboard
- Useful pattern: strong hierarchy and selective emphasis for complex decision signals.
- ScopeCareer adaptation: one meaningful accent, strong selection state, contextual actions; avoid turning every signal into a widget.

### Outcrowd — Sync CRM

- https://dribbble.com/shots/21591023-SYNC-Branding-design-for-the-CRM-company
- Useful pattern: structured, restrained CRM language and limited accent usage.
- ScopeCareer adaptation: calm operational workspace rather than decorative AI surface.

## References rejected as primary direction

Generic AI job dashboard / ATS patterns are rejected as the visual target when they rely on:

- match percentages as the main explanation;
- card galleries;
- Apply-first mechanics;
- KPI tiles and bento grids;
- decorative AI badges;
- multiple pastel status pills;
- dashboard summaries that duplicate the actual opportunity workspace.

## Derived ScopeCareer interaction grammar

### Briefing

A temporal action queue. It contains events or work that needs attention now, not a miniature opportunity catalog.

Examples:

- role scope changed;
- recruiter call due;
- new contradictory evidence;
- follow-up due;
- selection preparation due.

### Opportunities

The durable opportunity universe.

Desktop pattern:

`filter / collection -> scannable rows -> persistent decision inspector`

Shortlist is a pinned collection, not a lifecycle state.

### Opportunity detail

Present a structured argument rather than a generic AI summary:

- Case for
- Watch
- Route in
- Sources
- Research notes, progressively disclosed

### Comparison

Comparison is explicit and user-invoked. It compares named dimensions such as trajectory, mandate/scope, access route, biggest unknown and source context. It does not produce an automatic winner score.

### CTA

Surface labels describe the next job to be done while canonical actions remain stable behind the UI.

Examples:

- `Research unknowns` -> canonical Explore
- `Prepare for call` -> canonical Explore / preparation path
- `Start pursuing` -> canonical Pursue
- `Open workspace` -> continuation after Pursue

## Visual direction

- dense but calm;
- editorial typography for role/thesis, utility typography for operational data;
- rows and separators over card boxes;
- one accent color with semantic purpose;
- no decorative gradients or AI-purple styling;
- no giant marketing hero inside the product;
- source/evidence recency visible near the decision;
- mobile may stack list and inspector for this disposable prototype, but native/PWA validation should eventually test dedicated detail navigation rather than blindly shrinking desktop.
