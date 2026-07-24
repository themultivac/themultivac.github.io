# Changelog: `blind-peer-matrix.pdf`

**Updated 2026-07-24.** The hosted `blind-peer-matrix.pdf` is now the **corrected build**.
The earlier notice on this page — that the paper's same-vendor bias results were superseded
by a corrected analysis — has been **resolved**: that corrected analysis is now the version
of record in the hosted PDF.

Corrections now reflected in the hosted PDF:

- **Same-vendor bias.** The naive same-vendor estimator is confounded by respondent quality
  and judge leniency. Under a within-response fixed-effects model with standard errors
  clustered two-way by judge and question, a same-vendor scoring premium survives the controls for
  only **Anthropic (+0.41)** — robust, worst-case leave-one-judge-out *p* < 10⁻⁴ — and
  **MiniMax (+0.40)** — significant under the primary specification (*p* = 0.001) but
  judge-dependent, its two-way significance not surviving leave-one-judge-out (worst-case
  *p* ≈ 0.02). Qwen (+0.56) does not survive the two-way clustering and is not counted; no
  family shows significant negative bias. The surviving premiums are an upper bound on
  favoritism, not a measurement of it: the estimator cannot separate preferential scoring from
  a sibling judge parsing same-distribution output more accurately. The apparent negatives (Mistral −1.02, Google
  −0.59) and the positive xAI +0.75 are artifacts that do not survive controls.
- **Judgment counts.** Of 27,540 total judgment slots, 23,356 parsed and 22,252 carry a
  usable score; 2,781 are intentional self-exclusions (the earlier "5,286 self-excluded"
  mislabelled the complement).
- **Rankings.** Leaderboard rankings now use a leniency-adjusted Bradley–Terry model, with
  naive mean rankings shown as the confounded baseline they correct.
- **Model/family counts.** The dataset spans 55 model configurations (50 distinct by
  display name) across 17 vendor families.

Full corrected analysis, the algebraic four-cell decomposition, per-finding figures, and
one-command reproduction scripts are in the public repository:
<https://github.com/themultivac/multivac-evaluation>.
