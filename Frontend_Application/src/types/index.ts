// ─────────────────────────────────────────────
// ASTRA-CARE Core Types & Backend Contracts
// Mirrors FastAPI + Supabase database schemas
// ─────────────────────────────────────────────

// ─── Astronaut ───
export interface Astronaut {
  id: number | string;
  astronaut_code?: string;
  full_name?: string;
  name?: string; // Compatibility alias
  mission?: string;
  mission_id?: string | number; // Compatibility alias
  mission_name?: string; // Compatibility alias
  rank?: string;
  role?: string;
  age?: number;
  gender?: string;
  nationality?: string;
  status?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AstronautCreatePayload {
  astronaut_code: string;
  full_name?: string;
  mission?: string;
}

// ─── Health Record ───
export interface HealthRecord {
  id: number | string;
  astronaut_id: number | string;
  heart_rate?: number;
  spo2?: number;
  oxygen_saturation?: number; // Alias for spo2
  body_temperature?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  respiratory_rate?: number;
  sleep_hours?: number;
  stress_level?: number;
  radiation_exposure?: number;
  bone_density?: number;
  muscle_mass?: number;
  source?: string;
  notes?: string;
  recorded_at?: string;
  record_date?: string; // Compatibility alias
  created_at?: string;
}

export interface HealthRecordCreatePayload {
  astronaut_id: number;
  heart_rate?: number;
  spo2?: number;
  body_temperature?: number;
  source?: string;
  notes?: string;
}

// ─── Biomarker ───
export interface Biomarker {
  id: number | string;
  astronaut_id: number | string;
  analyte?: string;
  marker_name?: string; // Compatibility alias
  concentration?: number;
  marker_value?: number; // Compatibility alias
  unit?: string;
  timepoint?: string;
  source_dataset?: string;
  normal_range_min?: number;
  normal_range_max?: number;
  category?: string;
  risk_level?: 'normal' | 'elevated' | 'critical' | 'low';
  recorded_at?: string;
  notes?: string;
}

export interface BiomarkerCreatePayload {
  astronaut_id: number;
  analyte: string;
  concentration?: number;
  unit?: string;
  timepoint?: string;
  source_dataset?: string;
}

// ─── Alert ───
export interface HealthAlert {
  id: number | string;
  astronaut_id?: number | string;
  alert_type?: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message?: string;
  status?: 'open' | 'resolved';
  is_resolved?: boolean; // Compatibility alias
  created_at: string;
  resolved_at?: string;
}

export interface DashboardData {
  astronaut: Astronaut;
  health_summary: {
    overall_status: string;
    risk_score: number;
    heart_rate: number;
    blood_pressure: string;
    oxygen_saturation: number;
    body_temperature: number;
  };
  recent_records: HealthRecord[];
  biomarkers: Biomarker[];
  recent_alerts: HealthAlert[];
  ai_summary?: AIAnalysis;
}

export interface AlertCreatePayload {
  astronaut_id?: number;
  severity: string;
  title: string;
  message?: string;
  status?: string;
}

// ─── AI Analysis & ML Inference ───
export interface AnalysisResult {
  id: number | string;
  astronaut_id: number | string;
  model_name?: string;
  result_type?: string;
  score?: number;
  prediction?: string;
  input_reference?: string;
  created_at: string;
}

export interface AIAnalysis {
  id: number | string;
  astronaut_id: number | string;
  analysis_type?: string;
  summary?: string;
  risk_score?: number;
  recommendations?: string[];
  detailed_findings?: string;
  model_version?: string;
  confidence?: number;
  cluster_label?: number;
  created_at: string;
}

export interface AnalysisPredictRequest {
  astronaut_id: number;
  features: Record<string, number | null>;
}

export interface AnalysisPredictResponse {
  astronaut_id: number;
  cluster_label: number;
  imputed_features: string[];
  analysis_result: AnalysisResult;
}

// ─── System Dashboard Summary ───
export interface SystemDashboardStats {
  mission: string;
  system_status: string;
  module: string;
  total_astronauts: number;
  total_health_records: number;
  total_biomarkers: number;
  total_alerts: number;
  active_alerts: number;
}

// ─── Mission Overview ───
export interface Mission {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'completed';
  launch_date?: string;
  end_date?: string;
  crew_count?: number;
  destination?: string;
  altitude_km?: number;
  orbital_velocity?: string;
  environmental_status?: {
    radiation_rate_msv: number;
    cabin_pressure_kpa: number;
    oxygen_percentage: number;
    co2_percentage: number;
  };
}

// ─── 3D Digital Twin Anatomical System ───
export type BodySystemKey = 
  | 'cardiovascular'
  | 'musculoskeletal'
  | 'neuro_ocular'
  | 'respiratory'
  | 'endocrine';

export interface BodySystemStatus {
  id: BodySystemKey;
  name: string;
  label: string;
  status: 'optimal' | 'warning' | 'alert' | 'monitoring';
  score: number; // 0 - 100
  keyMetrics: { label: string; value: string; status: 'normal' | 'abnormal' }[];
  description: string;
  spaceflightRisk: string;
  countermeasures: string[];
}
