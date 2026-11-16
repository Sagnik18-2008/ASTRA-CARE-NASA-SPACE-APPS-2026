# ASTRA-CARE Submission Guide

## Overview

ASTRA-CARE is a research and demonstration platform for astronaut health monitoring. It presents astronaut, health-record, biomarker, alert, and analysis-history data served by a FastAPI backend backed by Supabase.

## Technology and architecture

- Frontend: React, TypeScript, Vite, Tailwind CSS, Recharts, and React Three Fiber.
- Backend: FastAPI with Supabase database access.
- Research ML: saved scikit-learn artifacts and a canonical 28-feature input order in `backend/ai_models/feature_columns.json`.
- Frontend requests use same-origin `/api` paths. Vite proxies these requests to FastAPI at `http://127.0.0.1:8000` during development. The optional `VITE_API_BASE_URL` setting can point a separately hosted frontend at its API origin; leave it unset for the included local proxy.
- The production helper `frontend/prod_server.js` serves the built frontend and proxies `/api` to the local FastAPI server on port 8000.

## Features

- Mission overview counts and astronaut directory.
- Astronaut record selector, health-record summaries, and an illustrative 3D anatomy view.
- Biomarker record listing and raw-value charting only when the chart's records have a common recorded unit.
- Health-record and biomarker creation using values entered by the operator.
- Alert creation, filtering, and server-confirmed resolution.
- Analysis history and display of current database coverage for the model's features.

All empty and error states are shown explicitly. Missing records are not replaced with sample values. The anatomical scene is illustrative and does not provide an individualized assessment.

## AI pipeline and limitations

The preserved inference pipeline is median imputation, `log1p`, `StandardScaler`, and KMeans. PCA is a separate exploratory analysis and is not part of live inference. A cluster label is an exploratory grouping only—not a diagnosis, medical risk probability, or validated clinical conclusion.

The research workflow uses NASA OSD-575 data and defines 28 model features. Research source files are not treated as live astronaut records. The current biomarker API does not provide a sample/collection ID, verified source provenance, or a reliable feature-unit contract. Therefore, the AI screen lists exact-name database matches but disables prediction from those records. The backend rejects requests with missing values and returns HTTP 409 for a complete feature vector until sample provenance can be verified; it does not run or persist an unsupported prediction. No model artifacts, preprocessing, source datasets, or database schema were changed.

## Local setup (Windows PowerShell)

Open two PowerShell terminals from the project directory.

### Backend

```powershell
Set-Location .\backend
# If needed, install the checked-in Python dependencies:
.\.venv\Scripts\python.exe -m pip install -r .\requirements-aiml.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Configure Supabase locally using `SUPABASE_URL` and either `SUPABASE_SECRET_KEY` or `SUPABASE_KEY` in `backend\.env`. Keep this file private and out of version control; do not put credentials in frontend variables.

### Frontend

```powershell
Set-Location .\frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). The Vite proxy forwards `/api` requests to the backend.

### Production-style local demo

Build the frontend, then start the included static host while the backend is running:

```powershell
Set-Location .\frontend
npm run build
node .\prod_server.js
```

Open `http://127.0.0.1:5173`. The helper proxies `/api` to `http://127.0.0.1:8000`.

## Validation commands

```powershell
# Frontend
Set-Location .\frontend
npm ls --depth=0
npm run lint
npm run build

# Backend (from project root)
Set-Location ..\backend
.\.venv\Scripts\python.exe -m pip check
.\.venv\Scripts\python.exe -m unittest discover -s tests -v

# API health check (backend must be running)
Invoke-WebRequest http://127.0.0.1:8000/health
```

Do not run test inserts against the configured Supabase project. Automated backend tests mock persistence.

## Known limitations

- Existing biomarker rows cannot be safely grouped into one blood sample. Database schema changes are outside this implementation.
- No live predictions are enabled from current biomarker records; feature-name matches alone do not prove sample coherence, units, or provenance.
- Health-record temperature units are not defined by the current API contract and are shown as stored.
- Existing backend GET endpoints limit returned collections to 100 records; there is no pagination.
- Alerts are operator-entered records, not automatically generated medical warnings.
- Backend dashboard status text is informational; only returned database counts are used as record statistics.
- A Supabase connection and valid local credentials are required for database-backed screens. No production database write was performed for this implementation.
