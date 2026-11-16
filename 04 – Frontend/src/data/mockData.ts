import type { Astronaut, HealthRecord, Biomarker, AIAnalysis, HealthAlert, DashboardData, Mission } from '../types';

// ────────────────────────────────────────
// Mock data used when the backend is unavailable.
// Clearly identified as mock data for frontend development.
// ────────────────────────────────────────

export const MOCK_ASTRONAUTS: Astronaut[] = [
  {
    id: 'ast-001',
    name: 'Commander Elena Vasquez',
    rank: 'Commander',
    role: 'Mission Commander',
    mission_id: 'mission-artemis-iv',
    mission_name: 'Artemis IV',
    age: 42,
    gender: 'Female',
    nationality: 'United States',
    status: 'active',
    avatar_url: '',
    created_at: '2025-01-15T08:00:00Z',
  },
  {
    id: 'ast-002',
    name: 'Dr. Kenji Tanaka',
    rank: 'Flight Surgeon',
    role: 'Chief Medical Officer',
    mission_id: 'mission-artemis-iv',
    mission_name: 'Artemis IV',
    age: 38,
    gender: 'Male',
    nationality: 'Japan',
    status: 'active',
    created_at: '2025-01-15T08:00:00Z',
  },
  {
    id: 'ast-003',
    name: 'Specialist Amara Okafor',
    rank: 'Mission Specialist',
    role: 'Biomedical Engineer',
    mission_id: 'mission-artemis-iv',
    mission_name: 'Artemis IV',
    age: 35,
    gender: 'Female',
    nationality: 'Nigeria',
    status: 'active',
    created_at: '2025-02-10T08:00:00Z',
  },
  {
    id: 'ast-004',
    name: 'Pilot Marcus Reinhardt',
    rank: 'Pilot',
    role: 'Vehicle Pilot',
    mission_id: 'mission-artemis-iv',
    mission_name: 'Artemis IV',
    age: 40,
    gender: 'Male',
    nationality: 'Germany',
    status: 'active',
    created_at: '2025-01-20T08:00:00Z',
  },
];

export const MOCK_MISSIONS: Mission[] = [
  {
    id: 'mission-artemis-iv',
    name: 'Artemis IV',
    description: 'Extended lunar surface exploration and habitation mission',
    status: 'active',
    launch_date: '2026-03-15T00:00:00Z',
    destination: 'Lunar South Pole',
    crew_count: 4,
  },
  {
    id: 'mission-mars-pathfinder',
    name: 'Mars Pathfinder',
    description: 'First crewed Mars orbital reconnaissance mission',
    status: 'planning',
    launch_date: '2028-11-01T00:00:00Z',
    destination: 'Mars Orbit',
    crew_count: 6,
  },
];

export const MOCK_HEALTH_RECORDS: HealthRecord[] = [
  {
    id: 'hr-001', astronaut_id: 'ast-001', record_date: '2026-11-15T06:00:00Z',
    heart_rate: 72, blood_pressure_systolic: 118, blood_pressure_diastolic: 76,
    oxygen_saturation: 98.2, body_temperature: 36.7, respiratory_rate: 16,
    sleep_hours: 7.5, stress_level: 3, radiation_exposure: 0.42, bone_density: 1.15, muscle_mass: 58.2,
    notes: 'Routine morning vitals — all nominal.',
  },
  {
    id: 'hr-002', astronaut_id: 'ast-001', record_date: '2026-11-14T06:00:00Z',
    heart_rate: 75, blood_pressure_systolic: 120, blood_pressure_diastolic: 78,
    oxygen_saturation: 97.8, body_temperature: 36.8, respiratory_rate: 17,
    sleep_hours: 6.8, stress_level: 4, radiation_exposure: 0.45, bone_density: 1.14, muscle_mass: 58.0,
  },
  {
    id: 'hr-003', astronaut_id: 'ast-001', record_date: '2026-11-13T06:00:00Z',
    heart_rate: 68, blood_pressure_systolic: 115, blood_pressure_diastolic: 74,
    oxygen_saturation: 98.5, body_temperature: 36.6, respiratory_rate: 15,
    sleep_hours: 8.0, stress_level: 2, radiation_exposure: 0.40, bone_density: 1.15, muscle_mass: 58.3,
  },
  {
    id: 'hr-004', astronaut_id: 'ast-002', record_date: '2026-11-15T06:30:00Z',
    heart_rate: 78, blood_pressure_systolic: 122, blood_pressure_diastolic: 80,
    oxygen_saturation: 97.5, body_temperature: 36.9, respiratory_rate: 18,
    sleep_hours: 6.2, stress_level: 5, radiation_exposure: 0.50, bone_density: 1.10, muscle_mass: 65.0,
  },
  {
    id: 'hr-005', astronaut_id: 'ast-003', record_date: '2026-11-15T07:00:00Z',
    heart_rate: 65, blood_pressure_systolic: 112, blood_pressure_diastolic: 72,
    oxygen_saturation: 98.8, body_temperature: 36.5, respiratory_rate: 14,
    sleep_hours: 8.2, stress_level: 2, radiation_exposure: 0.38, bone_density: 1.18, muscle_mass: 52.5,
  },
];

export const MOCK_BIOMARKERS: Biomarker[] = [
  { id: 'bm-001', astronaut_id: 'ast-001', marker_name: 'Cortisol', marker_value: 18.5, unit: 'µg/dL', normal_range_min: 6, normal_range_max: 23, category: 'Endocrine', risk_level: 'normal', recorded_at: '2026-11-15T06:00:00Z' },
  { id: 'bm-002', astronaut_id: 'ast-001', marker_name: 'Hemoglobin', marker_value: 14.2, unit: 'g/dL', normal_range_min: 12, normal_range_max: 17, category: 'Hematology', risk_level: 'normal', recorded_at: '2026-11-15T06:00:00Z' },
  { id: 'bm-003', astronaut_id: 'ast-001', marker_name: 'Creatinine', marker_value: 1.3, unit: 'mg/dL', normal_range_min: 0.7, normal_range_max: 1.3, category: 'Renal', risk_level: 'elevated', recorded_at: '2026-11-15T06:00:00Z' },
  { id: 'bm-004', astronaut_id: 'ast-001', marker_name: 'TSH', marker_value: 2.8, unit: 'mIU/L', normal_range_min: 0.4, normal_range_max: 4.0, category: 'Thyroid', risk_level: 'normal', recorded_at: '2026-11-15T06:00:00Z' },
  { id: 'bm-005', astronaut_id: 'ast-001', marker_name: 'Vitamin D', marker_value: 22, unit: 'ng/mL', normal_range_min: 30, normal_range_max: 100, category: 'Nutritional', risk_level: 'low', recorded_at: '2026-11-15T06:00:00Z' },
  { id: 'bm-006', astronaut_id: 'ast-001', marker_name: 'CRP', marker_value: 3.8, unit: 'mg/L', normal_range_min: 0, normal_range_max: 3, category: 'Inflammatory', risk_level: 'elevated', recorded_at: '2026-11-15T06:00:00Z' },
  { id: 'bm-007', astronaut_id: 'ast-001', marker_name: 'WBC Count', marker_value: 7.2, unit: '×10³/µL', normal_range_min: 4.5, normal_range_max: 11, category: 'Hematology', risk_level: 'normal', recorded_at: '2026-11-15T06:00:00Z' },
  { id: 'bm-008', astronaut_id: 'ast-001', marker_name: 'Calcium', marker_value: 8.8, unit: 'mg/dL', normal_range_min: 8.5, normal_range_max: 10.5, category: 'Bone Health', risk_level: 'normal', recorded_at: '2026-11-15T06:00:00Z' },
];

export const MOCK_AI_ANALYSES: AIAnalysis[] = [
  {
    id: 'ai-001', astronaut_id: 'ast-001', analysis_type: 'Comprehensive Health Assessment',
    summary: 'Commander Vasquez shows overall stable health metrics with minor areas of attention. Vitamin D levels are below optimal range — recommend UV supplementation protocol. CRP slightly elevated; continue monitoring for inflammatory trends. Cardiovascular and pulmonary function remain excellent for mission duration.',
    risk_score: 23,
    recommendations: [
      'Increase Vitamin D supplementation to 4000 IU daily',
      'Monitor CRP levels bi-weekly for inflammatory trend analysis',
      'Maintain current exercise regimen — cardiovascular metrics are optimal',
      'Schedule bone density scan at mission day 120',
      'Continue radiation exposure logging — cumulative dose within acceptable limits',
    ],
    detailed_findings: 'Cardiovascular: Resting HR averaging 72 bpm, BP 118/76 — within nominal range. SpO2 stable above 97%. Sleep architecture showing adequate deep sleep cycles. Musculoskeletal: Bone density stable at 1.15 g/cm², muscle mass maintained at 58.2 kg. Endocrine: Cortisol within range indicating manageable stress levels. Renal: Creatinine at upper boundary — hydration protocol compliance recommended.',
    model_version: 'ASTRA-AI v2.4',
    confidence: 0.92,
    created_at: '2026-11-15T08:00:00Z',
  },
];

export const MOCK_ALERTS: HealthAlert[] = [
  {
    id: 'alert-001', astronaut_id: 'ast-001', alert_type: 'biomarker',
    severity: 'medium', title: 'Vitamin D Deficiency Detected',
    message: 'Vitamin D levels at 22 ng/mL — below recommended minimum of 30 ng/mL. Extended microgravity and limited UV exposure contributing factors.',
    is_resolved: false, created_at: '2026-11-15T06:30:00Z',
  },
  {
    id: 'alert-002', astronaut_id: 'ast-001', alert_type: 'biomarker',
    severity: 'low', title: 'CRP Slightly Elevated',
    message: 'C-Reactive Protein at 3.8 mg/L — marginally above reference range. No acute symptoms detected. Monitoring recommended.',
    is_resolved: false, created_at: '2026-11-15T06:30:00Z',
  },
  {
    id: 'alert-003', astronaut_id: 'ast-002', alert_type: 'vitals',
    severity: 'high', title: 'Elevated Stress Indicators',
    message: 'Dr. Tanaka showing sustained elevated stress levels (5/10) combined with reduced sleep duration (6.2h). Recommend workload assessment and sleep hygiene review.',
    is_resolved: false, created_at: '2026-11-15T07:00:00Z',
  },
  {
    id: 'alert-004', astronaut_id: 'ast-001', alert_type: 'radiation',
    severity: 'low', title: 'Cumulative Radiation Update',
    message: 'Cumulative radiation exposure reaching 45% of mission limit. Current daily rate of 0.42 mSv within acceptable bounds.',
    is_resolved: true, resolved_at: '2026-11-14T12:00:00Z', created_at: '2026-11-13T06:00:00Z',
  },
];

export const MOCK_DASHBOARD: DashboardData = {
  astronaut: MOCK_ASTRONAUTS[0],
  health_summary: {
    overall_status: 'Nominal',
    risk_score: 23,
    heart_rate: 72,
    blood_pressure: '118/76',
    oxygen_saturation: 98.2,
    body_temperature: 36.7,
  },
  recent_records: MOCK_HEALTH_RECORDS.filter(r => r.astronaut_id === 'ast-001'),
  biomarkers: MOCK_BIOMARKERS,
  recent_alerts: MOCK_ALERTS.filter(a => a.astronaut_id === 'ast-001'),
  ai_summary: MOCK_AI_ANALYSES[0],
};
