
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime, timezone
import math
from numbers import Real
from supabase_client import supabase
from ai_models.inference import (
    FeatureInputError,
    ModelUnavailableError,
    validate_feature_payload,
)


# -------------------------------
# FASTAPI APPLICATION
# -------------------------------

app = FastAPI(
    title="ASTRA-CARE API",
    description="Astronaut Health Monitoring System",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------
# REQUEST MODELS
# -------------------------------

class AstronautCreate(BaseModel):
    astronaut_code: str = Field(min_length=1)
    full_name: Optional[str] = None
    mission: Optional[str] = None


class HealthRecordCreate(BaseModel):
    astronaut_id: int
    heart_rate: Optional[float] = None
    spo2: Optional[float] = None
    body_temperature: Optional[float] = None
    source: str = "manual"
    notes: Optional[str] = None


class BiomarkerCreate(BaseModel):
    astronaut_id: int
    analyte: str
    concentration: Optional[float] = None
    unit: Optional[str] = None
    timepoint: Optional[str] = None
    source_dataset: Optional[str] = None


class AlertCreate(BaseModel):
    astronaut_id: Optional[int] = None
    severity: str = "info"
    title: str
    message: Optional[str] = None
    status: str = "open"


class AnalysisResultCreate(BaseModel):
    astronaut_id: int = Field(gt=0)
    model_name: Optional[str] = None
    result_type: Optional[str] = None
    score: Optional[float] = None
    prediction: Optional[str] = None
    input_reference: Optional[str] = None


class AnalysisInferenceRequest(BaseModel):
    astronaut_id: int = Field(gt=0)
    features: dict[str, Optional[float]]

    @field_validator("features", mode="before")
    @classmethod
    def validate_feature_values(cls, value):
        if not isinstance(value, dict):
            raise ValueError("features must be an object keyed by biomarker name.")

        for feature, measurement in value.items():
            if measurement is None:
                continue
            if isinstance(measurement, bool) or not isinstance(measurement, Real):
                raise ValueError(
                    f"{feature} must be a non-negative number or null."
                )
            if not math.isfinite(float(measurement)):
                raise ValueError(f"{feature} must be finite.")
            if measurement < 0:
                raise ValueError(f"{feature} must not be negative.")

        return value


# -------------------------------
# DATABASE HELPER
# -------------------------------

def db_request(operation):
    try:
        return operation()

    except Exception as exc:
        print(f"Database operation failed ({type(exc).__name__}).")

        raise HTTPException(
            status_code=500,
            detail="Database operation failed. Check server logs."
        )


def insert_one(table_name: str, payload: dict):
    rows = db_request(
        lambda: supabase.table(table_name).insert(payload).execute().data
    )
    if not rows:
        raise HTTPException(
            status_code=500,
            detail=f"No record was returned after inserting into {table_name}."
        )
    return rows[0]


def get_table_count(table_name: str, status: Optional[str] = None):

    def query():
        request = supabase.table(table_name).select(
            "id", count="exact"
        )

        if status is not None:
            request = request.eq("status", status)

        return request.execute().count or 0

    return db_request(query)


# -------------------------------
# ASTRONAUT VALIDATION HELPER
# -------------------------------

def ensure_astronaut_exists(astronaut_id: int):

    result = db_request(
        lambda: supabase.table("astronauts")
        .select("id")
        .eq("id", astronaut_id)
        .limit(1)
        .execute().data
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"Astronaut with ID {astronaut_id} not found"
        )

    return True


# -------------------------------
# BASIC ENDPOINTS
# -------------------------------

@app.get("/")
def home():
    return {
        "project": "ASTRA-CARE",
        "message": "Backend is running successfully!",
        "status": "online",
        "version": "2.0.0"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "system": "ASTRA-CARE"
    }


# -------------------------------
# DYNAMIC DASHBOARD API
# -------------------------------

@app.get("/api/dashboard")
def dashboard():

    return {
        "mission": "Active",
        "system_status": "Operational",
        "module": "Astronaut Health Monitoring",

        "total_astronauts": get_table_count("astronauts"),

        "total_health_records": get_table_count("health_records"),

        "total_biomarkers": get_table_count("biomarkers"),

        "total_alerts": get_table_count("alerts"),

        "active_alerts": get_table_count(
            "alerts", status="open"
        )
    }


# -------------------------------
# ASTRONAUT APIs
# -------------------------------

@app.post("/api/astronauts", status_code=201)
def create_astronaut(data: AstronautCreate):

    return insert_one("astronauts", data.model_dump(exclude_none=True))


@app.get("/api/astronauts")
def get_astronauts():

    return db_request(
        lambda: supabase.table("astronauts")
        .select("*")
        .limit(100)
        .execute().data
    )


@app.get("/api/astronauts/{astronaut_id}")
def get_astronaut(astronaut_id: int):

    result = db_request(
        lambda: supabase.table("astronauts")
        .select("*")
        .eq("id", astronaut_id)
        .execute().data
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Astronaut not found"
        )

    return result[0]


# -------------------------------
# HEALTH RECORD APIs
# -------------------------------

@app.post("/api/health-records", status_code=201)
def create_health_record(data: HealthRecordCreate):

    ensure_astronaut_exists(data.astronaut_id)

    return insert_one("health_records", data.model_dump(exclude_none=True))


@app.get("/api/health-records")
def get_health_records(astronaut_id: Optional[int] = None):

    def query():
        request = supabase.table("health_records").select("*")

        if astronaut_id is not None:
            request = request.eq("astronaut_id", astronaut_id)

        return request.order(
            "recorded_at", desc=True
        ).limit(100).execute().data

    return db_request(query)


# -------------------------------
# BIOMARKER APIs
# -------------------------------

@app.post("/api/biomarkers", status_code=201)
def create_biomarker(data: BiomarkerCreate):

    ensure_astronaut_exists(data.astronaut_id)

    return insert_one("biomarkers", data.model_dump(exclude_none=True))


@app.get("/api/biomarkers")
def get_biomarkers(astronaut_id: Optional[int] = None):

    def query():
        request = supabase.table("biomarkers").select("*")

        if astronaut_id is not None:
            request = request.eq("astronaut_id", astronaut_id)

        return request.order(
            "recorded_at", desc=True
        ).limit(100).execute().data

    return db_request(query)


# -------------------------------
# ALERT APIs
# -------------------------------

@app.post("/api/alerts", status_code=201)
def create_alert(data: AlertCreate):

    if data.astronaut_id is not None:
        ensure_astronaut_exists(data.astronaut_id)

    return insert_one("alerts", data.model_dump(exclude_none=True))


@app.get("/api/alerts")
def get_alerts(astronaut_id: Optional[int] = None):

    def query():
        request = supabase.table("alerts").select("*")

        if astronaut_id is not None:
            request = request.eq("astronaut_id", astronaut_id)

        return request.order(
            "created_at", desc=True
        ).limit(100).execute().data

    return db_request(query)


@app.patch("/api/alerts/{alert_id}/resolve")
def resolve_alert(alert_id: int):

    if alert_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Alert ID must be greater than zero"
        )

    result = db_request(
        lambda: supabase.table("alerts")
        .update({
            "status": "resolved",
            "resolved_at": datetime.now(timezone.utc).isoformat()
        })
        .eq("id", alert_id)
        .execute().data
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    return result[0]


# -------------------------------
# AI/ML ANALYSIS APIs
# -------------------------------

@app.post("/api/analysis", status_code=201)
def save_analysis(data: AnalysisResultCreate):

    ensure_astronaut_exists(data.astronaut_id)

    return insert_one("analysis_results", data.model_dump(exclude_none=True))


@app.post("/api/analysis/predict", status_code=201)
def predict_analysis(data: AnalysisInferenceRequest):

    try:
        _, imputed_features = validate_feature_payload(data.features)
    except FeatureInputError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except ModelUnavailableError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    if imputed_features:
        raise HTTPException(
            status_code=422,
            detail={
                "code": "insufficient_features",
                "message": "Prediction requires all 28 measured features.",
                "missing_features": list(imputed_features),
            },
        )

    raise HTTPException(
        status_code=409,
        detail={
            "code": "sample_provenance_unavailable",
            "message": (
                "Prediction is disabled until all measurements can be verified "
                "as belonging to one astronaut sample with known units and provenance."
            ),
        },
    )


@app.get("/api/analysis/{astronaut_id}")
def get_analysis(astronaut_id: int):

    if astronaut_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Astronaut ID must be greater than zero"
        )

    return db_request(
        lambda: supabase.table("analysis_results")
        .select("*")
        .eq("astronaut_id", astronaut_id)
        .order("created_at", desc=True)
        .limit(100)
        .execute().data
    )
