import { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import {
    Image as ImageIcon,
    Video as VideoIcon,
    Save,
    Loader as LoaderIcon,
    Link as LinkIcon,
    ExternalLink,
    UploadCloud,
    Trash2,
    Sparkles,
    Eye,
    Check,
    RefreshCw,
    X,
    SlidersHorizontal,
    Compass,
    Layers,
    Play,
    LayoutGrid,
    Search,
    Smartphone,
    Monitor
} from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import { API_URL } from '../utils/config';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { isVideoUrl } from '../components/PageBackground';
import { DEPARTMENTS, CULTURAL_SUBCATEGORIES } from '../utils/constants';

// All configurable sections categorized
const PAGE_BACKGROUNDS = [
    {
        key: 'global_bg',
        label: 'Global Default Background (All Pages)',
        targetPath: '/',
        description: 'Universal fallback background image applied across all pages unless overridden.',
        placeholder: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
        samplePreset: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
        mobilePlaceholder: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        mobileSamplePreset: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        typeHint: 'image',
        hasMobile: true
    },
    {
        key: 'about_bg',
        label: 'About Page Background',
        targetPath: '/about',
        description: 'Background for About KCE, Institution legacy, and Festival vision.',
        placeholder: 'https://ik.imagekit.io/kalam/About%20Page/Cosmic%20Ocean%20of%20Future%20Waves.png',
        samplePreset: 'https://ik.imagekit.io/kalam/About%20Page/Cosmic%20Ocean%20of%20Future%20Waves.png',
        mobilePlaceholder: 'https://ik.imagekit.io/kalam/About%20Page/Cosmic%20Ocean%20of%20Future%20Waves.png',
        mobileSamplePreset: 'https://ik.imagekit.io/kalam/About%20Page/Cosmic%20Ocean%20of%20Future%20Waves.png',
        typeHint: 'image',
        hasMobile: true
    },
    {
        key: 'passes_bg',
        label: 'Passes Page Background',
        targetPath: '/passes',
        description: 'Background for Admission tiers, Privilege passes, and ticketing grid.',
        placeholder: 'https://ik.imagekit.io/kalam/Hero/Neon%20Crystal%20Sci-Fi%20Void.png',
        samplePreset: 'https://ik.imagekit.io/kalam/Hero/Neon%20Crystal%20Sci-Fi%20Void.png',
        mobilePlaceholder: 'https://ik.imagekit.io/kalam/Hero/Neon%20Crystal%20Sci-Fi%20Void.png',
        mobileSamplePreset: 'https://ik.imagekit.io/kalam/Hero/Neon%20Crystal%20Sci-Fi%20Void.png',
        typeHint: 'image',
        hasMobile: true
    },
    {
        key: 'events_bg',
        label: 'Technical Events Track Background',
        targetPath: '/#technical-events',
        description: 'Background for Technical Events track, Hackathons, Workshops, and Category Cards.',
        placeholder: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
        samplePreset: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
        mobilePlaceholder: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        mobileSamplePreset: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        typeHint: 'image',
        hasMobile: true
    },
    {
        key: 'cultural_events_bg',
        label: 'Cultural Events Track Background',
        targetPath: '/#cultural-events',
        description: 'Atmospheric stage and festival lighting background for Cultural Events track & showcase.',
        placeholder: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80',
        samplePreset: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80',
        mobilePlaceholder: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
        mobileSamplePreset: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
        typeHint: 'image',
        hasMobile: true
    },
    {
        key: 'highlights_bg',
        label: 'Festival Highlights Background',
        targetPath: '/#highlights',
        description: 'Background for KCE KALAM Legacy, Key Highlights, and past festival moments.',
        placeholder: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1920&q=80',
        samplePreset: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1920&q=80',
        mobilePlaceholder: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
        mobileSamplePreset: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
        typeHint: 'image',
        hasMobile: true
    },
    {
        key: 'event_detail_bg',
        label: 'Event Details Background',
        targetPath: '/events',
        description: 'Background for Individual event descriptions, guidelines, rules, and rounds.',
        placeholder: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=1920&q=80',
        samplePreset: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=1920&q=80',
        mobilePlaceholder: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80',
        mobileSamplePreset: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80',
        typeHint: 'image',
        hasMobile: true
    },
    {
        key: 'register_bg',
        label: 'Registration & Checkout Background',
        targetPath: '/select-events',
        description: 'Background for Student registration, pass checkout, and payment processing.',
        placeholder: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
        samplePreset: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
        mobilePlaceholder: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        mobileSamplePreset: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        typeHint: 'image',
        hasMobile: true
    },
    {
        key: 'home_bg',
        label: 'Home Page Background (Optional)',
        targetPath: '/',
        description: 'Optional full-page backdrop (disabled by default so sections have independent backgrounds).',
        placeholder: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
        samplePreset: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
        mobilePlaceholder: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        mobileSamplePreset: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        typeHint: 'image',
        hasMobile: true
    }
];

const BRANDING_SECTIONS = [
    {
        key: 'navbar_logo',
        label: 'Navbar Logo',
        targetPath: '/',
        description: 'Small branding emblem in the top navigation bar header (PNG/SVG transparent recommended).',
        placeholder: 'https://example.com/logo.png',
        samplePreset: '',
        typeHint: 'image'
    },
    {
        key: 'home_hero_bg',
        label: 'Home Hero Banner Background (Optional)',
        targetPath: '/',
        description: 'Hero banner backdrop for the home greeting portal (Desktop & Mobile supported).',
        placeholder: 'https://ik.imagekit.io/kalam/Hero/Celestial%20Blue%20Arena%20Portal.png',
        samplePreset: 'https://ik.imagekit.io/kalam/Hero/Celestial%20Blue%20Arena%20Portal.png',
        mobilePlaceholder: 'https://ik.imagekit.io/kalam/Hero/Celestial%20Blue%20Arena%20Portal.png',
        typeHint: 'image',
        hasMobile: true
    },
    {
        key: 'footer_bg',
        label: 'Footer Atmospheric Background',
        targetPath: '/',
        description: 'Deep cosmic starfield backdrop for the sponsors and footer section (Desktop & Mobile).',
        placeholder: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
        samplePreset: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
        mobilePlaceholder: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
        typeHint: 'image',
        hasMobile: true
    },
    {
        key: 'footer_bg_video',
        label: 'Footer Background Video (Optional)',
        targetPath: '/',
        description: 'Optional atmospheric video loop playing in the footer of the website (mp4/webm).',
        placeholder: 'https://example.com/video.mp4',
        samplePreset: '',
        typeHint: 'video',
        hasMobile: true
    }
];

const CURATED_PRESETS = [
    {
        title: 'Deep Cosmic Nebula (Desktop)',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
        tag: 'Space / Nebula (16:9)'
    },
    {
        title: 'Deep Cosmic Nebula (Mobile)',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
        tag: 'Space / Nebula (9:16)'
    },
    {
        title: 'Techno Digital Grid (Desktop)',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
        tag: 'Tech / Innovation (16:9)'
    },
    {
        title: 'Techno Digital Grid (Mobile)',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        tag: 'Tech / Innovation (9:16)'
    },
    {
        title: 'Cultural Stage Glow (Desktop)',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80',
        tag: 'Cultural / Concert (16:9)'
    },
    {
        title: 'Cultural Stage Glow (Mobile)',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
        tag: 'Cultural / Concert (9:16)'
    },
    {
        title: 'High-Tech Operations Admin (Desktop)',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80',
        tag: 'Admin / Command (16:9)'
    },
    {
        title: 'High-Tech Operations Admin (Mobile)',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        tag: 'Admin / Command (9:16)'
    }
];

const PRIMARY_TRACK_CARDS = [
    {
        key: 'technical_card_image',
        aliasKey: 'cat_technical_image',
        label: 'Technical Fest Main Card',
        targetPath: '/#technical-events',
        description: 'Large flagship card poster displayed on the homepage Event Arena for Technical Events, Workshops & Hackathons.',
        placeholder: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        samplePreset: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        typeHint: 'image',
        categoryGroup: 'tracks',
        badgeText: 'Main Track Card',
        badgeColor: '#24BCE0'
    },
    {
        key: 'cultural_card_image',
        aliasKey: 'cat_cultural_image',
        label: 'Cultural Fest Main Card',
        targetPath: '/#cultural-events',
        description: 'Large flagship card poster displayed on the homepage Event Arena for Cultural Showcase, Live Stages & Arts.',
        placeholder: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        samplePreset: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        typeHint: 'image',
        categoryGroup: 'tracks',
        badgeText: 'Main Track Card',
        badgeColor: '#D62C76'
    }
];

const ManageImages = () => {
    const { refreshConfig } = useGlobalConfig();
    const [configs, setConfigs] = useState({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});
    const [uploading, setUploading] = useState({});
    const [message, setMessage] = useState(null);
    const [inputs, setInputs] = useState({});
    const [activeTab, setActiveTab] = useState('cards'); // 'cards' | 'backgrounds' | 'branding' | 'presets'
    const [globalDeviceFilter, setGlobalDeviceFilter] = useState('desktop'); // 'desktop' | 'mobile'
    const [cardDeviceModes, setCardDeviceModes] = useState({}); // sectionKey -> 'desktop' | 'mobile'
    const [cardSubFilter, setCardSubFilter] = useState('all'); // 'all' | 'tracks' | 'technical' | 'cultural'
    const [cardSearchQuery, setCardSearchQuery] = useState('');
    const [departmentsList, setDepartmentsList] = useState([]);
    const [culturalSubsList, setCulturalSubsList] = useState([]);
    const [simulateModal, setSimulateModal] = useState(null); // section object to simulate
    const [simDevice, setSimDevice] = useState('desktop'); // 'desktop' | 'mobile'
    const fileInputRefs = useRef({});

    // Dynamic Card Sections List (Tracks + Departments + Cultural Categories)
    const allCardSections = useMemo(() => {
        const list = [...PRIMARY_TRACK_CARDS];

        // Technical categories: dynamic list from database or default
        const activeTechCats = (Array.isArray(departmentsList) && departmentsList.length > 0)
            ? departmentsList
            : DEPARTMENTS;

        activeTechCats.forEach(dept => {
            list.push({
                key: `dept_${dept.code}_image`,
                deptCode: dept.code,
                label: `${dept.name || dept.code} — Category Card`,
                targetPath: `/?cat=Technical&dept=${encodeURIComponent(dept.code)}`,
                description: `${dept.name} card poster displayed in Level 2 Technical Categories.`,
                placeholder: dept.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
                samplePreset: dept.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
                typeHint: 'image',
                categoryGroup: 'technical',
                badgeText: 'Technical Category',
                badgeColor: '#24BCE0',
                docId: dept._id
            });
        });

        // Cultural subcategories: merge default CULTURAL_SUBCATEGORIES with custom subcategories
        const mergedSubs = [...CULTURAL_SUBCATEGORIES];
        if (Array.isArray(culturalSubsList)) {
            culturalSubsList.forEach(sub => {
                const idx = mergedSubs.findIndex(item => item.code?.toLowerCase() === sub.code?.toLowerCase());
                if (idx >= 0) {
                    mergedSubs[idx] = { ...mergedSubs[idx], ...sub };
                } else {
                    mergedSubs.push(sub);
                }
            });
        }
        mergedSubs.forEach(sub => {
            const code = sub.code || sub.type;
            const defaultImg = sub.image || (code === 'OffStage' ? 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80');
            list.push({
                key: `cultural_${code}_image`,
                subCode: code,
                label: `${sub.name || code} — Cultural Category Card`,
                targetPath: `/?cat=Cultural&type=${encodeURIComponent(code)}`,
                description: `Category card poster displayed in Level 2 Cultural Categories.`,
                placeholder: defaultImg,
                samplePreset: defaultImg,
                typeHint: 'image',
                categoryGroup: 'cultural',
                badgeText: 'Cultural Category',
                badgeColor: '#D62C76',
                docId: sub._id
            });
        });

        return list;
    }, [departmentsList, culturalSubsList]);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            setLoading(true);
            const [uploadRes, deptsRes, culturalRes] = await Promise.all([
                axios.get(`${API_URL}/upload`),
                axios.get(`${API_URL}/content/departments`).catch(() => ({ data: [] })),
                axios.get(`${API_URL}/content/cultural-subcategories`).catch(() => ({ data: [] }))
            ]);

            const data = uploadRes.data || {};
            setConfigs(data);

            const activeTechCats = (Array.isArray(deptsRes.data) && deptsRes.data.length > 0)
                ? deptsRes.data
                : DEPARTMENTS;

            const mergedSubs = [...CULTURAL_SUBCATEGORIES];
            if (Array.isArray(culturalRes.data)) {
                culturalRes.data.forEach(s => {
                    const idx = mergedSubs.findIndex(item => item.code?.toLowerCase() === s.code?.toLowerCase());
                    if (idx >= 0) {
                        mergedSubs[idx] = { ...mergedSubs[idx], ...s };
                    } else {
                        mergedSubs.push(s);
                    }
                });
            }

            setDepartmentsList(activeTechCats);
            setCulturalSubsList(mergedSubs);

            const allSections = [...PAGE_BACKGROUNDS, ...BRANDING_SECTIONS, ...PRIMARY_TRACK_CARDS];
            const initialInputs = {};
            allSections.forEach(s => {
                initialInputs[s.key] = data[s.key] || (s.aliasKey ? data[s.aliasKey] : '') || '';
                if (s.hasMobile) {
                    const mobKey = `${s.key}_mobile`;
                    initialInputs[mobKey] = data[mobKey] || '';
                }
            });

            activeTechCats.forEach(d => {
                const k = `dept_${d.code}_image`;
                initialInputs[k] = data[k] || d.image || '';
            });

            mergedSubs.forEach(s => {
                const k = `cultural_${s.code}_image`;
                initialInputs[k] = data[k] || s.image || '';
            });

            setInputs(initialInputs);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch configs:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (key, value) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    };

    const getAuthConfig = () => {
        const token = localStorage.getItem('adminToken');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const handleSave = async (key) => {
        setUpdating(prev => ({ ...prev, [key]: true }));
        setMessage(null);

        try {
            const urlToSave = (inputs[key] || '').trim();
            const isVideo = isVideoUrl(urlToSave);
            const type = isVideo ? 'video' : 'image';

            await axios.post(
                `${API_URL}/content/config`,
                { key, value: urlToSave, type },
                getAuthConfig()
            );

            // Cross-sync track alias keys
            if (key === 'technical_card_image') {
                await axios.post(`${API_URL}/content/config`, { key: 'cat_technical_image', value: urlToSave, type }, getAuthConfig()).catch(() => {});
            } else if (key === 'cultural_card_image') {
                await axios.post(`${API_URL}/content/config`, { key: 'cat_cultural_image', value: urlToSave, type }, getAuthConfig()).catch(() => {});
            }

            // Sync Department model if applicable
            if (key.startsWith('dept_') && key.endsWith('_image')) {
                const code = key.replace('dept_', '').replace('_image', '');
                const depts = departmentsList.length > 0 ? departmentsList : DEPARTMENTS;
                const foundDept = depts.find(d => d.code === code);
                if (foundDept && foundDept._id) {
                    await axios.put(`${API_URL}/content/departments/${foundDept._id}`, { ...foundDept, image: urlToSave }, getAuthConfig()).catch(() => {});
                }
            }

            // Sync Cultural Subcategory model if applicable
            if (key.startsWith('cultural_') && key.endsWith('_image')) {
                const code = key.replace('cultural_', '').replace('_image', '');
                const subs = culturalSubsList.length > 0 ? culturalSubsList : CULTURAL_SUBCATEGORIES;
                const foundSub = subs.find(s => s.code === code);
                if (foundSub && foundSub._id) {
                    await axios.put(`${API_URL}/content/cultural-subcategories/${foundSub._id}`, { ...foundSub, image: urlToSave }, getAuthConfig()).catch(() => {});
                }
            }

            setConfigs(prev => ({ ...prev, [key]: urlToSave }));
            setUpdating(prev => ({ ...prev, [key]: false }));
            setMessage({
                type: 'success',
                text: `Successfully saved ${key.replace(/_/g, ' ')}!`
            });

            if (refreshConfig) refreshConfig();
        } catch (error) {
            console.error('Save failed:', error);
            setUpdating(prev => ({ ...prev, [key]: false }));
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
                window.location.href = '/login';
            } else {
                setMessage({
                    type: 'error',
                    text: error.response?.data?.message || 'Failed to update configuration.'
                });
            }
        }
    };

    const handleDeleteImage = async (key, label) => {
        const isMobileKey = key.endsWith('_mobile');
        const deviceType = isMobileKey ? 'mobile' : 'desktop';
        const displayLabel = label || key.replace(/_/g, ' ');
        const confirmed = window.confirm(
            `Are you sure you want to delete the ${deviceType} image for "${displayLabel}"?\n\nThis will remove the current media and reset this section to its default design.`
        );
        if (!confirmed) return;

        setUpdating(prev => ({ ...prev, [key]: true }));
        setMessage(null);

        try {
            await axios.post(
                `${API_URL}/content/config`,
                { key, value: '', type: 'image' },
                getAuthConfig()
            );

            // Cross-sync track alias keys if applicable
            if (key === 'technical_card_image' || key === 'cat_technical_image') {
                await Promise.all([
                    axios.post(`${API_URL}/content/config`, { key: 'technical_card_image', value: '', type: 'image' }, getAuthConfig()).catch(() => {}),
                    axios.post(`${API_URL}/content/config`, { key: 'cat_technical_image', value: '', type: 'image' }, getAuthConfig()).catch(() => {})
                ]);
            } else if (key === 'cultural_card_image' || key === 'cat_cultural_image') {
                await Promise.all([
                    axios.post(`${API_URL}/content/config`, { key: 'cultural_card_image', value: '', type: 'image' }, getAuthConfig()).catch(() => {}),
                    axios.post(`${API_URL}/content/config`, { key: 'cat_cultural_image', value: '', type: 'image' }, getAuthConfig()).catch(() => {})
                ]);
            }

            // Sync Department model if applicable
            if (key.startsWith('dept_') && key.endsWith('_image')) {
                const code = key.replace('dept_', '').replace('_image', '');
                const depts = departmentsList.length > 0 ? departmentsList : DEPARTMENTS;
                const foundDept = depts.find(d => d.code === code);
                if (foundDept && foundDept._id) {
                    await axios.put(`${API_URL}/content/departments/${foundDept._id}`, { ...foundDept, image: '' }, getAuthConfig()).catch(() => {});
                }
            }

            // Sync Cultural Subcategory model if applicable
            if (key.startsWith('cultural_') && key.endsWith('_image')) {
                const code = key.replace('cultural_', '').replace('_image', '');
                const subs = culturalSubsList.length > 0 ? culturalSubsList : CULTURAL_SUBCATEGORIES;
                const foundSub = subs.find(s => s.code === code);
                if (foundSub && foundSub._id) {
                    await axios.put(`${API_URL}/content/cultural-subcategories/${foundSub._id}`, { ...foundSub, image: '' }, getAuthConfig()).catch(() => {});
                }
            }

            setInputs(prev => ({ ...prev, [key]: '' }));
            setConfigs(prev => ({ ...prev, [key]: '' }));
            setUpdating(prev => ({ ...prev, [key]: false }));

            setMessage({
                type: 'success',
                text: `Deleted image for "${displayLabel}" (${deviceType}). Reset to default!`
            });

            if (refreshConfig) refreshConfig();
        } catch (error) {
            console.error('Delete failed:', error);
            setUpdating(prev => ({ ...prev, [key]: false }));
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to delete image.'
            });
        }
    };

    const handleDeleteBothImages = async (section) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete BOTH desktop and mobile images for "${section.label}"?\n\nThis will remove all custom media for this section and reset to default template.`
        );
        if (!confirmed) return;

        const desktopKey = section.key;
        const mobileKey = `${section.key}_mobile`;
        setUpdating(prev => ({ ...prev, [desktopKey]: true, [mobileKey]: true }));
        setMessage(null);

        try {
            await Promise.all([
                axios.post(`${API_URL}/content/config`, { key: desktopKey, value: '', type: 'image' }, getAuthConfig()),
                axios.post(`${API_URL}/content/config`, { key: mobileKey, value: '', type: 'image' }, getAuthConfig())
            ]);

            setInputs(prev => ({ ...prev, [desktopKey]: '', [mobileKey]: '' }));
            setConfigs(prev => ({ ...prev, [desktopKey]: '', [mobileKey]: '' }));
            setUpdating(prev => ({ ...prev, [desktopKey]: false, [mobileKey]: false }));

            setMessage({
                type: 'success',
                text: `Deleted both desktop & mobile images for "${section.label}". Reset to default!`
            });

            if (refreshConfig) refreshConfig();
        } catch (error) {
            console.error('Delete both failed:', error);
            setUpdating(prev => ({ ...prev, [desktopKey]: false, [mobileKey]: false }));
            setMessage({
                type: 'error',
                text: 'Failed to delete images.'
            });
        }
    };

    const handleFileUpload = async (key, file) => {
        if (!file) return;

        setUploading(prev => ({ ...prev, [key]: true }));
        setMessage(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.post(`${API_URL}/upload/${key}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            const uploadedUrl = res.data.data?.value || res.data.url;
            setInputs(prev => ({ ...prev, [key]: uploadedUrl }));
            setConfigs(prev => ({ ...prev, [key]: uploadedUrl }));

            // Cross-sync track alias keys
            if (key === 'technical_card_image') {
                await axios.post(`${API_URL}/content/config`, { key: 'cat_technical_image', value: uploadedUrl, type: 'image' }, getAuthConfig()).catch(() => {});
            } else if (key === 'cultural_card_image') {
                await axios.post(`${API_URL}/content/config`, { key: 'cat_cultural_image', value: uploadedUrl, type: 'image' }, getAuthConfig()).catch(() => {});
            }

            // Sync Department model if applicable
            if (key.startsWith('dept_') && key.endsWith('_image')) {
                const code = key.replace('dept_', '').replace('_image', '');
                const depts = departmentsList.length > 0 ? departmentsList : DEPARTMENTS;
                const foundDept = depts.find(d => d.code === code);
                if (foundDept && foundDept._id) {
                    await axios.put(`${API_URL}/content/departments/${foundDept._id}`, { ...foundDept, image: uploadedUrl }, getAuthConfig()).catch(() => {});
                }
            }

            // Sync Cultural Subcategory model if applicable
            if (key.startsWith('cultural_') && key.endsWith('_image')) {
                const code = key.replace('cultural_', '').replace('_image', '');
                const subs = culturalSubsList.length > 0 ? culturalSubsList : CULTURAL_SUBCATEGORIES;
                const foundSub = subs.find(s => s.code === code);
                if (foundSub && foundSub._id) {
                    await axios.put(`${API_URL}/content/cultural-subcategories/${foundSub._id}`, { ...foundSub, image: uploadedUrl }, getAuthConfig()).catch(() => {});
                }
            }

            setUploading(prev => ({ ...prev, [key]: false }));
            setMessage({
                type: 'success',
                text: `Uploaded and saved media for ${key.replace(/_/g, ' ')}!`
            });
            if (refreshConfig) refreshConfig();
        } catch (error) {
            console.error('File upload error:', error);
            setUploading(prev => ({ ...prev, [key]: false }));
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'File upload failed. Ensure format is JPG/PNG/WebP/MP4.'
            });
        }
    };

    const applyPresetToSection = (key, presetUrl) => {
        handleInputChange(key, presetUrl);
        setMessage({
            type: 'info',
            text: `Applied preset URL to ${key.replace(/_/g, ' ')}. Click Save to persist!`
        });
    };

    const activeSections = useMemo(() => {
        if (activeTab === 'backgrounds') return PAGE_BACKGROUNDS;
        if (activeTab === 'branding') return BRANDING_SECTIONS;
        if (activeTab === 'cards') {
            let items = allCardSections;
            if (cardSubFilter !== 'all') {
                items = items.filter(s => s.categoryGroup === cardSubFilter);
            }
            if (cardSearchQuery.trim()) {
                const q = cardSearchQuery.toLowerCase();
                items = items.filter(s =>
                    (s.label || '').toLowerCase().includes(q) ||
                    (s.description || '').toLowerCase().includes(q) ||
                    (s.key || '').toLowerCase().includes(q) ||
                    (s.deptCode || '').toLowerCase().includes(q)
                );
            }
            return items;
        }
        return [];
    }, [activeTab, allCardSections, cardSubFilter, cardSearchQuery]);

    // Count statistics
    const totalSlots = PAGE_BACKGROUNDS.length + BRANDING_SECTIONS.length + allCardSections.length;
    const configuredCount = Object.keys(configs).filter(k => configs[k] && configs[k].trim()).length;

    return (
        <div className="flex min-h-screen bg-[#14050E] text-white font-body flex-col md:flex-row">
            <Sidebar />

            <div className="flex-1 flex flex-col lg:ml-64">
                <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 max-w-7xl relative z-10">
                    {/* Header Banner */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D62C76]/15 border border-[#D62C76]/30 text-[#24BCE0] text-xs font-semibold uppercase tracking-wider mb-2">
                                <Sparkles size={13} className="text-[#F2D10A]" />
                                Admin Media & Dynamic Backgrounds
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#F2D10A] via-[#F47721] to-[#D62C76]">
                                Page Backgrounds & Media
                            </h1>
                            <p className="text-sm text-[#D8D4F0]/70 mt-1 max-w-2xl">
                                Configure high-definition background images and looping videos for all pages, hero banners, and site logos.
                                Provide an image/video URL or upload directly with instant live preview.
                            </p>
                        </div>

                        {/* Top Action Pills */}
                        <div className="flex items-center gap-3">
                            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
                                <Layers size={18} className="text-[#24BCE0]" />
                                <div className="text-xs">
                                    <span className="text-gray-400 block">Custom Media</span>
                                    <span className="font-bold text-white text-sm">{configuredCount} / {totalSlots} active</span>
                                </div>
                            </div>
                            <button
                                onClick={fetchConfigs}
                                disabled={loading}
                                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-colors"
                                title="Refresh Configurations"
                            >
                                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>
                    </div>

                    {/* Alert Toast Notification */}
                    {message && (
                        <div
                            className={`p-4 rounded-xl mb-6 flex items-center justify-between gap-3 border shadow-lg backdrop-blur-md animate-fadeInUp ${
                                message.type === 'success'
                                    ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/40'
                                    : message.type === 'info'
                                    ? 'bg-blue-500/15 text-blue-200 border-blue-500/40'
                                    : 'bg-red-500/15 text-red-200 border-red-500/40'
                            }`}
                        >
                            <span className="text-sm font-medium">{message.text}</span>
                            <button
                                onClick={() => setMessage(null)}
                                className="p-1 text-white/60 hover:text-white rounded"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {/* Tab Navigation */}
                    <div className="flex flex-wrap items-center gap-2 mb-6 bg-[#180614]/80 p-1.5 rounded-2xl border border-white/10 max-w-4xl">
                        <button
                            onClick={() => setActiveTab('cards')}
                            className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'cards'
                                    ? 'bg-gradient-to-r from-[#24BCE0] via-[#F2D10A] to-[#D62C76] text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <LayoutGrid size={16} />
                            <span>Event & Category Cards ({allCardSections.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('backgrounds')}
                            className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'backgrounds'
                                    ? 'bg-gradient-to-r from-[#D62C76] to-[#F47721] text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <ImageIcon size={16} />
                            <span>Page Backgrounds ({PAGE_BACKGROUNDS.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('branding')}
                            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'branding'
                                    ? 'bg-gradient-to-r from-[#D62C76] to-[#F47721] text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <SlidersHorizontal size={16} />
                            <span>Branding & Assets ({BRANDING_SECTIONS.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('presets')}
                            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'presets'
                                    ? 'bg-gradient-to-r from-[#24BCE0] to-[#D62C76] text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Sparkles size={16} />
                            <span>Sample Library ({CURATED_PRESETS.length})</span>
                        </button>
                    </div>

                    {/* Sub-Filters and Live Search for Event & Category Cards */}
                    {activeTab === 'cards' && (
                        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-8 bg-[#180614]/70 p-3 rounded-2xl border border-white/10 animate-fadeInUp">
                            {/* Category Filter Pills */}
                            <div className="flex flex-wrap items-center gap-1.5">
                                {[
                                    { id: 'all', label: `All Cards (${allCardSections.length})` },
                                    { id: 'tracks', label: `Main Tracks (${allCardSections.filter(s => s.categoryGroup === 'tracks').length})` },
                                    { id: 'technical', label: `Technical Categories (${allCardSections.filter(s => s.categoryGroup === 'technical').length})` },
                                    { id: 'cultural', label: `Cultural Categories (${allCardSections.filter(s => s.categoryGroup === 'cultural').length})` }
                                ].map(f => (
                                    <button
                                        key={f.id}
                                        type="button"
                                        onClick={() => setCardSubFilter(f.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                            cardSubFilter === f.id
                                                ? 'bg-[#24BCE0] text-black font-bold shadow-md'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>

                            {/* Search Filter Box */}
                            <div className="relative w-full md:w-72">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={cardSearchQuery}
                                    onChange={(e) => setCardSearchQuery(e.target.value)}
                                    placeholder="Filter cards by name or code..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#24BCE0] transition-colors"
                                />
                                {cardSearchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setCardSearchQuery('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Presets Library Tab */}
                    {activeTab === 'presets' && (
                        <div className="mb-10 animate-fadeInUp">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                    <Sparkles className="text-[#F2D10A]" size={20} />
                                    Curated Sci-Fi & Cosmic Presets
                                </h3>
                                <p className="text-sm text-gray-400 mb-6">
                                    Copy or preview these free-to-use high-resolution cosmic images and video loops to test your backgrounds immediately.
                                </p>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
                                    {CURATED_PRESETS.map((preset, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-black/50 border border-white/10 rounded-xl overflow-hidden group hover:border-[#24BCE0]/50 transition-all flex flex-col"
                                        >
                                            <div className="h-44 relative bg-black/60 flex items-center justify-center overflow-hidden">
                                                {preset.type === 'video' ? (
                                                    <video
                                                        src={preset.url}
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <img
                                                        src={preset.url}
                                                        alt={preset.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                )}
                                                <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#24BCE0] border border-white/10">
                                                    {preset.tag}
                                                </div>
                                            </div>

                                            <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                                                <div>
                                                    <h4 className="font-semibold text-white text-sm">{preset.title}</h4>
                                                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{preset.url}</p>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(preset.url);
                                                            setMessage({ type: 'success', text: `Copied ${preset.title} URL!` });
                                                        }}
                                                        className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5"
                                                    >
                                                        <Check size={14} /> Copy URL
                                                    </button>
                                                    <a
                                                        href={preset.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                                        title="Open in new tab"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Background Device Mode Switcher Toolbar */}
                    {activeTab === 'backgrounds' && (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-[#180614]/80 p-3.5 rounded-2xl border border-white/10 animate-fadeInUp">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Device Mode:</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setGlobalDeviceFilter('desktop');
                                        setCardDeviceModes({});
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                        globalDeviceFilter === 'desktop'
                                            ? 'bg-[#24BCE0] text-black shadow-lg shadow-[#24BCE0]/20'
                                            : 'bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Monitor size={14} /> Desktop (Wide 16:9)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setGlobalDeviceFilter('mobile');
                                        const allMob = {};
                                        PAGE_BACKGROUNDS.forEach(s => { allMob[s.key] = 'mobile'; });
                                        BRANDING_SECTIONS.forEach(s => { allMob[s.key] = 'mobile'; });
                                        setCardDeviceModes(allMob);
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                        globalDeviceFilter === 'mobile'
                                            ? 'bg-[#D62C76] text-white shadow-lg shadow-[#D62C76]/25'
                                            : 'bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Smartphone size={14} /> Mobile (Portrait 9:16)
                                </button>
                            </div>
                            <div className="text-xs text-[#D8D4F0]/80 flex items-center gap-2">
                                <Sparkles size={13} className="text-[#F2D10A]" />
                                <span>Screen sizes are detected automatically on visitor & admin pages</span>
                            </div>
                        </div>
                    )}

                    {/* Main Sections Grid */}
                    {activeTab !== 'presets' && (
                        loading ? (
                            <Loader text="Loading configurations..." />
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                {activeSections.map(section => {
                                    const hasMobileCapability = Boolean(section.hasMobile || activeTab === 'backgrounds');
                                    const isMobileMode = hasMobileCapability && ((cardDeviceModes[section.key] || globalDeviceFilter) === 'mobile');
                                    const currentKey = isMobileMode ? `${section.key}_mobile` : section.key;

                                    const currentVal = inputs[currentKey] || '';
                                    const savedVal = configs[currentKey] || '';
                                    const desktopFallbackVal = isMobileMode ? (inputs[section.key] || configs[section.key] || '') : '';
                                    const displayVal = currentVal || (isMobileMode ? desktopFallbackVal : '') || '';
                                    const isVideo = isVideoUrl(displayVal || savedVal);
                                    const hasCustomMedia = Boolean(currentVal || savedVal);
                                    const isInheritingFallback = isMobileMode && !hasCustomMedia && Boolean(desktopFallbackVal);
                                    const isDirty = currentVal !== savedVal;

                                    const placeholderUrl = isMobileMode
                                        ? (section.mobilePlaceholder || section.placeholder)
                                        : section.placeholder;
                                    const presetUrl = isMobileMode
                                        ? (section.mobileSamplePreset || section.samplePreset)
                                        : section.samplePreset;

                                    return (
                                        <div
                                            key={section.key}
                                            className="bg-[#180614]/70 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all shadow-xl flex flex-col justify-between"
                                        >
                                            {/* Card Header */}
                                            <div>
                                                <div className="flex items-start justify-between gap-3 mb-3">
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="text-lg font-bold text-white font-heading">
                                                                {section.label}
                                                            </h3>
                                                            {section.badgeText && (
                                                                <span
                                                                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                                                    style={{
                                                                        backgroundColor: `${section.badgeColor || '#24BCE0'}20`,
                                                                        color: section.badgeColor || '#24BCE0',
                                                                        border: `1px solid ${section.badgeColor || '#24BCE0'}40`
                                                                    }}
                                                                >
                                                                    {section.badgeText}
                                                                </span>
                                                            )}
                                                            {hasCustomMedia && (
                                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                                    {isMobileMode ? 'Mobile Custom' : 'Desktop Custom'}
                                                                </span>
                                                            )}
                                                            {isInheritingFallback && (
                                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                                                    Using Desktop Fallback
                                                                </span>
                                                            )}
                                                            {!hasCustomMedia && !isInheritingFallback && (
                                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-white/5 text-gray-400 border border-white/10">
                                                                    Default Theme
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-[#D8D4F0]/70 mt-1">
                                                            {section.description}
                                                        </p>
                                                    </div>

                                                    {/* Device Switcher & Icons */}
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {hasMobileCapability && (
                                                            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setCardDeviceModes(prev => ({ ...prev, [section.key]: 'desktop' }))}
                                                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                                                        !isMobileMode ? 'bg-[#24BCE0] text-black shadow-sm' : 'text-gray-400 hover:text-white'
                                                                    }`}
                                                                    title="Configure Desktop (16:9) view"
                                                                >
                                                                    <Monitor size={12} /> Desktop
                                                                    {configs[section.key] && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" />}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setCardDeviceModes(prev => ({ ...prev, [section.key]: 'mobile' }))}
                                                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                                                        isMobileMode ? 'bg-[#D62C76] text-white shadow-sm' : 'text-gray-400 hover:text-white'
                                                                    }`}
                                                                    title="Configure Mobile (9:16) view"
                                                                >
                                                                    <Smartphone size={12} /> Mobile
                                                                    {configs[`${section.key}_mobile`] && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" />}
                                                                </button>
                                                            </div>
                                                        )}

                                                        {section.targetPath && (
                                                            <a
                                                                href={section.targetPath}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors border border-white/10"
                                                                title={`Preview live on ${section.targetPath}`}
                                                            >
                                                                <Compass size={16} />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* DEDICATED LIVE PREVIEW SECTION */}
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                                                        <span className="font-semibold uppercase tracking-wider text-[11px] text-[#24BCE0] flex items-center gap-1.5">
                                                            <Eye size={13} /> Live Preview ({isMobileMode ? 'Mobile View' : 'Desktop View'})
                                                        </span>
                                                        <span className="text-[11px] text-gray-500">
                                                            {isMobileMode ? 'Phone Portrait • 9:16' : isVideo ? 'Video Mode • 16:9' : 'Image Mode • 16:9'}
                                                        </span>
                                                    </div>

                                                    {/* Device specific preview frame */}
                                                    {isMobileMode ? (
                                                        <div className="relative bg-black/80 rounded-[28px] h-64 sm:h-72 w-40 sm:w-48 mx-auto flex items-center justify-center overflow-hidden border-2 border-white/20 group shadow-2xl">
                                                            {/* Phone dynamic notch */}
                                                            <div className="absolute top-2 inset-x-0 mx-auto w-16 h-3 bg-black rounded-full border border-white/15 z-20 pointer-events-none" />
                                                            {/* Phone home indicator bar */}
                                                            <div className="absolute bottom-1.5 inset-x-0 mx-auto w-16 h-1 bg-white/40 rounded-full z-20 pointer-events-none" />

                                                            {displayVal ? (
                                                                isVideo ? (
                                                                    <video
                                                                        key={`${getImageUrl(displayVal)}-m`}
                                                                        src={getImageUrl(displayVal)}
                                                                        className="w-full h-full object-cover object-center"
                                                                        autoPlay loop muted playsInline controls
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        key={`${getImageUrl(displayVal)}-m`}
                                                                        src={getImageUrl(displayVal)}
                                                                        alt={section.label}
                                                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = 'https://via.placeholder.com/390x844?text=Invalid+Mobile+Media';
                                                                        }}
                                                                    />
                                                                )
                                                            ) : (
                                                                placeholderUrl ? (
                                                                    <div className="w-full h-full relative group">
                                                                        <img
                                                                            src={getImageUrl(placeholderUrl)}
                                                                            alt={section.label}
                                                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-85 transition-opacity"
                                                                        />
                                                                        <div className="absolute inset-0 bg-[#14050E]/40" />
                                                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                                                                            <span className="px-2 py-0.5 rounded bg-black/80 border border-white/20 text-[10px] font-semibold text-white/95">
                                                                                Default Mobile
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex flex-col items-center justify-center p-4 text-center text-gray-500">
                                                                        <Smartphone size={24} className="mb-1 text-gray-400" />
                                                                        <p className="text-[11px] font-semibold text-gray-300">No Mobile Media</p>
                                                                        <p className="text-[10px] text-gray-500 mt-0.5">Inherits Desktop</p>
                                                                    </div>
                                                                )
                                                            )}

                                                            {/* Preview Overlay Badges */}
                                                            {displayVal && (
                                                                <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity z-20">
                                                                    <button
                                                                        onClick={() => setSimulateModal({ ...section, activeKey: currentKey, isMobile: true, mediaUrl: displayVal, isVideo })}
                                                                        className="p-1.5 bg-black/80 hover:bg-black rounded-lg text-white border border-white/20 transition-colors cursor-pointer"
                                                                        title="Simulate Mobile View"
                                                                    >
                                                                        <Eye size={12} />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDeleteImage(currentKey, section.label)}
                                                                        disabled={updating[currentKey]}
                                                                        className="p-1.5 bg-red-600/80 hover:bg-red-600 rounded-lg text-white border border-red-500/50 transition-colors cursor-pointer"
                                                                        title={`Delete mobile image for ${section.label}`}
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="relative bg-black/60 rounded-xl h-52 sm:h-56 flex items-center justify-center overflow-hidden border border-white/10 group shadow-inner">
                                                            {currentVal ? (
                                                                isVideo ? (
                                                                    <video
                                                                        key={`${getImageUrl(currentVal)}-d`}
                                                                        src={getImageUrl(currentVal)}
                                                                        className="w-full h-full object-cover"
                                                                        autoPlay loop muted playsInline controls
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        key={`${getImageUrl(currentVal)}-d`}
                                                                        src={getImageUrl(currentVal)}
                                                                        alt={section.label}
                                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = 'https://via.placeholder.com/600x340?text=Invalid+Image+or+Video+URL';
                                                                        }}
                                                                    />
                                                                )
                                                            ) : (
                                                                placeholderUrl ? (
                                                                    <div className="w-full h-full relative group">
                                                                        <img
                                                                            src={getImageUrl(placeholderUrl)}
                                                                            alt={section.label}
                                                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-85 transition-opacity"
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                e.target.src = 'https://via.placeholder.com/600x340?text=KALAM+2026+Default';
                                                                            }}
                                                                        />
                                                                        <div className="absolute inset-0 bg-[#14050E]/40" />
                                                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                                                            <span className="px-2.5 py-1 rounded-md bg-black/80 border border-white/20 text-[11px] font-semibold text-white/95 backdrop-blur-md">
                                                                                Default Desktop Media
                                                                            </span>
                                                                            <span className="text-[10px] text-gray-300 mt-1 max-w-xs">
                                                                                Upload file or paste URL below to customize
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500 select-none">
                                                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2.5 text-gray-400 group-hover:border-[#24BCE0]/40 transition-colors">
                                                                            <ImageIcon size={22} />
                                                                        </div>
                                                                        <p className="text-xs font-semibold text-gray-300">No Custom Media Active</p>
                                                                        <p className="text-[11px] text-gray-500 mt-0.5 max-w-xs">Inheriting default site theme</p>
                                                                    </div>
                                                                )
                                                            )}

                                                            {/* Preview Action Badges */}
                                                            {currentVal && (
                                                                <div className="absolute top-2 right-2 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity z-20">
                                                                    <button
                                                                        onClick={() => setSimulateModal({ ...section, activeKey: currentKey, isMobile: false, mediaUrl: currentVal, isVideo })}
                                                                        className="p-1.5 bg-black/70 hover:bg-black/90 backdrop-blur-md rounded-lg text-white text-xs flex items-center gap-1 border border-white/20 transition-colors cursor-pointer"
                                                                        title="Simulate Page Overlay"
                                                                    >
                                                                        <Eye size={14} />
                                                                        <span className="text-[11px]">Simulate</span>
                                                                    </button>
                                                                    <a
                                                                        href={getImageUrl(currentVal)}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="p-1.5 bg-black/70 hover:bg-black/90 backdrop-blur-md rounded-lg text-white border border-white/20 transition-colors"
                                                                        title="Open media in new tab"
                                                                    >
                                                                        <ExternalLink size={14} />
                                                                    </a>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDeleteImage(currentKey, section.label)}
                                                                        disabled={updating[currentKey]}
                                                                        className="p-1.5 bg-red-600/85 hover:bg-red-600 backdrop-blur-md rounded-lg text-white text-xs flex items-center gap-1 border border-red-500/50 transition-colors cursor-pointer shadow-md"
                                                                        title={`Delete image for ${section.label}`}
                                                                    >
                                                                        <Trash2 size={14} />
                                                                        <span className="text-[11px] font-semibold">Delete</span>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* INPUT SECTION WITH LABELS & BUTTONS */}
                                            <div className="flex flex-col gap-3 mt-2">
                                                {/* URL Input Box */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <label className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                                                            {isMobileMode ? <Smartphone size={12} className="text-[#D62C76]" /> : <Monitor size={12} className="text-[#24BCE0]" />}
                                                            <span>{isMobileMode ? 'Mobile Background URL' : 'Desktop Background URL'}</span>
                                                        </label>
                                                        {isMobileMode && !currentVal && desktopFallbackVal && (
                                                            <span className="text-[10px] text-cyan-400 font-medium">
                                                                Fallback: Desktop active
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                            <LinkIcon size={15} className="text-gray-500" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={currentVal}
                                                            onChange={(e) => handleInputChange(currentKey, e.target.value)}
                                                            placeholder={placeholderUrl}
                                                            className="w-full bg-black/50 border border-white/15 focus:border-[#24BCE0] rounded-xl py-2.5 pl-9 pr-24 text-xs font-mono text-white placeholder-gray-600 focus:outline-none transition-all shadow-inner"
                                                        />
                                                        {presetUrl && !currentVal && (
                                                            <button
                                                                type="button"
                                                                onClick={() => applyPresetToSection(currentKey, presetUrl)}
                                                                className="absolute right-2 top-1.5 text-[10px] font-semibold bg-[#24BCE0]/15 hover:bg-[#24BCE0]/30 text-[#24BCE0] border border-[#24BCE0]/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                                                            >
                                                                Insert Sample
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Bar: Presets, Upload, Save, Clear */}
                                                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                                                    {/* Left: Delete Image Button */}
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteImage(currentKey, section.label)}
                                                            disabled={updating[currentKey] || uploading[currentKey] || (!currentVal && !configs[currentKey] && !displayVal)}
                                                            className="bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border border-red-500/30 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:shadow-red-500/20"
                                                            title={`Delete ${isMobileMode ? 'mobile' : 'desktop'} image for ${section.label}`}
                                                        >
                                                            {updating[currentKey] ? (
                                                                <LoaderIcon size={14} className="animate-spin text-red-400" />
                                                            ) : (
                                                                <Trash2 size={14} />
                                                            )}
                                                            <span>Delete {isMobileMode ? 'Mobile Image' : 'Image'}</span>
                                                        </button>

                                                        {hasMobileCapability && configs[section.key] && configs[`${section.key}_mobile`] && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteBothImages(section)}
                                                                disabled={updating[section.key] || updating[`${section.key}_mobile`]}
                                                                className="text-[10px] text-red-300/80 hover:text-red-200 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                                                                title={`Delete both desktop and mobile images for ${section.label}`}
                                                            >
                                                                Delete Both
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Right: Upload File & Save Button */}
                                                    <div className="flex items-center gap-2 ml-auto">
                                                        {/* Hidden File Input */}
                                                        <input
                                                            type="file"
                                                            ref={el => (fileInputRefs.current[currentKey] = el)}
                                                            className="hidden"
                                                            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg"
                                                            onChange={(e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    handleFileUpload(currentKey, e.target.files[0]);
                                                                }
                                                            }}
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() => fileInputRefs.current[currentKey]?.click()}
                                                            disabled={uploading[currentKey]}
                                                            className="bg-white/10 hover:bg-white/20 text-gray-200 px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-white/10 disabled:opacity-50 cursor-pointer"
                                                            title={`Upload ${isMobileMode ? 'mobile portrait' : 'desktop'} media`}
                                                        >
                                                            {uploading[currentKey] ? (
                                                                <LoaderIcon size={14} className="animate-spin text-[#24BCE0]" />
                                                            ) : (
                                                                <UploadCloud size={14} />
                                                            )}
                                                            <span>Upload {isMobileMode ? 'Mobile File' : 'Desktop File'}</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleSave(currentKey)}
                                                            disabled={updating[currentKey]}
                                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
                                                                isDirty
                                                                    ? 'bg-gradient-to-r from-[#D62C76] to-[#F47721] hover:brightness-110 text-white animate-pulse'
                                                                    : 'bg-[#24BCE0] hover:bg-[#20A9C9] text-black font-semibold'
                                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                            title={`Save ${isMobileMode ? 'mobile' : 'desktop'} background`}
                                                        >
                                                            {updating[currentKey] ? (
                                                                <LoaderIcon size={14} className="animate-spin" />
                                                            ) : (
                                                                <Save size={14} />
                                                            )}
                                                            <span>{isDirty ? 'Save Changes' : 'Saved'}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    )}
                </main>
            </div>

            {/* SIMULATE PAGE OVERLAY MODAL WITH DESKTOP & MOBILE VIEWS */}
            {simulateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeInUp">
                    <div
                        className={`relative transition-all duration-300 flex flex-col bg-[#14050E] overflow-hidden ${
                            simDevice === 'mobile'
                                ? 'w-[380px] h-[750px] max-h-[92vh] rounded-[48px] border-4 border-slate-700 shadow-2xl'
                                : 'w-full max-w-5xl h-[85vh] rounded-3xl border border-[#D62C76]/40 shadow-2xl'
                        }`}
                    >
                        {/* Simulation Background Layer */}
                        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                            {(() => {
                                const activeMedia = simDevice === 'mobile'
                                    ? (inputs[`${simulateModal.key}_mobile`] || configs[`${simulateModal.key}_mobile`] || simulateModal.mediaUrl)
                                    : (inputs[simulateModal.key] || configs[simulateModal.key] || simulateModal.mediaUrl);
                                const isVid = isVideoUrl(activeMedia);

                                return isVid ? (
                                    <video
                                        key={`${getImageUrl(activeMedia)}-${simDevice}`}
                                        src={getImageUrl(activeMedia)}
                                        autoPlay loop muted playsInline
                                        className="w-full h-full object-cover object-center opacity-40"
                                    />
                                ) : (
                                    <img
                                        key={`${getImageUrl(activeMedia)}-${simDevice}`}
                                        src={getImageUrl(activeMedia)}
                                        alt="Simulation"
                                        className="w-full h-full object-cover object-center opacity-35"
                                    />
                                );
                            })()}
                            <div className="absolute inset-0 bg-[#14050E]/60 backdrop-blur-[0.5px]" />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#14050E]/85 via-[#14050E]/40 to-[#14050E]/95" />
                        </div>

                        {/* Smartphone Notch if in Mobile Mode */}
                        {simDevice === 'mobile' && (
                            <div className="relative z-20 pt-2 flex justify-center pointer-events-none">
                                <div className="w-24 h-4 bg-black rounded-full border border-white/20 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-slate-800 mr-2" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
                                </div>
                            </div>
                        )}

                        {/* Simulation Top Bar */}
                        <div className="relative z-10 flex items-center justify-between p-3 sm:p-4 px-5 border-b border-white/10 bg-[#140610]/80 backdrop-blur-xl">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                </div>
                                <span className="text-[11px] font-mono text-gray-300 truncate max-w-[140px] sm:max-w-xs ml-1">
                                    {simulateModal.label}
                                </span>
                            </div>

                            {/* Device Switcher inside simulation */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/15">
                                    <button
                                        onClick={() => setSimDevice('desktop')}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                            simDevice === 'desktop' ? 'bg-[#24BCE0] text-black shadow-sm' : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <Monitor size={12} /> Desktop
                                    </button>
                                    <button
                                        onClick={() => setSimDevice('mobile')}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                            simDevice === 'mobile' ? 'bg-[#D62C76] text-white shadow-sm' : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <Smartphone size={12} /> Mobile
                                    </button>
                                </div>

                                <button
                                    onClick={() => setSimulateModal(null)}
                                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Mock Page Content */}
                        <div className={`relative z-10 flex-1 overflow-y-auto flex flex-col items-center justify-center text-center ${
                            simDevice === 'mobile' ? 'p-6' : 'p-8 sm:p-12'
                        }`}>
                            <span className="px-3 py-0.5 rounded-full text-[10px] font-semibold bg-[#24BCE0]/15 text-[#24BCE0] border border-[#24BCE0]/30 uppercase tracking-widest mb-3">
                                {simDevice === 'mobile' ? '📱 Mobile Phone View' : '🖥️ Desktop Widescreen View'}
                            </span>
                            <h2 className={`font-black text-white font-heading tracking-tight mb-3 ${
                                simDevice === 'mobile' ? 'text-2xl leading-tight' : 'text-3xl sm:text-5xl max-w-2xl'
                            }`}>
                                Experience The Extraordinary
                            </h2>
                            <p className={`text-[#D8D4F0]/80 mb-6 ${
                                simDevice === 'mobile' ? 'text-xs' : 'text-sm sm:text-base max-w-xl'
                            }`}>
                                Testing screen-size detection: KALAM 2026 serves the optimal background view for each device.
                            </p>

                            <div className={`grid gap-3 w-full ${
                                simDevice === 'mobile' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3 max-w-2xl'
                            }`}>
                                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                    <h5 className="font-bold text-[#F2D10A] text-base">90+</h5>
                                    <p className="text-[11px] text-gray-400">Technical Events</p>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                    <h5 className="font-bold text-[#F47721] text-base">₹5 Lakhs+</h5>
                                    <p className="text-[11px] text-gray-400">Prize Pool</p>
                                </div>
                                <div className={`p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md ${
                                    simDevice === 'mobile' ? 'col-span-2' : ''
                                }`}>
                                    <h5 className="font-bold text-[#D62C76] text-base">Celebrity</h5>
                                    <p className="text-[11px] text-gray-400">Live Stage Show</p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile bottom indicator */}
                        {simDevice === 'mobile' && (
                            <div className="relative z-20 pb-2 flex justify-center pointer-events-none">
                                <div className="w-24 h-1 bg-white/40 rounded-full" />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageImages;
