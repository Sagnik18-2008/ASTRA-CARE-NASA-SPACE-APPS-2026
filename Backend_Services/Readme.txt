# ASTRA-CARE — Backend Development

**Project:** ASTRA-CARE  
**Module:** Backend Development  
**Domain:** Astronaut Health Monitoring System

## 1. Overview

The ASTRA-CARE backend is responsible for managing astronaut health information, storing medical records, tracking biomarkers, generating and managing health alerts, and providing structured data to the frontend dashboard.

It serves as the central communication layer between the frontend, database, and AI/ML components.

## 2. Technologies Used

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| FastAPI | REST API development |
| Uvicorn | ASGI server |
| Supabase | Cloud database |
| Pydantic | Data validation |
| Swagger / OpenAPI | API documentation and testing |
| Python Virtual Environment | Dependency isolation |
| Environment Variables | Configuration management |

## 3. Backend Architecture

The backend follows a REST API architecture.

**System workflow:**

1. The frontend sends HTTP requests to the backend.
2. FastAPI receives and processes requests.
3. Pydantic validates incoming data.
4. The backend communicates with Supabase.
5. Health information and monitoring data are retrieved or stored.
6. Structured JSON responses are returned to the frontend.
7. The AI/ML component can be integrated into the analysis workflow.

## 4. Implemented API Modules

| API Endpoint | Functionality |
|---|---|
| `/` | Backend home endpoint |
| `/health` | Server health check |
| `/api/astronauts` | Astronaut information management |
| `/api/health-records` | Health record management |
| `/api/biomarkers` | Biomarker data management |
| `/api/alerts` | Health alert management |
| `/api/analysis` | Health analysis management |
| `/api/dashboard` | Dashboard statistics and monitoring overview |

### API Operations

- Health records: POST and GET tested.
- Biomarkers: POST and GET tested.
- Alerts: GET and alert resolution tested.
- Analysis: POST and GET tested.
- Dashboard: API response tested.
- Astronaut management: previously tested.
- Health endpoint: tested successfully.

## 5. Database Integration

Supabase is used as the cloud database.

The backend connects to Supabase through a dedicated client configuration.

The database supports:

- Astronaut profiles
- Health records
- Biomarker measurements
- Health alerts
- Health analysis records

## 6. Dashboard Integration

The backend provides dashboard information through:

`GET /api/dashboard`

The tested response included:

- Mission status
- System status
- Total astronauts
- Total health records
- Total biomarkers
- Total alerts
- Active alerts

## 7. Running the Backend

### Step 1: Navigate to the backend directory

```bash
cd backend
```

### Step 2: Activate the virtual environment

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

### Step 3: Install dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure environment variables

Create a `.env` file containing the required Supabase connection credentials.

Never upload database secrets or API keys to GitHub.

### Step 5: Start the FastAPI server

```bash
uvicorn main:app --reload
```

### Step 6: Open API documentation

- Backend: `http://127.0.0.1:8000`
- Swagger documentation: `http://127.0.0.1:8000/docs`

## 8. Backend Testing and Verification

The following components have been tested:

- FastAPI server startup
- Python dependency installation
- Supabase database connection
- Swagger/OpenAPI documentation
- Astronaut API
- Health Records API
- Biomarkers API
- Alerts API
- Alert resolution
- Analysis API
- Dashboard API
- Server health endpoint

## 9. AI/ML Integration

The Python model runtime is declared separately in
`requirements-aiml.txt` and pins the recorded training versions of joblib,
NumPy, pandas, and scikit-learn. Install it into the backend virtual
environment without replacing the existing API dependencies:

```powershell
python -m pip install -r requirements-aiml.txt
```

`POST /api/analysis/predict` runs the saved KMeans clustering model. It accepts
`astronaut_id` and a `features` object containing all 28 biomarker names from
`ai_models/feature_columns.json`. Feature values must be non-negative numbers
in the same source units as the training data. Use `null` for a missing
measurement; do not omit feature keys or provide guessed values. At least one
measured feature must be supplied.

Preprocessing follows the trained order: feature ordering, median imputation,
`numpy.log1p`, `StandardScaler`, then KMeans prediction. PCA is not applied
before KMeans. The response includes the model's integer `cluster_label`, the
names of any values imputed by the saved model, and the persisted
`analysis_result`. Cluster labels are unsupervised identifiers, not diagnoses,
risk levels, probabilities, or confidence scores.

The endpoint stores `astronaut_id`, `model_name`, `result_type="cluster"` and
the string form of the cluster label in the existing `analysis_results` table.
It does not populate `score` or `input_reference`. The existing
`POST /api/analysis` and `GET /api/analysis/{astronaut_id}` endpoints retain
their existing behavior.

The model was trained using 28 repeated measurements from four participants.
Its clusters are exploratory and are not clinically validated.

## 10. Backend Capabilities

- REST API architecture
- Cloud database connectivity
- Astronaut health data management
- Biomarker tracking
- Health alert management
- Health analysis data management
- Dashboard statistics
- Frontend and AI/ML integration readiness

## 11. Future Improvements

- Complete AI/ML model integration.
- Improve API authentication and authorization.
- Strengthen error handling and validation.
- Add advanced health data filtering.
- Improve logging and monitoring.
- Prepare production deployment.

---

**ASTRA-CARE — Astronaut Health Monitoring System**

*Supporting smarter astronaut health monitoring through backend engineering, cloud database integration, and AI-powered health intelligence.*