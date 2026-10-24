
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/config';
import { DEPARTMENTS as DEFAULT_DEPARTMENTS, CULTURAL_SUBCATEGORIES as DEFAULT_CULTURAL_SUBS } from '../utils/constants';

const GlobalConfigContext = createContext();

export const useGlobalConfig = () => useContext(GlobalConfigContext);

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

    const fetchConfig = async () => {
        try {
            const [confRes, sponsorsRes, clubsRes, deptsRes, culturalRes] = await Promise.all([
                axios.get(`${API_URL}/upload`).catch(() => ({ data: null })),
                axios.get(`${API_URL}/content/sponsors`).catch(() => ({ data: [] })),
                axios.get(`${API_URL}/content/clubs`).catch(() => ({ data: [] })),
                axios.get(`${API_URL}/content/departments`).catch(() => ({ data: [] })),
                axios.get(`${API_URL}/content/cultural-subcategories`).catch(() => ({ data: [] }))
            ]);

            if (confRes?.data) {
                setConfig(prev => ({
                    ...prev,
                    ...confRes.data
                }));
            }
            if (Array.isArray(sponsorsRes?.data)) setSponsors(sponsorsRes.data);
            if (Array.isArray(clubsRes?.data)) setClubs(clubsRes.data);
            if (Array.isArray(deptsRes?.data) && deptsRes.data.length > 0) setDepartments(deptsRes.data);
            if (Array.isArray(culturalRes?.data) && culturalRes.data.length > 0) setCulturalSubcategories(culturalRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch global config:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return (
        <GlobalConfigContext.Provider value={{
            config,
            sponsors,
            clubs,
            departments,
            culturalSubcategories,
            loading,
            refreshConfig: fetchConfig
        }}>
            {children}
        </GlobalConfigContext.Provider>
    );
};
