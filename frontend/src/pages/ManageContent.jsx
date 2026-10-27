import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { getImageUrl } from '../utils/imageUtils';
import { Save, Plus, Trash2, Pencil, Link as LinkIcon } from 'lucide-react';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { API_URL } from '../utils/config';

const ManageContent = () => {
    const { refreshConfig, config: siteConfig } = useGlobalConfig();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('general');
    const [rules, setRules] = useState(''); // Keeping state to avoid breakage if referenced, but UI removed
    const [aboutContent, setAboutContent] = useState('');
    const [aboutKceContent, setAboutKceContent] = useState('');
    const [aboutKceImage, setAboutKceImage] = useState('');
    const [aboutLogo, setAboutLogo] = useState('');
    const [aboutLogoWidth, setAboutLogoWidth] = useState('');
    const [aboutHeroBg, setAboutHeroBg] = useState('');
    const [aboutVideo, setAboutVideo] = useState('');
    const [aboutKceVideo, setAboutKceVideo] = useState('');

    const [contact, setContact] = useState({ email: '', address: '' });
    const [contactPhones, setContactPhones] = useState(['']);
    const [footerBgVideo, setFooterBgVideo] = useState('');
    const [footerBgVideoMobile, setFooterBgVideoMobile] = useState('');
    const [rulesBg, setRulesBg] = useState('');
    const [generalConfig, setGeneralConfig] = useState({ website_name: 'Kalam', event_year: '2026', registration_open: 'true' });
    const [sponsors, setSponsors] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);

    // Fest Subcategories & Departments State
    const [departmentsList, setDepartmentsList] = useState([]);
    const [culturalSubList, setCulturalSubList] = useState([]);
    const [deptForm, setDeptForm] = useState({ code: '', name: '', image: '', order: 0 });
    const [editingDept, setEditingDept] = useState(null);
    const [culturalSubForm, setCulturalSubForm] = useState({ code: '', name: '', image: '', order: 0 });
    const [editingCulturalSub, setEditingCulturalSub] = useState(null);
    const [subTab, setSubTab] = useState('technical'); // 'technical' | 'cultural'

    // Popup Images
    const [popupImages, setPopupImages] = useState([]);

    // New State for Content Structure
    const [pastEventDesc, setPastEventDesc] = useState('');
    const [pastEventSubheading, setPastEventSubheading] = useState('');
    const [pastEventHighlights, setPastEventHighlights] = useState(['', '', '', '']);

    // Local state for image inputs to avoid auto-save
    const [imageValues, setImageValues] = useState({});

    const [loading, setLoading] = useState(true);

    const getAuthConfig = () => {
        const token = localStorage.getItem('adminToken');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    // Common Fetch
    const fetchData = async () => {
        try {
            const [confRes, sponsorsRes, clubsRes, pastEventsRes, deptsRes, culturalRes] = await Promise.all([
                axios.get(`${API_URL}/upload`),
                axios.get(`${API_URL}/content/sponsors`),
                axios.get(`${API_URL}/content/clubs`),
                axios.get(`${API_URL}/content/pastEvents`),
                axios.get(`${API_URL}/content/departments`),
                axios.get(`${API_URL}/content/cultural-subcategories`)
            ]);

            if (Array.isArray(deptsRes.data)) setDepartmentsList(deptsRes.data);
            if (Array.isArray(culturalRes.data)) setCulturalSubList(culturalRes.data);

            setRules(confRes.data['rules_content'] || '');
            setRulesBg(confRes.data['rules_bg'] || '');
            setAboutContent(confRes.data['about_content'] || '');
            setAboutKceContent(confRes.data['about_kce_content'] || '');
            setAboutKceImage(confRes.data['about_kce_image'] || '');
            setAboutLogo(confRes.data['about_logo'] || '');
            setAboutLogoWidth(confRes.data['about_logo_width'] || '150px');
            setAboutHeroBg(confRes.data['about_hero_bg'] || '');
            setAboutVideo(confRes.data['about_video'] || '');
            setAboutKceVideo(confRes.data['about_kce_video'] || '');
            setContact({
                email: confRes.data['contact_email'] || '',
                address: confRes.data['contact_address'] || ''
            });

            const phones = confRes.data['contact_phones'] || confRes.data['contact_phone'] || '';
            setContactPhones(phones ? phones.split(',').map(p => p.trim()) : ['']);

            setFooterBgVideo(confRes.data['footer_bg_video'] || '');
            setFooterBgVideoMobile(confRes.data['footer_bg_video_mobile'] || '');

            const pImages = confRes.data['popup_images'] || '';
            setPopupImages(pImages ? pImages.split(',').map(p => p.trim()).filter(Boolean) : []);

            // Past Events Static Content
            setPastEventDesc(confRes.data['past_event_desc'] || 'Join us as we bring together vivid minds...');
            setPastEventSubheading(confRes.data['past_event_subheading'] || 'Unleash Your Potential at Kalam');
            setPastEventHighlights([
                confRes.data['past_highlight_1'] || 'Expert Speakers',
                confRes.data['past_highlight_2'] || 'Interactive Workshops',
                confRes.data['past_highlight_3'] || 'Networking Opportunities',
                confRes.data['past_highlight_4'] || 'Gear Up for Glory'
            ]);

            setGeneralConfig({
                website_name: confRes.data['website_name'] || 'Kalam',
                event_year: confRes.data['event_year'] || '2026',
                registration_open: confRes.data['registration_open'] || 'true'
            });

            setSponsors(sponsorsRes.data);
            setClubs(clubsRes.data);
            setPastEvents(pastEventsRes.data);

            // Initialize imageValues from config
            const initialImageValues = {};
            ['cat_technical_image', 'cat_cultural_image', 'cat_nontechnical_image', 'cat_workshop_image'].forEach(key => {
                initialImageValues[key] = confRes.data[key] || '';
            });
            ['AIDS', 'CIVIL', 'CSD-CST', 'CSE', 'EEE', 'ECE', 'IT', 'MECH', 'MBA', 'MCA', 'CSECS', 'ETE-VLSI'].forEach(code => {
                initialImageValues[`dept_${code}_image`] = confRes.data[`dept_${code}_image`] || '';
            });
            setImageValues(initialImageValues);

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getEmbedLink = (link) => {
        if (!link) return '';
        if (link.includes('drive.google.com') && link.includes('/view')) {
            return link.replace('/view', '/preview');
        }
        return link;
    };

    // --- RULES & CONTACT HANDLERS ---
    const saveConfig = async (key, value, type = 'text') => {
        try {
            await axios.post(`${API_URL}/content/config`, { key, value, type }, getAuthConfig());
            if (key === 'cat_technical_image') {
                await axios.post(`${API_URL}/content/config`, { key: 'technical_card_image', value, type }, getAuthConfig()).catch(() => {});
            } else if (key === 'cat_cultural_image') {
                await axios.post(`${API_URL}/content/config`, { key: 'cultural_card_image', value, type }, getAuthConfig()).catch(() => {});
            }
            alert('Saved successfully!');
            refreshConfig();
            setImageValues(prev => ({ ...prev, [key]: value }));
            fetchData();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else {
                alert('Error saving');
            }
        }
    };

    const deleteConfigImage = async (key, label) => {
        if (!window.confirm(`Are you sure you want to delete the image for "${label || key}"? This will reset it to default.`)) return;
        try {
            await axios.post(`${API_URL}/content/config`, { key, value: '', type: 'image' }, getAuthConfig());
            if (key === 'cat_technical_image') {
                await axios.post(`${API_URL}/content/config`, { key: 'technical_card_image', value: '', type: 'image' }, getAuthConfig()).catch(() => {});
            } else if (key === 'cat_cultural_image') {
                await axios.post(`${API_URL}/content/config`, { key: 'cultural_card_image', value: '', type: 'image' }, getAuthConfig()).catch(() => {});
            }
            alert('Image deleted successfully!');
            refreshConfig();
            setImageValues(prev => ({ ...prev, [key]: '' }));
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Error deleting image');
        }
    };

    // --- GENERIC LIST HANDLER (Sponsors/Clubs) ---
    const [itemForm, setItemForm] = useState({ name: '', logo: '', description: '', tier: 'Silver' });
    const [editingItem, setEditingItem] = useState(null);

    const handleItemSubmit = async (e, type) => {
        e.preventDefault();
        try {
            let logoUrl = getEmbedLink(itemForm.logo);
            const payload = { ...itemForm, logo: logoUrl };
            if (editingItem) {
                await axios.put(`${API_URL}/content/${type}s/${editingItem._id}`, payload, getAuthConfig());
            } else {
                await axios.post(`${API_URL}/content/${type}s`, payload, getAuthConfig());
            }
            setItemForm({ name: '', logo: '', description: '', tier: 'Silver' });
            setEditingItem(null);
            refreshConfig();
            fetchData();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else {
                alert('Error saving item');
            }
        }
    };

    // --- PAST EVENTS HANDLER ---
    const [pastEventForm, setPastEventForm] = useState({ title: '', image: '', description: '' }); // Form with description
    const [editingPastEvent, setEditingPastEvent] = useState(null);

    const handlePastEventSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = getEmbedLink(pastEventForm.image);
            const payload = { ...pastEventForm, image: imageUrl };

            if (editingPastEvent) {
                await axios.put(`${API_URL}/content/pastEvents/${editingPastEvent._id}`, payload, getAuthConfig());
            } else {
                await axios.post(`${API_URL}/content/pastEvents`, payload, getAuthConfig());
            }
            setPastEventForm({ title: '', image: '', description: '' });
            setEditingPastEvent(null);
            fetchData();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else {
                alert('Error saving past event');
            }
        }
    };

    const handlePastEventDelete = async (id) => {
        if (window.confirm('Delete this event?')) {
            try {
                await axios.delete(`${API_URL}/content/pastEvents/${id}`, getAuthConfig());
                fetchData();
            } catch (error) {
                console.error(error);
                if (error.response?.status === 401) navigate('/login');
            }
        }
    };



    const deleteItem = async (id, type) => {
        if (window.confirm('Delete this item?')) {
            try {
                await axios.delete(`${API_URL}/content/${type}s/${id}`, getAuthConfig());
                refreshConfig();
                fetchData();
            } catch (error) {
                if (error.response?.status === 401) navigate('/login');
            }
        }
    };

    // --- FEST SUBCATEGORIES & DEPARTMENTS HANDLERS ---
    const handleDeptSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                code: deptForm.code.toUpperCase().trim(),
                name: deptForm.name.trim(),
                image: deptForm.image.trim(),
                order: Number(deptForm.order) || 0
            };
            if (editingDept) {
                await axios.put(`${API_URL}/content/departments/${editingDept._id}`, payload, getAuthConfig());
            } else {
                await axios.post(`${API_URL}/content/departments`, payload, getAuthConfig());
            }
            setDeptForm({ code: '', name: '', image: '', order: 0 });
            setEditingDept(null);
            refreshConfig();
            fetchData();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else {
                alert(error.response?.data?.message || 'Error saving category');
            }
        }
    };

    const deleteDept = async (id, code) => {
        if (window.confirm(`Delete category "${code}"? Events associated with this category will retain their record.`)) {
            try {
                await axios.delete(`${API_URL}/content/departments/${id}`, getAuthConfig());
                refreshConfig();
                fetchData();
            } catch (error) {
                if (error.response?.status === 401) navigate('/login');
                else alert(error.response?.data?.message || 'Error deleting category');
            }
        }
    };

    const handleCulturalSubSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                code: culturalSubForm.code.trim(),
                name: culturalSubForm.name.trim(),
                image: culturalSubForm.image.trim(),
                order: Number(culturalSubForm.order) || 0
            };
            if (editingCulturalSub) {
                await axios.put(`${API_URL}/content/cultural-subcategories/${editingCulturalSub._id}`, payload, getAuthConfig());
            } else {
                await axios.post(`${API_URL}/content/cultural-subcategories`, payload, getAuthConfig());
            }
            setCulturalSubForm({ code: '', name: '', image: '', order: 0 });
            setEditingCulturalSub(null);
            refreshConfig();
            fetchData();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else {
                alert(error.response?.data?.message || 'Error saving cultural subcategory');
            }
        }
    };

    const deleteCulturalSub = async (id, name) => {
        if (window.confirm(`Delete cultural subcategory "${name}"?`)) {
            try {
                await axios.delete(`${API_URL}/content/cultural-subcategories/${id}`, getAuthConfig());
                refreshConfig();
                fetchData();
            } catch (error) {
                if (error.response?.status === 401) navigate('/login');
                else alert(error.response?.data?.message || 'Error deleting subcategory');
            }
        }
    };

    const tabs = [
        { id: 'general', label: 'General Info' },
        { id: 'subcategories', label: 'Fest Subcategories' },
        { id: 'home_media', label: 'Home Media' },
        { id: 'popup', label: 'Popup Images' },
        { id: 'contact', label: 'Contact Details' },
        { id: 'footer', label: 'Footer Settings' },
        { id: 'about', label: 'About Page' },
        { id: 'sponsors', label: 'Sponsors' },
        { id: 'clubs', label: 'Clubs' },
        { id: 'pastEvents', label: 'Past Events' }
    ];

    return (
        <div className="flex min-h-screen bg-[#14050E] text-white font-inter flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 flex flex-col lg:ml-64">
                <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 relative z-10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <div className="w-12 h-12 border-4 border-[#D62C76] border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-400 text-sm">Loading dynamic content configuration...</p>
                        </div>
                    ) : (
                        <>
                            <header className="mb-8">
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F2D10A] via-[#F47721] to-[#D62C76]">Manage Dynamic Content</h1>
                            </header>

                            {/* Tab Navigation */}
                            <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-[#D62C76] to-[#F47721] text-white shadow-lg shadow-[#D62C76]/25 border border-white/20'
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {activeTab === 'general' && (
                                <div className="max-w-2xl space-y-6">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-5">
                                        <h3 className="text-lg font-bold text-white mb-2">General Site Settings</h3>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">Website Name</label>
                                            <input
                                                value={generalConfig.website_name}
                                                onChange={(e) => setGeneralConfig({ ...generalConfig, website_name: e.target.value })}
                                                placeholder="e.g. Kalam"
                                                className="w-full bg-black/40 border border-white/15 rounded-xl p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D62C76] transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">Event Year</label>
                                            <input
                                                value={generalConfig.event_year}
                                                onChange={(e) => setGeneralConfig({ ...generalConfig, event_year: e.target.value })}
                                                placeholder="e.g. 2026"
                                                className="w-full bg-black/40 border border-white/15 rounded-xl p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D62C76] transition-colors"
                                            />
                                        </div>
                                        <div className="flex items-center gap-4 bg-black/30 p-4 rounded-xl border border-white/10">
                                            <div className="flex-1">
                                                <label className="block text-sm font-bold text-white">Registration Status</label>
                                                <p className="text-xs text-gray-400 mt-0.5">Enable or disable all event registrations and pass purchases across the entire website.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setGeneralConfig({ ...generalConfig, registration_open: generalConfig.registration_open === 'true' ? 'false' : 'true' })}
                                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${generalConfig.registration_open === 'true' ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 'bg-gray-700'}`}
                                            >
                                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${generalConfig.registration_open === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                            <span className={`text-sm font-bold ${generalConfig.registration_open === 'true' ? 'text-emerald-400' : 'text-gray-400'}`}>
                                                {generalConfig.registration_open === 'true' ? 'Open' : 'Closed'}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                saveConfig('website_name', generalConfig.website_name);
                                                saveConfig('event_year', generalConfig.event_year);
                                                saveConfig('registration_open', generalConfig.registration_open);
                                            }}
                                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D62C76] to-[#F47721] hover:opacity-95 text-white font-bold flex items-center gap-2 shadow-lg shadow-[#D62C76]/20 transition-all cursor-pointer"
                                        >
                                            <Save size={18} /> Save General Info
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'subcategories' && (
                                <div className="space-y-8 animate-fadeIn">
                                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                            <div>
                                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                                    Fest Subcategories Management
                                                </h2>
                                                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                                    Changes made here instantly update the public Navbar, Homepage categories, Admin Sidebar, and Event Creation dropdowns.
                                                </p>
                                            </div>

                                            {/* Sub Tab Switcher */}
                                            <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/10 self-start md:self-auto">
                                                <button
                                                    type="button"
                                                    onClick={() => setSubTab('technical')}
                                                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${subTab === 'technical'
                                                        ? 'bg-gradient-to-r from-[#F5A623] to-[#F47721] text-white shadow-md'
                                                        : 'text-gray-400 hover:text-white'
                                                        }`}
                                                >
                                                    Technical Categories ({departmentsList.length})
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setSubTab('cultural')}
                                                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${subTab === 'cultural'
                                                        ? 'bg-gradient-to-r from-[#D62C76] to-[#F04438] text-white shadow-md'
                                                        : 'text-gray-400 hover:text-white'
                                                        }`}
                                                >
                                                    Cultural Subcategories ({culturalSubList.length})
                                                </button>
                                            </div>
                                        </div>

                                        {/* TECHNICAL CATEGORIES SECTION */}
                                        {subTab === 'technical' && (
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                {/* Categories List (2 cols) */}
                                                <div className="lg:col-span-2 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-base font-bold text-white/90">
                                                            Active Technical Categories ({departmentsList.length})
                                                        </h3>
                                                        <span className="text-xs text-gray-400">Sorted by Order / Code</span>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {departmentsList.map((dept) => (
                                                            <div
                                                                key={dept._id || dept.code}
                                                                className="bg-black/30 border border-white/10 p-4 rounded-xl flex items-center gap-4 group hover:border-[#F5A623]/50 transition-all"
                                                            >
                                                                <div className="w-16 h-16 rounded-lg bg-black/40 overflow-hidden shrink-0 border border-white/10 relative">
                                                                    <img
                                                                        src={getImageUrl(dept.image)}
                                                                        alt={dept.code}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80';
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30">
                                                                            {dept.code}
                                                                        </span>
                                                                        {dept.order !== undefined && (
                                                                            <span className="text-[10px] text-gray-500">#{dept.order}</span>
                                                                        )}
                                                                    </div>
                                                                    <h4 className="text-sm font-semibold text-white/90 truncate" title={dept.name}>
                                                                        {dept.name}
                                                                    </h4>
                                                                </div>

                                                                <div className="flex items-center gap-1.5 opacity-90 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setEditingDept(dept);
                                                                            setDeptForm({
                                                                                code: dept.code,
                                                                                name: dept.name,
                                                                                image: dept.image || '',
                                                                                order: dept.order || 0
                                                                            });
                                                                        }}
                                                                        className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                                                                        title="Edit Category"
                                                                    >
                                                                        <Pencil size={14} />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => deleteDept(dept._id, dept.code)}
                                                                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                                                                        title="Delete Category"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Category Add/Edit Form (1 col) */}
                                                <div className="bg-black/30 border border-white/10 p-6 rounded-xl h-fit sticky top-8">
                                                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                                                        {editingDept ? <Pencil size={16} className="text-[#F5A623]" /> : <Plus size={16} className="text-[#F5A623]" />}
                                                        {editingDept ? `Edit Category (${editingDept.name || editingDept.code})` : 'Add New Technical Category'}
                                                    </h3>

                                                    <form onSubmit={handleDeptSubmit} className="space-y-4">
                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-400 mb-1">
                                                                Category Code (Uppercase) *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={deptForm.code}
                                                                onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                                                                placeholder="e.g. HACK, PAPER, WORKSHOP"
                                                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm uppercase focus:border-[#F5A623] outline-none"
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-400 mb-1">
                                                                Category Name *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={deptForm.name}
                                                                onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                                                                placeholder="e.g. Hackathon, Paper Presentation"
                                                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm focus:border-[#F5A623] outline-none"
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-400 mb-1">
                                                                Banner / Card Image URL
                                                            </label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                                    <LinkIcon size={14} className="text-gray-500" />
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    value={deptForm.image}
                                                                    onChange={(e) => setDeptForm({ ...deptForm, image: e.target.value })}
                                                                    placeholder="https://images.unsplash.com/..."
                                                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:border-[#F5A623] outline-none"
                                                                />
                                                            </div>
                                                            {deptForm.image && (
                                                                <div className="mt-2 w-full h-24 rounded-lg overflow-hidden border border-white/10 bg-black/20">
                                                                    <img src={getImageUrl(deptForm.image)} alt="Preview" className="w-full h-full object-cover" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-400 mb-1">
                                                                Display Order Priority (Optional)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={deptForm.order}
                                                                onChange={(e) => setDeptForm({ ...deptForm, order: e.target.value })}
                                                                placeholder="0"
                                                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm focus:border-[#F5A623] outline-none"
                                                            />
                                                        </div>

                                                        <div className="pt-2 flex flex-col gap-2">
                                                            <button
                                                                type="submit"
                                                                className="w-full bg-gradient-to-r from-[#F5A623] to-[#F47721] text-white font-bold py-2.5 rounded-lg text-sm hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-[#F5A623]/20"
                                                            >
                                                                {editingDept ? 'Update Category' : 'Save Category'}
                                                            </button>

                                                            {editingDept && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEditingDept(null);
                                                                        setDeptForm({ code: '', name: '', image: '', order: 0 });
                                                                    }}
                                                                    className="w-full bg-white/10 text-gray-300 font-bold py-2.5 rounded-lg text-sm hover:bg-white/15 transition-colors cursor-pointer"
                                                                >
                                                                    Cancel Edit
                                                                </button>
                                                            )}
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        )}

                                        {/* CULTURAL SUBCATEGORIES SECTION */}
                                        {subTab === 'cultural' && (
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                {/* Cultural Subcategories List (2 cols) */}
                                                <div className="lg:col-span-2 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-base font-bold text-white/90">
                                                            Active Cultural Subcategories ({culturalSubList.length})
                                                        </h3>
                                                        <span className="text-xs text-gray-400">e.g. OnStage, OffStage, Music, Dance</span>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {culturalSubList.map((sub) => (
                                                            <div
                                                                key={sub._id || sub.code}
                                                                className="bg-black/30 border border-white/10 p-4 rounded-xl flex items-center gap-4 group hover:border-[#D62C76]/50 transition-all"
                                                            >
                                                                <div className="w-16 h-16 rounded-lg bg-black/40 overflow-hidden shrink-0 border border-white/10 relative">
                                                                    <img
                                                                        src={getImageUrl(sub.image)}
                                                                        alt={sub.name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = 'https://images.unsplash.com/photo-1514525253361-bee8a48790c3?auto=format&fit=crop&w=400&q=80';
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#D62C76]/20 text-[#D62C76] border border-[#D62C76]/30">
                                                                            {sub.code}
                                                                        </span>
                                                                        {sub.order !== undefined && (
                                                                            <span className="text-[10px] text-gray-500">#{sub.order}</span>
                                                                        )}
                                                                    </div>
                                                                    <h4 className="text-sm font-semibold text-white/90 truncate" title={sub.name}>
                                                                        {sub.name}
                                                                    </h4>
                                                                </div>

                                                                <div className="flex items-center gap-1.5 opacity-90 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setEditingCulturalSub(sub);
                                                                            setCulturalSubForm({
                                                                                code: sub.code,
                                                                                name: sub.name,
                                                                                image: sub.image || '',
                                                                                order: sub.order || 0
                                                                            });
                                                                        }}
                                                                        className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                                                                        title="Edit Subcategory"
                                                                    >
                                                                        <Pencil size={14} />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => deleteCulturalSub(sub._id, sub.name)}
                                                                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                                                                        title="Delete Subcategory"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Cultural Subcategory Form (1 col) */}
                                                <div className="bg-black/30 border border-white/10 p-6 rounded-xl h-fit sticky top-8">
                                                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                                                        {editingCulturalSub ? <Pencil size={16} className="text-[#D62C76]" /> : <Plus size={16} className="text-[#D62C76]" />}
                                                        {editingCulturalSub ? `Edit Subcategory (${editingCulturalSub.name})` : 'Add New Cultural Subcategory'}
                                                    </h3>

                                                    <form onSubmit={handleCulturalSubSubmit} className="space-y-4">
                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-400 mb-1">
                                                                Subcategory Identifier / Code *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={culturalSubForm.code}
                                                                onChange={(e) => setCulturalSubForm({ ...culturalSubForm, code: e.target.value })}
                                                                placeholder="e.g. OnStage, OffStage, Music"
                                                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm focus:border-[#D62C76] outline-none"
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-400 mb-1">
                                                                Display Name *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={culturalSubForm.name}
                                                                onChange={(e) => setCulturalSubForm({ ...culturalSubForm, name: e.target.value })}
                                                                placeholder="e.g. On Stage, Music & Bands"
                                                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm focus:border-[#D62C76] outline-none"
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-400 mb-1">
                                                                Card Banner Image URL
                                                            </label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                                    <LinkIcon size={14} className="text-gray-500" />
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    value={culturalSubForm.image}
                                                                    onChange={(e) => setCulturalSubForm({ ...culturalSubForm, image: e.target.value })}
                                                                    placeholder="https://images.unsplash.com/..."
                                                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:border-[#D62C76] outline-none"
                                                                />
                                                            </div>
                                                            {culturalSubForm.image && (
                                                                <div className="mt-2 w-full h-24 rounded-lg overflow-hidden border border-white/10 bg-black/20">
                                                                    <img src={getImageUrl(culturalSubForm.image)} alt="Preview" className="w-full h-full object-cover" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-400 mb-1">
                                                                Display Order Priority (Optional)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={culturalSubForm.order}
                                                                onChange={(e) => setCulturalSubForm({ ...culturalSubForm, order: e.target.value })}
                                                                placeholder="0"
                                                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm focus:border-[#D62C76] outline-none"
                                                            />
                                                        </div>

                                                        <div className="pt-2 flex flex-col gap-2">
                                                            <button
                                                                type="submit"
                                                                className="w-full bg-gradient-to-r from-[#D62C76] to-[#F04438] text-white font-bold py-2.5 rounded-lg text-sm hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-[#D62C76]/20"
                                                            >
                                                                {editingCulturalSub ? 'Update Subcategory' : 'Save Subcategory'}
                                                            </button>

                                                            {editingCulturalSub && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEditingCulturalSub(null);
                                                                        setCulturalSubForm({ code: '', name: '', image: '', order: 0 });
                                                                    }}
                                                                    className="w-full bg-white/10 text-gray-300 font-bold py-2.5 rounded-lg text-sm hover:bg-white/15 transition-colors cursor-pointer"
                                                                >
                                                                    Cancel Edit
                                                                </button>
                                                            )}
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'popup' && (
                                <div className="max-w-4xl animate-fadeIn space-y-6">
                                    <h3 className="text-xl font-bold mb-4">Home Screen Popup Images (Max 10)</h3>
                                    <p className="text-sm text-gray-400 mb-6">Add up to 10 images to show as a dynamic grid popup on the home screen. Recommended aspect ratio: 4:5.</p>

                                    <div className="space-y-4">
                                        {popupImages.map((imgUrl, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/10">
                                                <div className="w-24 h-32 bg-black/40 rounded-lg overflow-hidden shrink-0 border border-white/5">
                                                    {imgUrl && <img src={getImageUrl(imgUrl)} alt={`Popup ${index + 1}`} className="w-full h-full object-cover" />}
                                                </div>
                                                <div className="flex-1 space-y-2 w-full">
                                                    <label className="block text-sm text-gray-400">Image {index + 1} URL</label>
                                                    <input
                                                        value={imgUrl}
                                                        onChange={(e) => {
                                                            const newImages = [...popupImages];
                                                            newImages[index] = e.target.value;
                                                            setPopupImages(newImages);
                                                        }}
                                                        placeholder="Paste Image URL or Drive Link"
                                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => setPopupImages(popupImages.filter((_, i) => i !== index))}
                                                    className="mt-2 sm:mt-6 p-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors self-end sm:self-auto"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}

                                        {popupImages.length < 10 && (
                                            <button
                                                onClick={() => setPopupImages([...popupImages, ''])}
                                                className="flex items-center justify-center gap-2 text-sm text-blue-400 font-bold mt-4 py-4 w-full border-2 border-dashed border-white/10 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
                                            >
                                                <Plus size={18} /> Add Popup Image
                                            </button>
                                        )}
                                    </div>
                                    <button onClick={() => {
                                        saveConfig('popup_images', popupImages.filter(p => p.trim() !== '').map(getEmbedLink).join(','));
                                    }} className="bg-blue-600 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 w-full mt-8 hover:bg-blue-500 transition-all text-lg shadow-lg shadow-blue-600/20">
                                        <Save size={20} /> Save Popup Images
                                    </button>
                                </div>
                            )}

                            {activeTab === 'home_media' && (
                                <div className="space-y-12 animate-fadeIn">
                                    {/* Category Images */}
                                    <section>
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                                            Category Images
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {[
                                                { label: 'Technical', key: 'cat_technical_image' },
                                                { label: 'Cultural', key: 'cat_cultural_image' },
                                                { label: 'Non Technical', key: 'cat_nontechnical_image' },
                                                { label: 'Workshop', key: 'cat_workshop_image' }
                                            ].map(cat => (
                                                <div key={cat.key} className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                                                    <label className="block text-sm font-bold text-gray-400">{cat.label}</label>
                                                    <div className="h-40 bg-black/40 rounded-xl overflow-hidden border border-white/5">
                                                        <img src={getImageUrl(siteConfig?.[cat.key])} alt={cat.label} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <input
                                                            value={imageValues[cat.key] || ''}
                                                            onChange={(e) => setImageValues({ ...imageValues, [cat.key]: e.target.value })}
                                                            placeholder="Paste Image URL"
                                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-gray-500 focus:text-white focus:border-blue-500 outline-none transition-colors"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => saveConfig(cat.key, imageValues[cat.key], 'image')}
                                                            className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors cursor-pointer"
                                                            title="Save Image URL"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteConfigImage(cat.key, cat.label)}
                                                            disabled={!imageValues[cat.key] && !siteConfig?.[cat.key]}
                                                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-lg transition-colors border border-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                                            title={`Delete ${cat.label} Image`}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Department Images */}
                                    <section>
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                            <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
                                            Department Images
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {[
                                                'AIDS', 'CIVIL', 'CSD-CST', 'CSE', 'EEE', 'ECE', 'IT', 'MECH', 'MBA', 'MCA', 'CSECS', 'ETE-VLSI'
                                            ].map(code => (
                                                <div key={code} className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                                                    <label className="block text-sm font-bold text-gray-400">{code}</label>
                                                    <div className="h-32 bg-black/40 rounded-xl overflow-hidden border border-white/5">
                                                        <img src={getImageUrl(siteConfig?.[`dept_${code}_image`])} alt={code} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <input
                                                            value={imageValues[`dept_${code}_image`] || ''}
                                                            onChange={(e) => setImageValues({ ...imageValues, [`dept_${code}_image`]: e.target.value })}
                                                            placeholder="Paste Image URL"
                                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-gray-500 focus:text-white focus:border-purple-500 outline-none transition-colors"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => saveConfig(`dept_${code}_image`, imageValues[`dept_${code}_image`], 'image')}
                                                            className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg transition-colors cursor-pointer"
                                                            title="Save Image URL"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteConfigImage(`dept_${code}_image`, `${code} Department`)}
                                                            disabled={!imageValues[`dept_${code}_image`] && !siteConfig?.[`dept_${code}_image`]}
                                                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-lg transition-colors border border-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                                            title={`Delete ${code} Department Image`}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeTab === 'about' && (
                                <div className="max-w-4xl animate-fadeIn space-y-8">
                                    {/* About Content */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">Kalam Content</h3>
                                            <textarea
                                                value={aboutContent}
                                                onChange={(e) => setAboutContent(e.target.value)}
                                                className="w-full h-64 bg-black/20 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-blue-500"
                                                placeholder="Enter About Page content here..."
                                            />
                                            <button onClick={() => saveConfig('about_content', aboutContent)} className="mt-4 bg-blue-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                                                <Save size={18} /> Save Kalam Content
                                            </button>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold mb-4">About KCE Content</h3>
                                            <textarea
                                                value={aboutKceContent}
                                                onChange={(e) => setAboutKceContent(e.target.value)}
                                                className="w-full h-64 bg-black/20 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-blue-500"
                                                placeholder="Enter About KCE content here..."
                                            />
                                            <button onClick={() => saveConfig('about_kce_content', aboutKceContent)} className="mt-4 bg-purple-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                                                <Save size={18} /> Save KCE Content
                                            </button>
                                        </div>
                                    </div>

                                    {/* Images Configuration */}
                                    <div className="border-t border-white/10 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Kalam Logo */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">Kalam Logo</h3>
                                            <div className="mb-4 bg-white/5 p-4 rounded-2xl flex items-center justify-center w-full aspect-video border border-white/5">
                                                <img src={getImageUrl(aboutLogo)} alt="Kalam Logo" style={{ maxWidth: aboutLogoWidth }} className="max-h-full object-contain" />
                                            </div>
                                            <div className="space-y-4 font-serif">
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Logo URL/Path</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            value={aboutLogo}
                                                            onChange={(e) => setAboutLogo(e.target.value)}
                                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Logo Width (e.g., 150px)</label>
                                                    <input
                                                        value={aboutLogoWidth}
                                                        onChange={(e) => setAboutLogoWidth(e.target.value)}
                                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => {
                                                        saveConfig('about_logo', aboutLogo, 'image');
                                                        saveConfig('about_logo_width', aboutLogoWidth, 'text');
                                                    }} className="bg-blue-600 px-4 py-2 rounded-lg font-bold text-sm cursor-pointer hover:bg-blue-500 transition-colors">
                                                        Save Logo Settings
                                                    </button>
                                                    {aboutLogo && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (window.confirm('Are you sure you want to delete the Kalam Logo?')) {
                                                                    setAboutLogo('');
                                                                    saveConfig('about_logo', '', 'image');
                                                                }
                                                            }}
                                                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg font-bold text-sm border border-red-500/30 transition-colors cursor-pointer"
                                                        >
                                                            Delete Logo
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Kalam Video */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">Kalam Video (Optional)</h3>
                                            <div className="mb-4 bg-white/5 p-4 rounded-2xl flex items-center justify-center w-full aspect-video border border-white/5 overflow-hidden">
                                                {aboutVideo ? (
                                                    <video src={getImageUrl(aboutVideo)} className="w-full h-full object-contain" autoPlay muted loop />
                                                ) : (
                                                    <div className="text-gray-500 italic">No video set</div>
                                                )}
                                            </div>
                                            <div className="space-y-4 font-serif">
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Video URL (mp4, webm)</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            value={aboutVideo}
                                                            onChange={(e) => setAboutVideo(e.target.value)}
                                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2"
                                                            placeholder="Paste video URL"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => saveConfig('about_video', aboutVideo, 'video')} className="flex-1 bg-blue-600 px-4 py-2 rounded-lg font-bold text-sm">
                                                        Save Video URL
                                                    </button>
                                                    {aboutVideo && (
                                                        <button onClick={() => { setAboutVideo(''); saveConfig('about_video', '', 'video'); }} className="bg-red-600/20 text-red-500 px-4 py-2 rounded-lg font-bold text-sm border border-red-500/50">
                                                            Remove Video
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 italic">If set, this video will be displayed instead of the logo on the About page.</p>
                                            </div>
                                        </div>

                                        {/* KCE Image */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">KCE Image</h3>
                                            <div className="mb-4 bg-white p-6 rounded-2xl flex items-center justify-center w-full aspect-video shadow-inner">
                                                <img src={getImageUrl(aboutKceImage)} alt="KCE" className="max-h-full max-w-full object-contain" />
                                            </div>
                                            <div className="space-y-4 font-serif">
                                                <div className="flex gap-2">
                                                    <input
                                                        value={aboutKceImage}
                                                        onChange={(e) => setAboutKceImage(e.target.value)}
                                                        className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2"
                                                        placeholder="Image URL"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => saveConfig('about_kce_image', aboutKceImage, 'image')} className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-bold text-sm cursor-pointer transition-colors">
                                                        Save KCE Image
                                                    </button>
                                                    {aboutKceImage && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (window.confirm('Are you sure you want to delete the KCE Image?')) {
                                                                    setAboutKceImage('');
                                                                    saveConfig('about_kce_image', '', 'image');
                                                                }
                                                            }}
                                                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg font-bold text-sm border border-red-500/30 transition-colors cursor-pointer"
                                                        >
                                                            Delete Image
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* KCE Video */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">KCE Video (Optional)</h3>
                                            <div className="mb-4 bg-white/5 p-4 rounded-2xl flex items-center justify-center w-full aspect-video border border-white/5 overflow-hidden">
                                                {aboutKceVideo ? (
                                                    <video src={getImageUrl(aboutKceVideo)} className="w-full h-full object-contain" autoPlay muted loop />
                                                ) : (
                                                    <div className="text-gray-500 italic">No video set</div>
                                                )}
                                            </div>
                                            <div className="space-y-4 font-serif">
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Video URL (mp4, webm)</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            value={aboutKceVideo}
                                                            onChange={(e) => setAboutKceVideo(e.target.value)}
                                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2"
                                                            placeholder="Paste video URL"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => saveConfig('about_kce_video', aboutKceVideo, 'video')} className="flex-1 bg-purple-600 px-4 py-2 rounded-lg font-bold text-sm">
                                                        Save Video URL
                                                    </button>
                                                    {aboutKceVideo && (
                                                        <button onClick={() => { setAboutKceVideo(''); saveConfig('about_kce_video', '', 'video'); }} className="bg-red-600/20 text-red-500 px-4 py-2 rounded-lg font-bold text-sm border border-red-500/50">
                                                            Remove Video
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 italic">If set, this video will be displayed instead of the KCE image on the About page.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'rules' && (
                                <div className="max-w-4xl animate-fadeIn">
                                    <textarea
                                        value={rules}
                                        onChange={(e) => setRules(e.target.value)}
                                        className="w-full h-96 bg-black/20 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-blue-500"
                                        placeholder="Enter Rules & Regulations here..."
                                    />
                                    <button onClick={() => saveConfig('rules_content', rules)} className="mt-4 bg-blue-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                                        <Save size={18} /> Save Rules
                                    </button>

                                    <div className="mt-8 border-t border-white/10 pt-8">
                                        <h4 className="text-xl font-bold mb-4">Rules Background Image</h4>
                                        {rulesBg && (
                                            <div className="mb-4">
                                                <img src={getImageUrl(rulesBg)} alt="Rules Bg" className="w-full h-48 object-cover rounded-xl" />
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <input
                                                value={rulesBg}
                                                onChange={(e) => setRulesBg(e.target.value)}
                                                placeholder="Background Image URL"
                                                className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => saveConfig('rules_bg', rulesBg, 'image')}
                                                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-bold text-sm cursor-pointer transition-colors"
                                            >
                                                Save
                                            </button>
                                            {rulesBg && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete the Rules Background Image?')) {
                                                            setRulesBg('');
                                                            saveConfig('rules_bg', '', 'image');
                                                        }
                                                    }}
                                                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg font-bold text-sm border border-red-500/30 transition-colors cursor-pointer shrink-0"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <div className="max-w-xl space-y-6 animate-fadeIn">
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                                        <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                                            <input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="Email" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none" />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Phone Numbers</label>
                                            <div className="space-y-2">
                                                {contactPhones.map((phone, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <input
                                                            value={phone}
                                                            onChange={(e) => {
                                                                const newPhones = [...contactPhones];
                                                                newPhones[index] = e.target.value;
                                                                setContactPhones(newPhones);
                                                            }}
                                                            placeholder={`Phone Number ${index + 1}`}
                                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none"
                                                        />
                                                        {contactPhones.length > 1 && (
                                                            <button
                                                                onClick={() => setContactPhones(contactPhones.filter((_, i) => i !== index))}
                                                                className="p-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => setContactPhones([...contactPhones, ''])}
                                                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-bold mt-2"
                                                >
                                                    <Plus size={16} /> Add Another Number
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Office Address</label>
                                            <textarea value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} placeholder="Address" rows="3" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none" />
                                        </div>

                                        <button onClick={() => {
                                            saveConfig('contact_email', contact.email);
                                            saveConfig('contact_phones', contactPhones.filter(p => p.trim() !== '').join(', '));
                                            saveConfig('contact_address', contact.address);
                                        }} className="bg-blue-600 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 w-full mt-4 hover:bg-blue-500 transition-all">
                                            <Save size={18} /> Save Contact Details
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'footer' && (
                                <div className="max-w-4xl animate-fadeIn space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Desktop Video */}
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                                            <h3 className="text-xl font-bold mb-2">Desktop Footer Background</h3>
                                            <div className="aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/5 relative">
                                                {footerBgVideo ? (
                                                    /\.(mp4|webm|ogg)$/i.test(footerBgVideo) ? (
                                                        <video src={getImageUrl(footerBgVideo)} className="w-full h-full object-cover opacity-50" muted />
                                                    ) : (
                                                        <img src={getImageUrl(footerBgVideo)} className="w-full h-full object-cover opacity-50" />
                                                    )
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600">No media set</div>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    value={footerBgVideo}
                                                    onChange={(e) => setFooterBgVideo(e.target.value)}
                                                    placeholder="Enter Video/Image URL"
                                                    className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none"
                                                />
                                                <button
                                                    onClick={() => saveConfig('footer_bg_video', footerBgVideo, 'video')}
                                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-lg transition-colors"
                                                >
                                                    <Save size={18} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 italic">This background will be used for desktop screens.</p>
                                        </div>

                                        {/* Mobile Video */}
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                                            <h3 className="text-xl font-bold mb-2 text-purple-400">Mobile Footer Background</h3>
                                            <div className="aspect-[9/16] max-h-64 mx-auto bg-black/40 rounded-xl overflow-hidden border border-white/5 relative">
                                                {footerBgVideoMobile ? (
                                                    /\.(mp4|webm|ogg)$/i.test(footerBgVideoMobile) ? (
                                                        <video src={getImageUrl(footerBgVideoMobile)} className="w-full h-full object-cover opacity-50" muted />
                                                    ) : (
                                                        <img src={getImageUrl(footerBgVideoMobile)} className="w-full h-full object-cover opacity-50" />
                                                    )
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600">No media set</div>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    value={footerBgVideoMobile}
                                                    onChange={(e) => setFooterBgVideoMobile(e.target.value)}
                                                    placeholder="Enter Mobile Video URL"
                                                    className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 focus:border-purple-500 outline-none"
                                                />
                                                <button
                                                    onClick={() => saveConfig('footer_bg_video_mobile', footerBgVideoMobile, 'video')}
                                                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 rounded-lg transition-colors"
                                                >
                                                    <Save size={18} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 italic">This background will be used specifically for mobile screens.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {['sponsors', 'clubs'].includes(activeTab) && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                                    {/* List */}
                                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(activeTab === 'sponsors' ? sponsors : clubs).map(item => (
                                            <div key={item._id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4 group">
                                                {item.logo && /\.(mp4|webm|ogg)$/i.test(item.logo) ? (
                                                    <video
                                                        src={getImageUrl(item.logo)}
                                                        className="w-16 h-16 object-contain rounded-lg bg-black/20 p-1"
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                    />
                                                ) : (
                                                    <img
                                                        src={getImageUrl(item.logo)}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-contain rounded-lg bg-black/20 p-1"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64?text=Logo'; }}
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <h3 className="font-bold">{item.name}</h3>
                                                    {activeTab === 'sponsors' && (
                                                        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                                                            {item.tier || 'Silver'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setEditingItem(item); setItemForm(item); }} className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"><Pencil size={14} /></button>
                                                    <button onClick={() => deleteItem(item._id, activeTab === 'sponsors' ? 'sponsor' : 'club')} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Form */}
                                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl h-fit sticky top-8">
                                        <h3 className="font-bold mb-4">{editingItem ? 'Edit Item' : 'Add New'}</h3>
                                        <form onSubmit={(e) => handleItemSubmit(e, activeTab === 'sponsors' ? 'sponsor' : 'club')} className="space-y-4">
                                            <input
                                                value={itemForm.name}
                                                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                                                placeholder="Name"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-2"
                                                required
                                            />

                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                    <LinkIcon size={16} className="text-gray-500" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={itemForm.logo || ''}
                                                    onChange={(e) => setItemForm({ ...itemForm, logo: e.target.value })}
                                                    placeholder="Logo URL"
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none"
                                                    required
                                                />
                                            </div>

                                            {activeTab === 'sponsors' && (
                                                <div>
                                                    <label className="block text-xs text-gray-400 mb-1">Sponsor Tier</label>
                                                    <select
                                                        value={itemForm.tier || 'Silver'}
                                                        onChange={(e) => setItemForm({ ...itemForm, tier: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm focus:border-blue-500 outline-none"
                                                    >
                                                        <option value="Title">Title Sponsor</option>
                                                        <option value="Platinum">Platinum Sponsor</option>
                                                        <option value="Gold">Gold Sponsor</option>
                                                        <option value="Silver">Silver Sponsor</option>
                                                        <option value="Associate">Associate Sponsor</option>
                                                    </select>
                                                </div>
                                            )}


                                            <button type="submit" className="w-full bg-blue-600 py-2 rounded-lg font-bold">Save</button>
                                            {editingItem && (
                                                <button type="button" onClick={() => { setEditingItem(null); setItemForm({ name: '', logo: '', description: '', tier: 'Silver' }); }} className="w-full bg-gray-600 py-2 rounded-lg font-bold mt-2">Cancel</button>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'pastEvents' && (
                                <div className="space-y-12 animate-fadeIn">
                                    {/* Static Content Configuration */}
                                    <div className="max-w-4xl space-y-6">
                                        <h3 className="text-xl font-bold border-b border-white/10 pb-2">Page Content</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">General Description</label>
                                                <textarea
                                                    value={pastEventDesc}
                                                    onChange={(e) => setPastEventDesc(e.target.value)}
                                                    placeholder="Enter general description like 'KCE Kalam Events Join us...'"
                                                    rows="4"
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">Subheading</label>
                                                <input
                                                    value={pastEventSubheading}
                                                    onChange={(e) => setPastEventSubheading(e.target.value)}
                                                    placeholder="e.g. Unleash Your Potential at Kalam"
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {pastEventHighlights.map((highlight, idx) => (
                                                    <div key={idx}>
                                                        <label className="block text-sm text-gray-400 mb-1">Highlight {idx + 1}</label>
                                                        <input
                                                            value={highlight}
                                                            onChange={(e) => {
                                                                const newHighlights = [...pastEventHighlights];
                                                                newHighlights[idx] = e.target.value;
                                                                setPastEventHighlights(newHighlights);
                                                            }}
                                                            placeholder={`Highlight ${idx + 1}`}
                                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <button onClick={() => {
                                                saveConfig('past_event_desc', pastEventDesc);
                                                saveConfig('past_event_subheading', pastEventSubheading);
                                                saveConfig('past_highlight_1', pastEventHighlights[0]);
                                                saveConfig('past_highlight_2', pastEventHighlights[1]);
                                                saveConfig('past_highlight_3', pastEventHighlights[2]);
                                                saveConfig('past_highlight_4', pastEventHighlights[3]);
                                            }} className="bg-blue-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                                                <Save size={18} /> Save Page Content
                                            </button>
                                        </div>
                                    </div>

                                    {/* Event Gallery Management */}
                                    <div>
                                        <h3 className="text-xl font-bold border-b border-white/10 pb-4 mb-6">Gallery Images</h3>
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            {/* List */}
                                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {pastEvents.map(event => (
                                                    <div key={event._id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-4 group">
                                                        <div className="relative h-64 rounded-lg overflow-hidden">
                                                            <img src={getImageUrl(event.image)} alt={event.title} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <h3 className="font-bold text-white text-xl">{event.title}</h3>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingPastEvent(event); setPastEventForm({ title: event.title, image: event.image, description: event.description || '' }); }} className="flex-1 bg-blue-500/20 text-blue-400 py-2 rounded hover:bg-blue-500/30 transition-colors flex justify-center"><Pencil size={16} /></button>
                                                            <button onClick={() => handlePastEventDelete(event._id)} className="flex-1 bg-red-500/20 text-red-400 py-2 rounded hover:bg-red-500/30 transition-colors flex justify-center"><Trash2 size={16} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Form */}
                                            <div className="bg-white/5 border border-white/10 p-6 rounded-xl h-fit sticky top-8">
                                                <h3 className="font-bold mb-4">{editingPastEvent ? 'Edit Event' : 'Add New Event'}</h3>
                                                <form onSubmit={handlePastEventSubmit} className="space-y-4">
                                                    <div>
                                                        <label className="block text-xs text-gray-400 mb-1">Event Title</label>
                                                        <input
                                                            value={pastEventForm.title}
                                                            onChange={(e) => setPastEventForm({ ...pastEventForm, title: e.target.value })}
                                                            placeholder="e.g. Hackathon 2024"
                                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="relative">
                                                        <label className="block text-xs text-gray-400 mb-1">Image URL</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                                <LinkIcon size={16} className="text-gray-500" />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={pastEventForm.image || ''}
                                                                onChange={(e) => setPastEventForm({ ...pastEventForm, image: e.target.value })}
                                                                placeholder="https://..."
                                                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none"
                                                                required
                                                                autoComplete="off"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs text-gray-400 mb-1">Short Description (Optional)</label>
                                                        <textarea
                                                            value={pastEventForm.description || ''}
                                                            onChange={(e) => setPastEventForm({ ...pastEventForm, description: e.target.value })}
                                                            placeholder="Event description..."
                                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm"
                                                            rows="2"
                                                        />
                                                    </div>



                                                    <button type="submit" className="w-full bg-blue-600 py-2 rounded-lg font-bold">
                                                        {editingPastEvent ? 'Update Event' : 'Add Event'}
                                                    </button>
                                                    {editingPastEvent && (
                                                        <button type="button" onClick={() => { setEditingPastEvent(null); setPastEventForm({ title: '', image: '', description: '' }); }} className="w-full bg-gray-600 py-2 rounded-lg font-bold mt-2">Cancel</button>
                                                    )}
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main >
            </div >
        </div >
    );
};

export default ManageContent;
