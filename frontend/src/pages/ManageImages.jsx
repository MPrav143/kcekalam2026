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
    Search
} from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import { API_URL } from '../utils/config';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { isVideoUrl, useHasPageBackground } from '../components/PageBackground';
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
        typeHint: 'image'
    },
    {
        key: 'about_bg',
        label: 'About Page Background',
        targetPath: '/about',
        description: 'Background for About KCE, Institution legacy, and Festival vision.',
        placeholder: 'https://ik.imagekit.io/kalam/About%20Page/Cosmic%20Ocean%20of%20Future%20Waves.png',
        samplePreset: 'https://ik.imagekit.io/kalam/About%20Page/Cosmic%20Ocean%20of%20Future%20Waves.png',
        typeHint: 'image'
    },
    {
        key: 'passes_bg',
        label: 'Passes Page Background',
        targetPath: '/passes',
        description: 'Background for Admission tiers, Privilege passes, and ticketing grid.',
        placeholder: 'https://ik.imagekit.io/kalam/Hero/Neon%20Crystal%20Sci-Fi%20Void.png',
        samplePreset: 'https://ik.imagekit.io/kalam/Hero/Neon%20Crystal%20Sci-Fi%20Void.png',
        typeHint: 'image'
    },
    {
        key: 'events_bg',
        label: 'Technical Events Track Background',
        targetPath: '/#technical-events',
        description: 'Background for Technical Events track, Hackathons, Workshops, and Department Categories.',
        placeholder: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
        samplePreset: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
        typeHint: 'image'
    },
    {
        key: 'cultural_events_bg',
        label: 'Cultural Events Track Background',
        targetPath: '/#cultural-events',
        description: 'Atmospheric stage and festival lighting background for Cultural Events track & showcase.',
        placeholder: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80',
        samplePreset: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80',
        typeHint: 'image'
    },
    {
        key: 'highlights_bg',
        label: 'Festival Highlights Background',
        targetPath: '/#highlights',
        description: 'Background for KCE KALAM Legacy, Key Highlights, and past festival moments.',
        placeholder: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1920&q=80',
        samplePreset: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1920&q=80',
        typeHint: 'image'
    },
    {
        key: 'event_detail_bg',
        label: 'Event Details Background',
        targetPath: '/events',
        description: 'Background for Individual event descriptions, guidelines, rules, and rounds.',
        placeholder: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=1920&q=80',
        samplePreset: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=1920&q=80',
        typeHint: 'image'
    },
    {
        key: 'register_bg',
        label: 'Registration & Checkout Background',
        targetPath: '/select-events',
        description: 'Background for Student registration, pass checkout, and payment processing.',
        placeholder: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
        samplePreset: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
        typeHint: 'image'
    },
    {
        key: 'home_bg',
        label: 'Home Page Background (Optional)',
        targetPath: '/',
        description: 'Optional full-page backdrop (disabled by default so sections have independent backgrounds).',
        placeholder: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
        samplePreset: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
        typeHint: 'image'
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
        description: 'Optional hero card container backdrop (kept disabled if clean solid surface is selected).',
        placeholder: 'https://ik.imagekit.io/kalam/Hero/Celestial%20Blue%20Arena%20Portal.png',
        samplePreset: 'https://ik.imagekit.io/kalam/Hero/Celestial%20Blue%20Arena%20Portal.png',
        typeHint: 'image'
    },
    {
        key: 'footer_bg',
        label: 'Footer Atmospheric Background',
        targetPath: '/',
        description: 'Deep cosmic starfield backdrop for the sponsors and footer section.',
        placeholder: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
        samplePreset: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
        typeHint: 'image'
    },
    {
        key: 'footer_bg_video',
        label: 'Footer Background Video (Optional)',
        targetPath: '/',
        description: 'Optional atmospheric video loop playing in the footer of the website (mp4/webm).',
        placeholder: 'https://example.com/video.mp4',
        samplePreset: '',
        typeHint: 'video'
    }
];

const CURATED_PRESETS = [
    {
        title: 'Deep Cosmic Nebula',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
        tag: 'Space / Nebula'
    },
    {
        title: 'Techno Digital Grid',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
        tag: 'Tech / Innovation'
    },
    {
        title: 'Cultural Stage Glow',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80',
        tag: 'Cultural / Concert'
    },
    {
        title: 'Earth Orbit Satellite',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
        tag: 'Global Space'
    },
    {
        title: 'Cyber Security Grid',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
        tag: 'Security / Register'
    },
    {
        title: 'High-Tech Operations',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80',
        tag: 'Admin / Command'
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
    const hasBgImage = useHasPageBackground();
    const { refreshConfig } = useGlobalConfig();
    const [configs, setConfigs] = useState({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});
    const [uploading, setUploading] = useState({});
    const [message, setMessage] = useState(null);
    const [inputs, setInputs] = useState({});
    const [activeTab, setActiveTab] = useState('cards'); // 'cards' | 'backgrounds' | 'branding' | 'presets'
    const [cardSubFilter, setCardSubFilter] = useState('all'); // 'all' | 'tracks' | 'technical' | 'cultural'
    const [cardSearchQuery, setCardSearchQuery] = useState('');
    const [departmentsList, setDepartmentsList] = useState([]);
    const [culturalSubsList, setCulturalSubsList] = useState([]);
    const [simulateModal, setSimulateModal] = useState(null); // section object to simulate
    const fileInputRefs = useRef({});

    // Dynamic Card Sections List (Tracks + Departments + Cultural Categories)
    const allCardSections = useMemo(() => {
        const list = [...PRIMARY_TRACK_CARDS];

        // Technical departments: merge default DEPARTMENTS with custom departments
        const mergedDepts = [...DEPARTMENTS];
        if (Array.isArray(departmentsList)) {
            departmentsList.forEach(dept => {
                const idx = mergedDepts.findIndex(item => item.code?.toLowerCase() === dept.code?.toLowerCase());
                if (idx >= 0) {
                    mergedDepts[idx] = { ...mergedDepts[idx], ...dept };
                } else {
                    mergedDepts.push(dept);
                }
            });
        }
        mergedDepts.forEach(dept => {
            list.push({
                key: `dept_${dept.code}_image`,
                deptCode: dept.code,
                label: `${dept.code} — Department Card`,
                targetPath: `/?cat=Technical&dept=${encodeURIComponent(dept.code)}`,
                description: `${dept.name} card poster displayed in Level 2 Technical Categories.`,
                placeholder: dept.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
                samplePreset: dept.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
                typeHint: 'image',
                categoryGroup: 'technical',
                badgeText: 'Technical Department',
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

            const mergedDepts = [...DEPARTMENTS];
            if (Array.isArray(deptsRes.data)) {
                deptsRes.data.forEach(d => {
                    const idx = mergedDepts.findIndex(item => item.code?.toLowerCase() === d.code?.toLowerCase());
                    if (idx >= 0) {
                        mergedDepts[idx] = { ...mergedDepts[idx], ...d };
                    } else {
                        mergedDepts.push(d);
                    }
                });
            }

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

            setDepartmentsList(mergedDepts);
            setCulturalSubsList(mergedSubs);

            const allSections = [...PAGE_BACKGROUNDS, ...BRANDING_SECTIONS, ...PRIMARY_TRACK_CARDS];
            const initialInputs = {};
            allSections.forEach(s => {
                initialInputs[s.key] = data[s.key] || (s.aliasKey ? data[s.aliasKey] : '') || '';
            });

            mergedDepts.forEach(d => {
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

    const handleClear = async (key) => {
        handleInputChange(key, '');
        setUpdating(prev => ({ ...prev, [key]: true }));
        try {
            await axios.post(
                `${API_URL}/content/config`,
                { key, value: '', type: 'image' },
                getAuthConfig()
            );
            if (key === 'technical_card_image') {
                await axios.post(`${API_URL}/content/config`, { key: 'cat_technical_image', value: '', type: 'image' }, getAuthConfig()).catch(() => {});
            } else if (key === 'cultural_card_image') {
                await axios.post(`${API_URL}/content/config`, { key: 'cat_cultural_image', value: '', type: 'image' }, getAuthConfig()).catch(() => {});
            }
            setConfigs(prev => ({ ...prev, [key]: '' }));
            setUpdating(prev => ({ ...prev, [key]: false }));
            setMessage({
                type: 'success',
                text: `Cleared ${key.replace(/_/g, ' ')}. Now using default!`
            });
            if (refreshConfig) refreshConfig();
        } catch (error) {
            console.error(error);
            setUpdating(prev => ({ ...prev, [key]: false }));
            setMessage({ type: 'error', text: 'Failed to clear setting.' });
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
        <div className={`flex min-h-screen ${hasBgImage ? 'bg-transparent' : 'bg-[#14050E]/80 bg-cosmic-grid'} text-white font-body flex-col md:flex-row`}>
            <Sidebar />

            <div className="flex-1 flex flex-col lg:ml-64">
                <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 max-w-7xl">
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
                                    { id: 'technical', label: `Technical Depts (${allCardSections.filter(s => s.categoryGroup === 'technical').length})` },
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

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                    {/* Main Sections Grid */}
                    {activeTab !== 'presets' && (
                        loading ? (
                            <Loader text="Loading configurations..." />
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                {activeSections.map(section => {
                                    const currentVal = inputs[section.key] || '';
                                    const savedVal = configs[section.key] || '';
                                    const isVideo = isVideoUrl(currentVal || savedVal);
                                    const hasCustomMedia = Boolean(currentVal || savedVal);
                                    const isDirty = currentVal !== savedVal;

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
                                                                    Active Custom
                                                                </span>
                                                            )}
                                                            {!hasCustomMedia && (
                                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-white/5 text-gray-400 border border-white/10">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-[#D8D4F0]/70 mt-1">
                                                            {section.description}
                                                        </p>
                                                    </div>

                                                    {/* Media Type Icon & Target Page */}
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        {isVideo ? (
                                                            <span className="p-2 rounded-lg bg-[#D62C76]/20 text-[#D62C76] border border-[#D62C76]/30" title="Video media detected">
                                                                <VideoIcon size={18} />
                                                            </span>
                                                        ) : (
                                                            <span className="p-2 rounded-lg bg-[#24BCE0]/20 text-[#24BCE0] border border-[#24BCE0]/30" title="Image media detected">
                                                                <ImageIcon size={18} />
                                                            </span>
                                                        )}
                                                        {section.targetPath && (
                                                            <a
                                                                href={section.targetPath}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors border border-white/10"
                                                                title={`Preview live on ${section.targetPath}`}
                                                            >
                                                                <Compass size={18} />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* DEDICATED LIVE PREVIEW SECTION */}
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                                                        <span className="font-semibold uppercase tracking-wider text-[11px] text-[#24BCE0] flex items-center gap-1.5">
                                                            <Eye size={13} /> Live Preview
                                                        </span>
                                                        <span className="text-[11px] text-gray-500">
                                                            {isVideo ? 'Video Mode • 16:9' : 'Image Mode • Card Cover'}
                                                        </span>
                                                    </div>

                                                    <div className="relative bg-black/60 rounded-xl h-52 sm:h-56 flex items-center justify-center overflow-hidden border border-white/10 group shadow-inner">
                                                        {currentVal ? (
                                                            isVideo ? (
                                                                <video
                                                                    key={getImageUrl(currentVal)}
                                                                    src={getImageUrl(currentVal)}
                                                                    className="w-full h-full object-cover"
                                                                    autoPlay
                                                                    loop
                                                                    muted
                                                                    playsInline
                                                                    controls
                                                                />
                                                            ) : (
                                                                <img
                                                                    key={getImageUrl(currentVal)}
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
                                                            section.placeholder ? (
                                                                /* Default Preset Preview with Informative Overlay */
                                                                <div className="w-full h-full relative group">
                                                                    <img
                                                                        src={getImageUrl(section.placeholder)}
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
                                                                            Default Image Active
                                                                        </span>
                                                                        <span className="text-[10px] text-gray-300 mt-1 max-w-xs">
                                                                            Upload a file or paste URL below to replace
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                /* High-Tech Empty State Placeholder */
                                                                <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500 select-none">
                                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2.5 text-gray-400 group-hover:border-[#24BCE0]/40 transition-colors">
                                                                        <ImageIcon size={22} />
                                                                    </div>
                                                                    <p className="text-xs font-semibold text-gray-300">
                                                                        No Custom Media Active
                                                                    </p>
                                                                    <p className="text-[11px] text-gray-500 mt-0.5 max-w-xs">
                                                                        Inheriting default site theme
                                                                    </p>
                                                                </div>
                                                            )
                                                        )}

                                                        {/* Preview Action Badges Over Media */}
                                                        {currentVal && (
                                                            <div className="absolute top-2 right-2 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => setSimulateModal({ ...section, mediaUrl: currentVal, isVideo })}
                                                                    className="p-1.5 bg-black/70 hover:bg-black/90 backdrop-blur-md rounded-lg text-white text-xs flex items-center gap-1 border border-white/20 transition-colors"
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
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* INPUT SECTION WITH PLACEHOLDER & BUTTONS */}
                                            <div className="flex flex-col gap-3 mt-2">
                                                {/* URL Input Box */}
                                                <div>
                                                    <label className="text-[11px] text-gray-400 font-medium block mb-1">
                                                        Media URL (Direct link, Google Drive, or Unsplash)
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                            <LinkIcon size={15} className="text-gray-500" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={currentVal}
                                                            onChange={(e) => handleInputChange(section.key, e.target.value)}
                                                            placeholder={section.placeholder}
                                                            className="w-full bg-black/50 border border-white/15 focus:border-[#24BCE0] rounded-xl py-2.5 pl-9 pr-24 text-xs font-mono text-white placeholder-gray-600 focus:outline-none transition-all shadow-inner"
                                                        />
                                                        {/* Quick Sample Chip */}
                                                        {section.samplePreset && !currentVal && (
                                                            <button
                                                                type="button"
                                                                onClick={() => applyPresetToSection(section.key, section.samplePreset)}
                                                                className="absolute right-2 top-1.5 text-[10px] font-semibold bg-[#24BCE0]/15 hover:bg-[#24BCE0]/30 text-[#24BCE0] border border-[#24BCE0]/30 px-2.5 py-1 rounded-lg transition-colors"
                                                            >
                                                                Insert Sample
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Bar: Presets, Upload, Save, Clear */}
                                                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
                                                    {/* Left: Preset Shortcut & Clear */}
                                                    <div className="flex items-center gap-2">
                                                        {section.videoPreset && (
                                                            <button
                                                                type="button"
                                                                onClick={() => applyPresetToSection(section.key, section.videoPreset)}
                                                                className="text-[11px] text-[#F2D10A] hover:text-yellow-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 transition-colors"
                                                                title="Try Video Loop sample"
                                                            >
                                                                <Play size={11} /> Sample Video
                                                            </button>
                                                        )}

                                                        {currentVal && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleClear(section.key)}
                                                                disabled={updating[section.key]}
                                                                className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors disabled:opacity-50"
                                                                title="Reset to default theme"
                                                            >
                                                                <Trash2 size={11} /> Reset
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Right: Upload File & Save Button */}
                                                    <div className="flex items-center gap-2 ml-auto">
                                                        {/* Hidden File Input */}
                                                        <input
                                                            type="file"
                                                            ref={el => (fileInputRefs.current[section.key] = el)}
                                                            className="hidden"
                                                            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg"
                                                            onChange={(e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    handleFileUpload(section.key, e.target.files[0]);
                                                                }
                                                            }}
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() => fileInputRefs.current[section.key]?.click()}
                                                            disabled={uploading[section.key]}
                                                            className="bg-white/10 hover:bg-white/20 text-gray-200 px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-white/10 disabled:opacity-50"
                                                            title="Upload file directly from device"
                                                        >
                                                            {uploading[section.key] ? (
                                                                <LoaderIcon size={14} className="animate-spin text-[#24BCE0]" />
                                                            ) : (
                                                                <UploadCloud size={14} />
                                                            )}
                                                            <span>Upload File</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleSave(section.key)}
                                                            disabled={updating[section.key]}
                                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                                                                isDirty
                                                                    ? 'bg-gradient-to-r from-[#D62C76] to-[#F47721] hover:brightness-110 text-white animate-pulse'
                                                                    : 'bg-[#24BCE0] hover:bg-[#20A9C9] text-black font-semibold'
                                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                            title="Save background setting"
                                                        >
                                                            {updating[section.key] ? (
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

            {/* SIMULATE PAGE OVERLAY MODAL */}
            {simulateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeInUp">
                    <div className="relative w-full max-w-5xl h-[85vh] bg-[#14050E] rounded-3xl overflow-hidden border border-[#D62C76]/40 shadow-2xl flex flex-col">
                        {/* Simulation Background Layer */}
                        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                            {simulateModal.isVideo ? (
                                <video
                                    src={getImageUrl(simulateModal.mediaUrl)}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover opacity-35"
                                />
                            ) : (
                                <img
                                    src={getImageUrl(simulateModal.mediaUrl)}
                                    alt="Simulation"
                                    className="w-full h-full object-cover opacity-30"
                                />
                            )}
                            <div className="absolute inset-0 bg-[#14050E]/60 backdrop-blur-[0.5px]" />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#14050E]/80 via-[#14050E]/40 to-[#14050E]/90" />
                        </div>

                        {/* Simulation Top Bar */}
                        <div className="relative z-10 flex items-center justify-between p-4 px-6 border-b border-white/10 bg-[#140610]/80 backdrop-blur-xl">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                                <span className="ml-2 text-xs font-mono text-gray-400">
                                    Simulating: {simulateModal.label} ({simulateModal.targetPath})
                                </span>
                            </div>

                            <button
                                onClick={() => setSimulateModal(null)}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Mock Content */}
                        <div className="relative z-10 flex-1 p-8 sm:p-12 overflow-y-auto flex flex-col items-center justify-center text-center">
                            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#24BCE0]/15 text-[#24BCE0] border border-[#24BCE0]/30 uppercase tracking-widest mb-4">
                                KALAM 2026 • Live Preview Mode
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight mb-4 max-w-2xl">
                                Experience The Extraordinary
                            </h2>
                            <p className="text-sm sm:text-base text-[#D8D4F0]/80 max-w-xl mb-8">
                                This live simulation demonstrates how your background image or video blends with KALAM&apos;s cosmic dark theme,
                                typography, and cards while preserving complete text readability.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                    <h5 className="font-bold text-[#F2D10A] text-lg">90+</h5>
                                    <p className="text-xs text-gray-400">Technical Events</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                    <h5 className="font-bold text-[#F47721] text-lg">₹5 Lakhs+</h5>
                                    <p className="text-xs text-gray-400">Prize Pool</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                    <h5 className="font-bold text-[#D62C76] text-lg">Celebrity</h5>
                                    <p className="text-xs text-gray-400">Live Stage Night</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageImages;
