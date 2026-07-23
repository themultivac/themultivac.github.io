# Changelog: `blind-peer-matrix.pdf`

**Updated 2026-07-22.** The hosted `blind-peer-matrix.pdf` is now the **corrected build**.
The earlier notice on this page — that the paper's same-vendor bias results were superseded
by a corrected analysis — has been **resolved**: that corrected analysis is now the version
of record in the hosted PDF.

Corrections now reflected in the hosted PDF:

- **Same-vendor bias.** The naive same-vendor estimator is confounded by respondent quality
  and judge leniency. Under a within-response fixed-effects model with judge-clustered
  standard errors, only **Anthropic (+0.41)** and **MiniMax (+0.40)** show robust
  same-vendor favoritism (Qwen +0.56 is significant but fragile); no family shows
  significant negative bias. The apparent negatives (Mistral −1.02, Google −0.59) and the
  positive xAI +0.75 are artifacts that do not survive controls.
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
