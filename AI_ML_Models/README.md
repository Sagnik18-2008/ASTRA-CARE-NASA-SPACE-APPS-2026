# ASTRA CARE
## Beyond Earth, Beyond Connectivity

### Project overview
ASTRA CARE is an exploratory AIML research workflow using
NASA OSDR-575 / Inspiration4 biomarker data.

### Project structure
- data/raw: Original source datasets
- data/processed: Integrated and processed datasets
- src: Source code
- outputs: Results, figures, reports and audit files
- models: Saved preprocessing and analytical models

### Analytical workflow
1. Dataset integration and validation
2. Missing-value analysis and preprocessing
3. Principal Component Analysis
4. Unsupervised clustering
5. Supervised classification
6. Participant-level model stability
7. Explainable AI using permutation importance
8. Research validation and documentation

### Important scientific limitations
- Four independent participants were available.
- Repeated measurements are not independent participants.
- Classification and XAI results are exploratory.
- No clinical diagnostic claims are supported.
- Race-specific eGFR estimates were excluded from classification.

### Main report
outputs/ASTRA_CARE_AIML_Research_Report.docx

### Reproducibility
Run the analysis notebook or source scripts in the intended
execution order. Preserve the original raw datasets.
