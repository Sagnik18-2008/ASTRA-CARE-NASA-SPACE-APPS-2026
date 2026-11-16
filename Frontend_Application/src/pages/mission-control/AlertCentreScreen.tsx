import { useMemo, useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Info, Plus, RefreshCw, Search, ShieldAlert, X } from 'lucide-react';
import { alertService, astronautService } from '../../services/endpoints';
import { useApi } from '../../hooks/useApi';
import { getApiErrorMessage } from '../../services/api';
import type { AlertCreatePayload, Astronaut, HealthAlert } from '../../types';

const severityStyles: Record<string, string> = {
  critical: 'border-rose-500/40 bg-rose-950/30 text-rose-300',
  high: 'border-amber-500/40 bg-amber-950/30 text-amber-300',
  medium: 'border-yellow-500/40 bg-yellow-950/30 text-yellow-300',
  low: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300',
  info: 'border-slate-500/40 bg-slate-900/50 text-slate-300',
};

export function AlertCentreScreen() {
  const [selectedAstronautId, setSelectedAstronautId] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [resolvingId, setResolvingId] = useState<number | string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [mutationRecords, setMutationRecords] = useState<HealthAlert[]>([]);
  const [newAlert, setNewAlert] = useState<AlertCreatePayload>({
    severity: 'info',
    title: '',
    message: '',
    status: 'open',
  });

  const { data: astronauts, loading: loadingAstronauts, error: astronautError } =
    useApi<Astronaut[]>(() => astronautService.getAll());
  const {
    data: alerts,
    loading: loadingAlerts,
    error: alertError,
    refetch,
  } = useApi<HealthAlert[]>(
    () => alertService.getAll(selectedAstronautId === 'all' ? undefined : selectedAstronautId),
    [selectedAstronautId],
  );

  const allAlerts = useMemo(() => {
    const records = new Map((alerts || []).map((alert) => [String(alert.id), alert]));
    mutationRecords.forEach((alert) => records.set(String(alert.id), alert));
    return Array.from(records.values());
  }, [alerts, mutationRecords]);

  const filteredAlerts = useMemo(() => allAlerts.filter((alert) => {
    const isResolved = alert.status === 'resolved' || alert.is_resolved;
    const matchesText = `${alert.title} ${alert.message || ''}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || alert.severity.toLowerCase() === severityFilter;
    const matchesStatus = statusFilter === 'all'
      || (statusFilter === 'open' && !isResolved)
      || (statusFilter === 'resolved' && isResolved);
    return matchesText && matchesSeverity && matchesStatus;
  }), [allAlerts, searchQuery, severityFilter, statusFilter]);

  const handleResolve = async (alert: HealthAlert) => {
    setResolvingId(alert.id);
    setActionError(null);
    try {
      const updated = await alertService.resolve(alert.id);
      setMutationRecords((previous) => [
        updated,
        ...previous.filter((record) => String(record.id) !== String(updated.id)),
      ]);
      await refetch();
    } catch (error: unknown) {
      setActionError(getApiErrorMessage(error));
    } finally {
      setResolvingId(null);
    }
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setActionError(null);
    try {
      const payload = {
        ...newAlert,
        ...(newAlert.astronaut_id ? { astronaut_id: Number(newAlert.astronaut_id) } : {}),
      };
      const created = await alertService.create(payload);
      setMutationRecords((previous) => [
        created,
        ...previous.filter((record) => String(record.id) !== String(created.id)),
      ]);
      setModalOpen(false);
      setNewAlert({ severity: 'info', title: '', message: '', status: 'open' });
      await refetch();
    } catch (error: unknown) {
      setActionError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCount = allAlerts.filter((alert) => alert.status !== 'resolved' && !alert.is_resolved).length;
  const resolvedCount = allAlerts.length - openCount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/10">
        <div>
          <div className="flex items-center gap-2 mb-1 text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
            <ShieldAlert className="w-4 h-4" />
            <span>DATABASE ALERTS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Alert Centre</h1>
          <p className="text-sm text-slate-400 mt-1">
            Alerts are records from the backend and may include manual or test entries. Severity labels are not clinical assessments.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter by astronaut"
            value={selectedAstronautId}
            onChange={(event) => setSelectedAstronautId(event.target.value)}
            className="bg-slate-900 border border-cyan-500/20 rounded-lg px-3 py-2 text-xs text-white"
          >
            <option value="all">All astronauts</option>
            {astronauts?.map((astronaut) => (
              <option key={astronaut.id} value={astronaut.id}>
                {astronaut.full_name || astronaut.name || `Astronaut #${astronaut.id}`}
              </option>
            ))}
          </select>
          <button
            onClick={() => void refetch()}
            disabled={loadingAlerts}
            aria-label="Refresh alerts"
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loadingAlerts ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => { setActionError(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs"
          >
            <Plus className="w-4 h-4" /> Create alert
          </button>
        </div>
      </header>

      {(alertError || astronautError || actionError) && (
        <div role="alert" className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs">
          {alertError || astronautError || actionError}
        </div>
      )}
      {loadingAstronauts && <p className="text-xs text-slate-400">Loading astronaut records…</p>}

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30">
          <span className="text-xs font-mono text-amber-300">OPEN ALERTS</span>
          <p className="text-3xl font-bold text-white mt-1">{openCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30">
          <span className="text-xs font-mono text-emerald-300">RESOLVED ALERTS</span>
          <p className="text-3xl font-bold text-white mt-1">{resolvedCount}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search title or description"
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
          />
        </div>
        <div className="flex gap-2">
          <select value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white">
            {['all', 'critical', 'high', 'medium', 'low', 'info'].map((severity) => <option key={severity}>{severity}</option>)}
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white">
            {['all', 'open', 'resolved'].map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>
      </div>

      {loadingAlerts && <p className="text-sm text-slate-400">Loading alerts…</p>}
      {!loadingAlerts && !alertError && filteredAlerts.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800 text-slate-400 text-sm">
          No alerts match the selected filters.
        </div>
      )}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const resolved = alert.status === 'resolved' || alert.is_resolved;
          const severityClass = severityStyles[alert.severity.toLowerCase()] || severityStyles.info;
          const SeverityIcon = alert.severity === 'critical' ? AlertTriangle : alert.severity === 'high' ? AlertCircle : Info;
          return (
            <article key={alert.id} className={`p-5 rounded-2xl border ${resolved ? 'opacity-70 border-slate-800 bg-slate-950/40' : severityClass}`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex gap-3">
                  <SeverityIcon className="w-5 h-5 mt-1 shrink-0" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase">
                      <span>{alert.severity}</span>
                      <span className="text-slate-500">#{alert.id}</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.created_at ? new Date(alert.created_at).toLocaleString() : 'Timestamp unavailable'}
                      </span>
                      {resolved && <span className="text-emerald-300 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Resolved</span>}
                    </div>
                    <h2 className="text-base font-bold text-white mt-1">{alert.title}</h2>
                    {alert.message && <p className="text-sm text-slate-300 mt-1">{alert.message}</p>}
                    {alert.resolved_at && <p className="text-[10px] text-slate-500 mt-2">Resolved: {new Date(alert.resolved_at).toLocaleString()}</p>}
                  </div>
                </div>
                {!resolved && (
                  <button
                    onClick={() => void handleResolve(alert)}
                    disabled={resolvingId === alert.id}
                    className="px-3 py-2 rounded-lg border border-emerald-500/40 text-emerald-300 text-xs disabled:opacity-50"
                  >
                    {resolvingId === alert.id ? 'Saving…' : 'Mark resolved'}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-cyan-500/30 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">Create database alert</h2>
              <button onClick={() => setModalOpen(false)} aria-label="Close dialog" className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <p className="mt-3 text-xs text-slate-400">Manually entered record; this does not create an automated clinical alert.</p>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <label className="block text-xs text-slate-400">
                Astronaut
                <select
                  value={newAlert.astronaut_id ?? ''}
                  onChange={(event) => setNewAlert((current) => ({
                    ...current,
                    astronaut_id: event.target.value ? Number(event.target.value) : undefined,
                  }))}
                  className="mt-1 w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  <option value="">All / not specified</option>
                  {astronauts?.map((astronaut) => <option key={astronaut.id} value={astronaut.id}>{astronaut.full_name || astronaut.name || `#${astronaut.id}`}</option>)}
                </select>
              </label>
              <label className="block text-xs text-slate-400">
                Severity
                <select value={newAlert.severity} onChange={(event) => setNewAlert((current) => ({ ...current, severity: event.target.value }))} className="mt-1 w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white">
                  {['info', 'low', 'medium', 'high', 'critical'].map((severity) => <option key={severity}>{severity}</option>)}
                </select>
              </label>
              <label className="block text-xs text-slate-400">
                Title
                <input required value={newAlert.title} onChange={(event) => setNewAlert((current) => ({ ...current, title: event.target.value }))} className="mt-1 w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white" />
              </label>
              <label className="block text-xs text-slate-400">
                Description
                <textarea value={newAlert.message || ''} onChange={(event) => setNewAlert((current) => ({ ...current, message: event.target.value }))} rows={3} className="mt-1 w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white" />
              </label>
              {actionError && <p role="alert" className="text-xs text-rose-300">{actionError}</p>}
              <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-xs text-slate-300">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs disabled:opacity-50">
                  {isSubmitting ? 'Saving…' : 'Create alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlertCentreScreen;
