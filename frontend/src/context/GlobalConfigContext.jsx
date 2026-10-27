import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/config';
import { DEPARTMENTS as DEFAULT_DEPARTMENTS, CULTURAL_SUBCATEGORIES as DEFAULT_CULTURAL_SUBS } from '../utils/constants';

const GlobalConfigContext = createContext();

export const useGlobalConfig = () => useContext(GlobalConfigContext);

const CACHE_KEY = 'kalam_bootstrap_cache';
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes client-side session cache

export const GlobalConfigProvider = ({ children }) => {
    const [config, setConfig] = useState({
        website_name: 'Kalam',
        event_year: '2026',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        navbar_logo: null
    });
    const [sponsors, setSponsors] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [departments, setDepartments] = useState(DEFAULT_DEPARTMENTS);
    const [culturalSubcategories, setCulturalSubcategories] = useState(DEFAULT_CULTURAL_SUBS);
    const [loading, setLoading] = useState(true);

    const applyPayload = useCallback((data) => {
        if (!data) return;
        if (data.config) {
            setConfig(prev => ({ ...prev, ...data.config }));
        }
        if (Array.isArray(data.sponsors)) setSponsors(data.sponsors);
        if (Array.isArray(data.clubs)) setClubs(data.clubs);
        if (Array.isArray(data.departments) && data.departments.length > 0) setDepartments(data.departments);
        if (Array.isArray(data.culturalSubcategories) && data.culturalSubcategories.length > 0) setCulturalSubcategories(data.culturalSubcategories);
        setLoading(false);
    }, []);

    const fetchConfig = useCallback(async (bypassCache = false) => {
        // 1. Try reading from sessionStorage unless bypassing cache
        if (!bypassCache && typeof window !== 'undefined' && window.sessionStorage) {
            try {
                const cachedRaw = sessionStorage.getItem(CACHE_KEY);
                if (cachedRaw) {
                    const cached = JSON.parse(cachedRaw);
                    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS) && cached.payload) {
                        applyPayload(cached.payload);
                        return;
                    }
                }
            } catch (e) {
                // Ignore storage parse errors
            }
        }

        // 2. Fetch using high-efficiency consolidated bootstrap endpoint
        try {
            const bootstrapRes = await axios.get(`${API_URL}/content/bootstrap`);
            if (bootstrapRes?.data) {
                applyPayload(bootstrapRes.data);
                // Save to sessionStorage
                try {
                    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
                        timestamp: Date.now(),
                        payload: bootstrapRes.data
                    }));
                } catch {}
                return;
            }
        } catch (bootstrapErr) {
            // Fallback to legacy individual requests if bootstrap route is unavailable
        }

        // 3. Graceful fallback (legacy parallel requests)
        try {
            const [confRes, sponsorsRes, clubsRes, deptsRes, culturalRes] = await Promise.all([
                axios.get(`${API_URL}/upload`).catch(() => ({ data: null })),
                axios.get(`${API_URL}/content/sponsors`).catch(() => ({ data: [] })),
                axios.get(`${API_URL}/content/clubs`).catch(() => ({ data: [] })),
                axios.get(`${API_URL}/content/departments`).catch(() => ({ data: [] })),
                axios.get(`${API_URL}/content/cultural-subcategories`).catch(() => ({ data: [] }))
            ]);

            const payload = {
                config: confRes?.data || {},
                sponsors: sponsorsRes?.data || [],
                clubs: clubsRes?.data || [],
                departments: deptsRes?.data || [],
                culturalSubcategories: culturalRes?.data || []
            };

            applyPayload(payload);

            try {
                sessionStorage.setItem(CACHE_KEY, JSON.stringify({
                    timestamp: Date.now(),
                    payload
                }));
            } catch {}
        } catch (error) {
            console.error("Failed to fetch global config:", error);
            setLoading(false);
        }
    }, [applyPayload]);

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    const refreshConfig = useCallback(() => {
        try {
            sessionStorage.removeItem(CACHE_KEY);
        } catch {}
        return fetchConfig(true);
    }, [fetchConfig]);

    return (
        <GlobalConfigContext.Provider value={{
            config,
            sponsors,
            clubs,
            departments,
            culturalSubcategories,
            loading,
            refreshConfig
        }}>
            {children}
        </GlobalConfigContext.Provider>
    );
};
