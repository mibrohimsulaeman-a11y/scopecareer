# Master Implementation Program — Planning Layer Execution Plan

Repo: `/home/baim/Documents/KnowledgeHub/ScopeCareer` · Branch: `main` (belum ada commit)

## Goal

Menjadikan eksekusi menuju production GA terkendali oleh **execution authority** baru:
P0 repository baseline + seluruh planning layer (docs 21–29, registries machine-readable
`implementation/`, validator program, kit operasional PV-1) — TANPA memilih stack produksi
sebelum PV-1 selesai (keputusan terkunci, docs/00-README + doc 11).

Bahasa dokumen baru: **English** (konvensi repo seluruhnya English).

## Keputusan desain yang mengikat pelaksana

1. **Planning ≠ stack lock.** Semua pilihan framework/vendor/DB/orkestrasi ditunda ke GATE-P3.
2. **Microservices = candidate reference architecture, bukan ratifikasi.**
   Doc 23 mendokumentasikan gaya microservices sebagai kandidat utama + **peta dekomposisi
   layanan turunan dari domain kontrak** (`contracts/v1`): Identity & Tenancy, Career Data
   Vault, Evidence/Assertion, Opportunity Intelligence, Pursuit Workspace,
   Access/Relationships, Market Intelligence, AI Orchestration, Ingestion/Capture Gateway,
   Audit/Observability. Status: `candidate`, diratifikasi di GATE-P3 pasca-PV-1
   (ADR-0002, `status: candidate`). Guardrail anti-distributed-monolith wajib ada.
3. **Business truth tidak boleh di UI/schema/handler MCP/prompt/adapter.** UI hanya punya
   ephemeral presentation state; ViewModel pattern: `data, epistemicLabels, warnings,
   availableActions[], disabledActions[], permissions, freshness`.
4. Anti-duplikasi struktural: satu definisi kanonik → generated/runtime schema, server
   validation, MCP schemas, client types, fixtures. Reuse semantics, bukan reuse UI paksa.
5. Abstraksi baru butuh ≥2 concrete use-case. Feature flag wajib metadata
   `{owner, created_at, purpose, removal_condition, review_date}`.
6. Fakta standar (terverifikasi, jangan salah tulis di dokumen):
   - WCAG 2.2 adalah W3C Recommendation; target AA.
   - NIST SSDF **v1.1 (SP 800-218) FINAL** (2022-02); **SSDF v1.2 (SP 800-218r1) masih
     draft IPD** (2025-12-17) — track, jangan diklaim final; **SP 800-218A** (SSDF Community
     Profile untuk GenAI/dual-use models) **FINAL** (2024-07) — dipakai untuk lane AI.
7. `web/` = behavioral + semantic reference, BUKAN port target mentah.
8. Talent (P17) = program terpisah, trust-plane terpisah, tidak menyatu ke backend Candidate.
9. Dependency graph > calendar. Tidak ada jadwal mingguan.
10. Doc 23 memuat **longlist kandidat teknologi konkret + kriteria skoring tertimbang**
    (konfirmasi user) — nama teknologi hanya kandidat; seleksi tetap di GATE-P3.
11. Repo policy: trunk-based dengan branch pendek per WP, Conventional Commits, main
    dilindungi begitu eksekusi multi-aktor dimulai (ditulis di doc 28/29).

## Tugas (urut)

### 1. P0a — Baseline commit apa adanya
- Pastikan `.gitignore` menutup artefak (`__pycache__/`, `*.pyc`, screenshots, artifacts — sudah ada).
- Hapus `web/tests/__pycache__/` dari disk (opsional, hygiene).
- Commit 1 (snapshot bukti gate hijau): seluruh tree saat ini, pesan mis.:
  `baseline: semantic contracts frozen + WP-0..6 complete + PV-1 prototype gate passed`.
- Jangan ubah isi file apa pun sebelum commit ini.

### 2. Author docs 21–29 (mengikuti pola header `Status:`/`Last updated:` docs lain)
- **21-IMPLEMENTATION-MASTER-PROGRAM.md** — execution authority. Diagram rantai
  PRODUCT TRUTH → IMPLEMENTATION CONTRACTS → Domain/Policy/Application → Infrastructure →
  Clients(UI=projection). Tabel fase P0–P17 (tujuan, exit gate, deps) persis definisi user;
  prinsip horizontal gates; hubungan ke dokumen lama: **doc 13 menjadi catatan historis,
  doc 21 otoritas planning maju**; change control merujuk kebijakan doc 11 §7.
- **22-ENGINEERING-INVARIANTS-AND-QUALITY-GATES.md** — 17 invariant constitution
  (`INV-01..17`: business logic tunggal, state machine wajib, AuthZ server-side tiap mutasi,
  draft≠external effect, UI bukan authority, AI tanpa commit authority, provenance+
  epistemic tak boleh hilang, larang duplikasi enum/policy/action, dead-code policy,
  deny-by-default least privilege, purpose/sensitivity scoping, perf regression budgets,
  WCAG 2.2 AA, failure mode diuji, observability tiap material operation, migration+rollback
  wajib, no-green-by-mock). Enforcement tier per invariant:
  `automated_now | automated_later | process`. `automated_now` hari ini = contract
  validator, program validator (+`--scan-clients`), session/pipeline validator, web smoke
  121 checks; sisanya jadi `process`/`automated_later` hingga P4+. Uniform DoD 16 butir
  (contract satisfied,
  invariants, no new semantics, security review, privacy classification, tests, conformance,
  no duplicate logic, no orphan/dead code, boundaries, a11y, perf, observability, degraded
  behavior, docs/ADR, migration/rollback). "works in browser" ≈ 20% dari DoD.
- **23-PRODUCTION-ARCHITECTURE-DECISION-FRAMEWORK.md** — driver keputusan (contract
  conformance, security, workload, cost, operability oleh agents+manusia); matriks evaluasi;
  **candidate microservice decomposition map** (daftar layanan dari domain kontrak, sumber
  kebenaran data per layanan, aturan sync vs async, outbox/saga notes); anti-pattern list
  (distributed monolith, shared DB antar layanan, LLM→DB/email/apply langsung);
  format ADR + seed: `ADR-0001` defer-stack-until-post-PV-1 (ratified), `ADR-0002`
  microservice decomposition candidate (candidate → GATE-P3). Penegasan: pilihan teknologi
  per layanan = P3/P4, bukan sekarang.
  - **Longlist kandidat teknologi** (semua berstatus `candidate`, ilustratif bukan
    endorsemen), per kategori: bahasa/runtime service (TypeScript/Node, Go,
    Python/FastAPI, JVM/Kotlin); relasional (PostgreSQL); search (OpenSearch,
    Meilisearch/Typesense); vektor (pgvector vs engine terpisah); queue/streaming
    (Redpanda/Kafka, RabbitMQ, managed SQS); cache (Redis/Valkey); orkestrasi runtime
    (Kubernetes vs managed container vs PWA-first serverless untuk fase awal); AI gateway
    & routing (gateway self-built vs LiteLLM-like); AuthN/IAM (Keycloak self-host,
    Ory, managed IdP); observability (OpenTelemetry + Grafana stack vs vendor SaaS).
  - **Kriteria skoring tertimbang** (bobot final ditetapkan saat P3 dibuka): contract
    conformance fit; security posture & compliance path; cost pada skala target V1;
    operability oleh tim kecil + coding agents; hiring/ecosystem maturity; portability/
    exit cost. Skoring TIDAK dijalankan sebelum GATE-P3.
- **24-SECURITY-PRIVACY-THREAT-MODEL.md** — klasifikasi data dari vocabulary sensitivitas
  kontrak; trust planes Candidate/Talent; threat model per layanan (STRIDE template +
  abuse cases); pipeline AI/MCP wajib:
  `AuthN → principal+purpose → policy decision → tool/action → domain validation →
  effect gate → execution → receipt+audit`; katalog ancaman seed dari doc 07 + risiko
  R-001..R-008 + prompt injection/webpage malicious + confidential opportunity handling;
  SDLC alignment: SSDF v1.1 final + SP 800-218A final untuk praktik AI; SSDF v1.2 dicatat
  sebagai draft yang diikuti; privasi: bawa open legal questions doc 11 §6 (GDPR, India,
  retensi, consent kontak) apa adanya.
- **25-UX-DESIGN-SYSTEM-AND-STATE-BOUNDARIES.md** — batas state UI (allowlist ephemeral vs
  daftar canonical terlarang: disposition truth, selection stage, priority truth, epistemic
  state klaim, hasil otorisasi, eligibility policy, approval external-effect);
  kontrak ViewModel pattern; kekuatan behavioral yang dipertahankan (progressive disclosure,
  Briefing≠catalog, fit≠pursuit, provenance & unknowns visible, IA workspace stabil, no
  aggregate winner score, clarity external-effect, privacy/stealth UX, mobile bukan desktop
  yang dikecilkan); inventaris design system (tokens, tipografi, spacing, warna semantik,
  motion, focus, density, komponen epistemik, error/degraded/loading/AI/empty/konfirmasi/
  destructive); aturan: tidak ada one-off styling bila primitive tersedia.
- **26-TEST-CONFORMANCE-AND-EVALUATION-STRATEGY.md** — taksonomi verifikasi terpisah
  (semantic conformance, domain unit, state-machine/property, policy/authz, schema compat,
  API contract, integration, persistence, migration, cross-client, browser E2E, a11y, perf,
  security, AI eval, prompt-injection/adversarial, failure injection, backup/restore,
  deploy/rollback, production smoke); WAJIB contoh property test ortogonalitas
  (Disposition/SearchState/SelectionState/Priority tetap ortogonal pada sekuens aksi legal
  apa pun); cross-client conformance memperluas `contracts/v1/conformance/cases.json`;
  **Definition of Correctness per AI function** memperluas 18 ai_functions + 16 eval_cases
  yang ada: input contract, allowed evidence, output schema, epistemic requirement,
  model/version binding, tool permissions, commit authority = none, failure behavior,
  latency/cost budget, eval dataset, hard-failure list (achievement rekaan; inference→Known;
  provenance hilang; mutasi state diam-diam; access route disajikan sebagai fakta; external
  effect tanpa approval → auto-fail).
- **27-PERFORMANCE-RELIABILITY-AND-SLO.md** — matriks budget per surface (Web/PWA CWV+
  bundle+interaction latency; API p50/95/99; DB query count+slow threshold; Search latency+
  freshness; AI TTFT+total; Research E2E; Queue delay; MCP tool latency+output size;
  Extension capture overhead; Background throughput; Cost/user+cost/intelligence-op) —
  **kategori + definisi metrik + ratchet sekarang; angka baseline = null sampai benchmark
  P3**; proses ratchet: PR tidak boleh memburukkan critical path terukur tanpa exception;
  kerangka SLO/error budget + degradation ladder + cadence restore drill (placeholder
  sampai P5).
- **28-DELIVERY-DAG-AND-WORK-PACKAGES.md** — protokol multi-agent: MASTER DAG; brief
  per agent (authority docs, scope, allowed mutation, forbidden mutation, dependencies,
  acceptance criteria, verification commands, expected receipt); aturan keras: dua agent
  tidak boleh memiliki authority surface sama secara konkuren; agent tidak menciptakan
  semantik lokal; no broad refactor di luar scope; done butuh bukti verifikasi; checklist
  integration agent (merge → full conformance → duplicate scan → dead-code scan → boundary
  check → security → tests → perf regression); template WP.
- **29-RELEASE-OPERATIONS-AND-GA-GATES.md** — tangga environment
  Local→CI→Ephemeral/Test→Integration→Staging→ProductionCandidate→Canary/GA; artefak wajib
  (IaC, immutable artifacts, SBOM/provenance, secret management, migration discipline,
  backup+restore drill, rollback TERUJI, feature-flag governance, tracing/metrics/structured
  logging/alerting, SLO+error budget, incident response); aturan: **release tanpa rollback
  teruji = tidak releasable**; kriteria beta acceptance + checklist GA.

### 3. Registries machine-readable `implementation/` (root repo, baru)
- `work-packages.json` — WP untuk P0..P17, seed **±30–35 WP**:
  P0..P4 = 1 WP per fase; P5 = 4 (identity/tenancy; vault+persistence; policy/AuthZ
  engine; audit+observability platform); P6 = 3 (slice contracts/use-cases; wiring
  services; E2E conformance slice); P7..P9 = 2 per fase; P10 = 3 (PWA; extension;
  Candidate MCP server); P11 = 2; P12 = 3 (security hardening; perf; reliability/DR);
  P13/P14/P15 = 1 per fase; P16/P17 = placeholder track.
  Skema: `{id:"WP-P<n>-<nn>", phase, title, goal, exit_gate, depends_on[], owns[],
  horizontal_gates[], status:"planned"}`.
- Konvensi `owns[]`: entri berupa path-glob repo (`web/js/core/**`) ATAU ID registry
  kanonik (`contracts/v1/entities:*`) — tidak boleh ada dua WP aktif dengan owns overlap.
- `dependency-graph.json` — `{edges:[["WP-A","WP-B"],…]}`; harus konsisten dengan
  `depends_on`.
- `quality-gates.json` — invariants INV-01..17 + tier enforcement + `dod` (DOD-STD, 16
  butir) + skema metadata feature flag.
- `architecture-decisions.json` — log ADR (seed ADR-0001, ADR-0002 seperti di atas).
- `performance-budgets.json` — kategori + metrik; `baseline: null`,
  `baseline_set_at: "P3"`, blok `ratchet{policy, exception_process}`.
- `security-controls.json` — kontrol per family dengan referensi praktik SSDF (PO/PS/PW/RV)
  + profil 218A untuk AI + fase penerapan.
- `release-gates.json` — urutan environment (tervalidasi ordered), artefak wajib, gates per
  fase, kebijakan rollback drill.

### 4. Validator program: `implementation/validate_program.py`
Gaya konsisten dengan `contracts/v1/validate_contracts.py` (stdlib saja, exit non-zero):
- JSON valid + field wajib + ID unik;
- edge graph ↔ `depends_on` konsisten, DAG asiklik, cetak topological order;
- setiap WP punya `exit_gate` terdefinisi + `owns` tidak boleh bentrok antar WP aktif
  (path-glob overlap / registry-ID sama);
- setiap invariant punya ≥1 enforcement tier; setiap gate dirujuk ≥1 WP;
- performance budgets: baseline null hanya boleh jika `baseline_set_at=="P3"` (aturan
  pra-ratifikasi);
- release environments ordered unik; rollback drill wajib untuk staging+production_candidate;
- referensi ADR valid.
- Mode tambahan `--scan-clients`: heuristik zero-dependency yang menandai definisi lokal
  yang tampak seperti enum/semantik kanonik di luar `contracts/` (daftar token dari
  `vocabulary.json`) — mekanisme `automated_now` untuk INV-08.

### 5. Kit operasional PV-1 (minimal, tanpa dependency baru)
- `validation/participant_pipeline.json` — pipeline peserta
  `{participant_id, stage: sourced|screened|scheduled|completed|excluded, source, screener_pass,
  session_file?, updated_at}` (PV-P01… kosong, siap isi).
- Perluas `validation/validate_sessions.py` secara aditif (perilaku lama tidak berubah):
  validasi pipeline + ringkasan hitungan per stage; sesuai target 6–8 sesi.
- Update `validation/execution_checklist.md`: tambah langkah pelacakan pipeline.
- Tidak membangun dashboard/app — cukup JSON + validator (zero-dependency culture repo).

### 6. Sinkronisasi authority & hygiene docs
- `docs/00-README.md`: baris peta dokumen 21–29 + entri `implementation/` pada authority
  hierarchy (antara semantic contracts dan prose); perbaiki header status stale menjadi
  `Status: Prototype gate passed — Product Validation-1 human sessions pending`.
- `docs/13-DELIVERY-DECOMPOSITION-BACKLOG.md`: tambah catatan satu paragraf bahwa planning
  maju berpindah ke doc 21 (13 tetap catatan historis).
- Buat **`AGENTS.md`** di root: rantai otoritas (contracts → implementation/ → docs),
  ringkasan aturan agent dari doc 28, verification commands wajib sebelum done, kebutuhan
  receipt. Ini titik masuk bagi coding agents agar protokol multi-agent benar-benar
  terpaksa, bukan hanya didokumentasikan.

### 7. Commit kedua (planning layer)
- Pesan mis.: `docs: master implementation program (21-29) + implementation registries + program validator + pv1 pipeline`.

### 8. Verifikasi akhir (semua wajib hijau)
```bash
python3 contracts/v1/validate_contracts.py     # VALID (baseline tetap)
python3 implementation/validate_program.py     # VALID (baru)
python3 validation/validate_sessions.py        # VALID termasuk pipeline kosong
python3 web/tests/run_smoke.py                 # PASS 121/121
git log --oneline                              # 2 commit: baseline + planning layer
```

## Validasi desain (scenario uji mental)
- Agent menambahkan `Opportunity.status` baru di kode client → INV-08 + validator boundary
  (doc 28) menolak; kontrak melarang generic status.
- PR memperbaiki latensi tapi menaikkan bundle 40% → ratchet doc 27 minta exception record.
- AI function mengubah inference→Known → hard-failure otomatis di eval suite (doc 26),
  bukan review manual belaka.
- Tim memutuskan pakai Postgres X di P2 → melanggar ADR-0001; hanya boleh masuk evaluasi
  matriks doc 23 menuju GATE-P3.

## Risiko & mitigasi
- Dokumen spekulatif membengkak → marker "concrete-now vs gated-at-Pn" wajib; validator
  menolak baseline angka sebelum P3.
- Microservices dianggap stack lock → ADR-0002 eksplisit non-binding sampai GATE-P3 +
  guardrail anti distributed monolith.
- Drift antar coding agent → protokol receipts + satu pemilik authority surface + DoD seragam.
- Konflik otoritas dengan dokumen lama → amendment hierarchy di 00-README (tugas 6).

## Out of scope (putaran ini)
Eksekusi wawancara PV-1; pemilihan vendor/framework/database; kode produksi apa pun;
setup CI vendor; eksekusi program Talent.

## Open question non-blokir
Prioritas geografi, ontologi role awal, dsb. tetap tercatat di doc 11 §4 — bukan blokir
untuk planning layer ini.
