# Notice: `blind-peer-matrix.pdf` is partially superseded

**Dated 2026-07-13.**

The hosted paper `blind-peer-matrix.pdf` (build of 2026-05-31) reports same-vendor
(same-family) rating bias using a naive estimator — the difference between a judge
family's mean score to its own siblings and to other vendors. **That estimator is
confounded**, and its headline same-vendor bias results have been **superseded** by a
corrected within-response analysis.

Specifically, in the superseded version:

- "Statistically significant same-family bias in every family" does **not** hold. Under a
  within-response fixed-effects model with judge-clustered standard errors, only
  **Anthropic (+0.41)** and **MiniMax (+0.40)** show robust same-vendor favoritism (Qwen
  +0.56 is significant but fragile). No family shows significant negative bias.
- The large apparent negatives — **Mistral −1.02** and **Google −0.59** — are artifacts of
  judge leniency and respondent quality respectively, not favoritism.
- The apparent **xAI +0.75** does not survive controls.

The corrected analysis, the algebraic four-cell decomposition, and one-command
reproduction scripts are in the public repository:
<https://github.com/themultivac/multivac-evaluation> (see `paper_tables/WITHIN_RESPONSE_FINDINGS.md`,
`FOUR_CELL_DECOMPOSITION_FINDINGS.md`, and `multivac_corrected_sections.md`).

The valid-judgment count is also corrected: of 27,540 total judgment slots, 23,356 parsed
successfully and 22,252 carry a usable score; 2,781 are intentional self-exclusions (the
earlier "5,286 self-excluded" mislabelled the complement).

A corrected PDF build will replace this file once the LaTeX source is updated. The other
findings (judge-leniency spread, category-dependent disagreement, no single dominant model)
are unaffected.
