import api from './api';
import type { 
  Astronaut, 
  AstronautCreatePayload,
  HealthRecord, 
  HealthRecordCreatePayload,
  Biomarker, 
  BiomarkerCreatePayload,
  HealthAlert, 
  AlertCreatePayload,
  AnalysisResult,
  AnalysisPredictRequest,
  AnalysisPredictResponse,
  SystemDashboardStats
} from '../types';

function insertedRecord<T>(data: T | T[], resource: string): T {
  const record = Array.isArray(data) ? data[0] : data;
  if (!record) {
    throw new Error(`The backend did not return the created ${resource}.`);
  }
  return record as T;
}

// ─── Dashboard Stats ───
export const dashboardService = {
  getStats: async (): Promise<SystemDashboardStats> => {
    const res = await api.get('/api/dashboard');
    return res.data;
  },
};

// ─── Astronaut Service ───
export const astronautService = {
  getAll: async (): Promise<Astronaut[]> => {
    const res = await api.get('/api/astronauts');
    return res.data.map((ast: Astronaut) => ({
      ...ast,
      name: ast.full_name || ast.name || (ast.astronaut_code ? `Astronaut ${ast.astronaut_code}` : undefined),
      mission_name: ast.mission || ast.mission_name,
    }));
  },
  getById: async (id: number | string): Promise<Astronaut> => {
    const res = await api.get(`/api/astronauts/${id}`);
    const ast = res.data;
    return {
      ...ast,
      name: ast.full_name || ast.name || (ast.astronaut_code ? `Astronaut ${ast.astronaut_code}` : undefined),
      mission_name: ast.mission || ast.mission_name,
    };
  },
  create: async (payload: AstronautCreatePayload): Promise<Astronaut> => {
    const res = await api.post('/api/astronauts', payload);
    return insertedRecord<Astronaut>(res.data, 'astronaut');
  },
};

// ─── Health Records Service ───
export const healthRecordService = {
  getAll: async (astronautId?: number | string): Promise<HealthRecord[]> => {
    const params = astronautId ? { astronaut_id: Number(astronautId) } : {};
    const res = await api.get('/api/health-records', { params });
    return res.data.map((rec: HealthRecord) => ({
      ...rec,
      oxygen_saturation: rec.spo2 ?? rec.oxygen_saturation,
      record_date: rec.recorded_at ?? rec.record_date,
    }));
  },
  create: async (payload: HealthRecordCreatePayload): Promise<HealthRecord> => {
    const res = await api.post('/api/health-records', payload);
    return insertedRecord<HealthRecord>(res.data, 'health record');
  },
};

// ─── Biomarkers Service ───
export const biomarkerService = {
  getAll: async (astronautId?: number | string): Promise<Biomarker[]> => {
    const params = astronautId ? { astronaut_id: Number(astronautId) } : {};
    const res = await api.get('/api/biomarkers', { params });
    return res.data.map((bm: any) => ({
      ...bm,
      marker_name: bm.analyte || bm.marker_name,
      marker_value: bm.concentration !== undefined ? bm.concentration : bm.marker_value,
      risk_level: bm.risk_level,
    }));
  },
  create: async (payload: BiomarkerCreatePayload): Promise<Biomarker> => {
    const res = await api.post('/api/biomarkers', payload);
    return insertedRecord<Biomarker>(res.data, 'biomarker');
  },
};

// ─── Alerts Service ───
export const alertService = {
  getAll: async (astronautId?: number | string): Promise<HealthAlert[]> => {
    const params = astronautId ? { astronaut_id: Number(astronautId) } : {};
    const res = await api.get('/api/alerts', { params });
    return res.data.map((alt: any) => ({
      ...alt,
      is_resolved: alt.status === 'resolved',
    }));
  },
  create: async (payload: AlertCreatePayload): Promise<HealthAlert> => {
    const res = await api.post('/api/alerts', payload);
    return insertedRecord<HealthAlert>(res.data, 'alert');
  },
  resolve: async (alertId: number | string): Promise<HealthAlert> => {
    const res = await api.patch(`/api/alerts/${alertId}/resolve`);
    return {
      ...insertedRecord<HealthAlert>(res.data, 'resolved alert'),
      is_resolved: true,
    };
  },
};

// ─── AI/ML Analysis Service ───
export const aiAnalysisService = {
  getByAstronaut: async (astronautId: number | string): Promise<AnalysisResult[]> => {
    const res = await api.get(`/api/analysis/${astronautId}`);
    return res.data;
  },
  predictCluster: async (payload: AnalysisPredictRequest): Promise<AnalysisPredictResponse> => {
    const res = await api.post('/api/analysis/predict', payload);
    return res.data;
  },
};
