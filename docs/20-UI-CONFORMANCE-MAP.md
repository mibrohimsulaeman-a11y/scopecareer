# ScopeCareer — UI Conformance Map

Status: Complete for WP-0..WP-5 (121 automated checks)
Last updated: 2026-08-22

Every view-model invariant and cross-cutting principle from `contracts/v1/` maps to at least one
named smoke check in `web/tests/checks/wp*.js`. The suite is green-only: any failure blocks.

## Foundation (wp0 — 14 checks)

| Invariant / principle | Check |
|---|---|
| Contracts loadable & complete | `contractsLoaded`, `viewsRegistryReachable` |
| Raw enums never render as copy | `copyCoversDispositions`, `copyCoversSelectionStates` |
| Illegal state jumps impossible via dispatcher | `dispatcherRejectsIllegalJump` |
| Legal chains execute through machines | `dispatcherAllowsLegalChain` |
| Priority guard enforced (policy, not enum) | `priorityGuardEnforced` |
| Disposition ⊥ priority ⊥ search ⊥ selection | `dimensionsAreOrthogonal` |
| No external-effect action is runnable | `externalEffectActionsNotRunnable` |
| Components render from assertion objects | `assertionComponentRendersFromObject` |
| Compare has no winner column at kit level | `compareTableHasNoWinnerColumn` |
| Buttons bind canonical ACT ids | `actionBtnBindsCanonicalAction` |
| Ledger records canonical actions, internal-only | `eventLedgerRecordsCanonicalAction` |
| Fixtures reference valid contract states | `fixtureLintClean` |

## Core loop (wp1 — 26 checks)

Briefing = temporal ledger, not catalog (`briefing*`); segments react to disposition
(`shortlistDefault`, `savedSegmentShowsWatching`); dossier required sections present
(`dossierSection:*`); forbidden content absent (`dossierNoMetricsOrScores`, `dossierNoApplyAction`);
relationship fact ≠ route assessment (`routeFactSeparatedFromAssessment`);
Explore opens research progressively (`exploreOpensResearch`); Pursue note + gate
(`pursueNotePresent`, `pursueFromExploreWorks`); compare named trade-offs only
(`compareColumnsNoWinner`, `compareNamedDimensions`); capture untrusted-draft review gate +
confidential mode (`captureDraftNeedsReviewBadge`, `captureCommitCreatesValidOpportunity`,
`captureUntrustedContentNeverAutoCommits`); evidence binding preserves truth status
(`evidenceBinding*`); shortlist ⊥ disposition (`shortlistIndependentOfDisposition`);
responsive structure hooks (`workbenchStructureForResponsive`).

## Career domain (wp2 — 14 checks)

Four independent claim dimensions rendered (`dim:*`); attest ≠ verify explainer
(`attestNotePresent`); AI proposals visually distinct (`aiProposalDistinct`);
attest/reject through SM-CAREER-CLAIM-REVIEW with canonical logs (`attestTransitionWorks`,
`attestLogsCanonicalAction`); illegal claim jump rejected (`illegalClaimJumpRejected`);
intent persists (`intentPersists`); artifact story claims resolve (`storyClaimsResolve`);
onboarding walkable end-to-end (`onboardingProposesTwoClaims`, `onboardingLandsOnBriefing`).

## Workspace depth (wp3 — 32 checks)

Entry guard (`entryGuardBlocksNonPursuing`, `workspaceOpensWhenPursuing`); stable five-area IA
(`fiveAreaIA`); stage-aware next move (`nextMoveStageAware`); priority activate/deactivate +
policy cap as policy (`priorityActivates`, `priorityDeactivates`, `priorityPolicyCap`);
people fact vs assessment separation (`personFactVsAssessment`); positioning prepare→commit
(`briefStartsDraft`, `briefPrepareThenCommit`); resume variant lifecycle draft→reviewing→approved
with per-change accept/reject, evidence links and approve≠share
(`variant*`, `diffShowsOriginalProposedReasonEvidence`, `changeAcceptPersisted`, `approveNotShareNote`);
selection preparation with inference-labeled stakeholder hypotheses
(`participantPrepRendered`, `agendaLabeledInference`, `concernAndEvidenceShown`);
debrief epistemic commit gates, no silent rewrite (`debriefProposalsNeedResearch`,
`commitKnownFlipsStatus`, `commitInferredFlipsStatus`, `noSilentRewriteNotePresent`);
commitments/open questions (`commitmentAdded`, `commitmentCompleted`, `openQuestionAdded`);
offer decision gated flow received→under_review→decision_ready→intent, intent never external,
content absent before offer stage (`offerHiddenBeforeOfferStage`, `offerVisibleAtOfferStage`,
`offerReachesDecisionReady`, `offerIntentGatedFlow`, `intentNotExternalNote`,
`offerAbsentInPrecontact`).

## System surfaces (wp4 — 19 checks)

Signals carry sample size / window / confidence with preliminary framing and disclaimer; no
prescriptive language (`signal*`, `preliminaryFramingPresent`, `noPrescriptiveLanguage`);
experiment lifecycle via SM-STRATEGY-EXPERIMENT (`experimentStartsDraft`, `experimentActivates`,
`experimentCreated`); market is contextual only (`marketLinkContextual`, `noPermanentMarketTab`,
`marketCompaniesRender`, `marketBackToOpportunities`, `companyWatchPersists`); sensitivity
persists (`sensitivityPersists`); stealth preview transforms lock-screen copy
(`stealthPreviewDiscreet`); data rights double-confirm deletion + export simulation
(`exportSimulated`, `deleteCancellationWindow`, `deleteRequiresDoubleConfirm`); audit lists
canonical actions and effect class (`auditListsCanonicalActions`, `auditShowsInternalOnly`).

## Cross-client & resilience (wp5 — 16 checks)

Error boundary with recovery + logged render errors (`errorBoundaryCatches`,
`renderErrorLogged`, `errorRecoveryPossible`); degraded banner on web-only surfaces at mobile
widths, absent on PWA surfaces (`degradedBannerWebOnly`, `noDegradedOnPwaSurface`);
stale-evidence banner flagged vs fresh (`staleBannerWhenFlagged`, `noStaleBannerWhenFresh`);
AI-pending placeholder (`aiPendingPlaceholder`); confidence labels render
(`confidenceLabelRendered`); a11y tokens (`focusVisibleStyled`, `reducedMotionHonored`,
`sidebarMobileScrollable`, `badgesHaveAriaLabels`); PWA installability
(`manifestLinked`, `manifestInstallable`, `offlineFallbackExists`).

## Verification commands

```bash
python3 contracts/v1/validate_contracts.py   # semantic layer
python3 web/tests/run_smoke.py               # 121 UI checks, must be green
```
