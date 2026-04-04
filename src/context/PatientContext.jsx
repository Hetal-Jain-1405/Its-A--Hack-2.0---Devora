import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { tasks } from '../services/api';

const PatientContext = createContext(null);
const STORAGE_KEY = 'cf_patient_id';

export function PatientProvider({ children }) {
  const { isAuth, user } = useAuth();
  const [tick, setTick] = useState(0);

  const setPatientId = useCallback((id) => {
    if (id) localStorage.setItem(STORAGE_KEY, id);
    else localStorage.removeItem(STORAGE_KEY);
    setTick((n) => n + 1);
  }, []);

  const clearPatientOverride = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setTick((n) => n + 1);
  }, []);

  const patientId = useMemo(() => {
    if (!isAuth || !user?.id) return null;
    return localStorage.getItem(STORAGE_KEY) || user.id;
  }, [isAuth, user?.id, tick]);

  useEffect(() => {
    if (!isAuth || !user?.id) return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    let cancelled = false;
    (async () => {
      try {
        const list = await tasks.getAll();
        if (cancelled || !Array.isArray(list) || list.length === 0) return;
        const pid = list[0].patient_id;
        if (pid && typeof pid === 'string') {
          localStorage.setItem(STORAGE_KEY, pid);
          setTick((n) => n + 1);
        }
      } catch {
        /* backend may have no tasks yet — keep user.id as fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuth, user?.id]);

  return (
    <PatientContext.Provider value={{ patientId, setPatientId, clearPatientOverride }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const c = useContext(PatientContext);
  if (!c) throw new Error('usePatient requires PatientProvider');
  return c;
}

export default PatientContext;
