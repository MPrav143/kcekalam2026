import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus,
    X,
    Edit,
    Trash2,
    RotateCcw,
    Palette,
    Check,
    Sparkles,
    Sliders,
    Type,
    ArrowUp,
    ArrowDown,
    Upload,
    Image as ImageIcon,
    Eye,
    Crown,
    Star,
    QrCode,
    Sparkle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import PassCard from '../components/PassCard';
import { LUXURY_PRESETS, parseColor } from '../utils/passColorUtils';
import { API_URL } from '../utils/config';
import { useHasPageBackground } from '../components/PageBackground';

const DEFAULT_PRESET = LUXURY_PRESETS[0];

const CURRENCIES = [
    { symbol: '₹', label: 'INR (₹)' },
    { symbol: '$', label: 'USD ($)' },
    { symbol: '€', label: 'EUR (€)' },
    { symbol: '£', label: 'GBP (£)' },
    { symbol: 'AED', label: 'AED' },
    { symbol: 'S$', label: 'SGD (S$)' },
];

const DEFAULT_FORM_DATA = {
    name: 'VIP',
    price: '1500',
    type: 'VIP ACCESS',
    currency: '₹',
    eventName: 'KALAM',
    eventYear: '2026',
    description: 'FULL FESTIVAL ACCESS',
    buttonText: 'GET MY PASS',
    registrationUrl: 'https://rzp.io/rzp/pFFSOtNd',
    customLogo: '',
    perks: [
        'All Technical Sessions & Keynotes',
        'Workshop Admission',
        'Official Delegate Kit'
    ],
    color: DEFAULT_PRESET.primaryColor,
    isActive: true,
    themeConfig: {
        presetId: DEFAULT_PRESET.id,
        backgroundColor: DEFAULT_PRESET.backgroundColor,
        secondaryBgColor: DEFAULT_PRESET.secondaryBgColor,
        primaryColor: DEFAULT_PRESET.primaryColor,
        secondaryColor: DEFAULT_PRESET.secondaryColor,
        accentColor: DEFAULT_PRESET.accentColor,
        borderColor: DEFAULT_PRESET.borderColor,
        dividerColor: DEFAULT_PRESET.dividerColor,
        titleColor: DEFAULT_PRESET.titleColor,
        textColor: DEFAULT_PRESET.textColor,
        priceColor: DEFAULT_PRESET.priceColor,
        iconColor: DEFAULT_PRESET.iconColor,
        artworkColor: DEFAULT_PRESET.artworkColor,
        buttonBgColor: DEFAULT_PRESET.buttonBgColor,
        buttonTextColor: DEFAULT_PRESET.buttonTextColor,
        glitterColor: DEFAULT_PRESET.glitterColor,
        doodleColor: DEFAULT_PRESET.doodleColor,
        glowColor: DEFAULT_PRESET.glowColor,
        showGlitter: true,
        showDoodles: true,
        doodleOpacity: 0.28,
        qrFgColor: DEFAULT_PRESET.qrFgColor,
        qrBgColor: DEFAULT_PRESET.qrBgColor,
        pricingUnit: '/ person',
        emblemType: 'crown',
        showIdentity: true,
        showCrown: true,
        showDescription: true,
        showPerks: true,
        showArtwork: true,
        showQr: true,
        showYear: true,
    }
};

const ManagePasses = () => {
    const hasBgImage = useHasPageBackground();
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentPass, setCurrentPass] = useState(null);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('content'); // 'content' | 'colors' | 'design'

    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

    const getAuthConfig = () => {
        const token = localStorage.getItem('adminToken');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    useEffect(() => {
        fetchPasses();
    }, []);

    const fetchPasses = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/passes`);
            setPasses(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch passes:', error);
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setCurrentPass(null);
        setFormData({
            ...DEFAULT_FORM_DATA,
            perks: [
                'All Technical Sessions & Keynotes',
                'Workshop Admission',
                'Official Delegate Kit'
            ],
            themeConfig: { ...DEFAULT_FORM_DATA.themeConfig }
        });
        setActiveTab('content');
        setShowModal(true);
    };

    const handleEdit = (pass) => {
        setCurrentPass(pass);
        const parsed = parseColor(pass.color);
        const tc = pass.themeConfig || {};
        const matchedPreset = LUXURY_PRESETS.find(p => p.id === tc.presetId || p.primaryColor.toUpperCase() === parsed.hex.toUpperCase()) || DEFAULT_PRESET;

        setFormData({
            name: pass.name || '',
            price: pass.price || '',
            type: pass.type || 'VIP ACCESS',
            currency: pass.currency || '₹',
            eventName: pass.eventName || 'KALAM',
            eventYear: pass.eventYear || '2026',
            description: pass.description || 'FULL FESTIVAL ACCESS',
            buttonText: pass.buttonText || 'GET MY PASS',
            registrationUrl: pass.registrationUrl || '',
            customLogo: pass.customLogo || '',
            perks: pass.perks && pass.perks.length > 0 ? pass.perks : [''],
            color: tc.primaryColor || parsed.hex,
            isActive: pass.isActive ?? true,
            themeConfig: {
                presetId: tc.presetId || matchedPreset.id,
                backgroundColor: tc.backgroundColor || matchedPreset.backgroundColor,
                secondaryBgColor: tc.secondaryBgColor || matchedPreset.secondaryBgColor,
                primaryColor: tc.primaryColor || parsed.hex,
                secondaryColor: tc.secondaryColor || matchedPreset.secondaryColor,
                accentColor: tc.accentColor || matchedPreset.accentColor,
                borderColor: tc.borderColor || matchedPreset.borderColor,
                dividerColor: tc.dividerColor || matchedPreset.dividerColor,
                titleColor: tc.titleColor || matchedPreset.titleColor,
                textColor: tc.textColor || matchedPreset.textColor,
                priceColor: tc.priceColor || matchedPreset.priceColor,
                iconColor: tc.iconColor || matchedPreset.iconColor,
                artworkColor: tc.artworkColor || matchedPreset.artworkColor,
                buttonBgColor: tc.buttonBgColor || matchedPreset.buttonBgColor,
                buttonTextColor: tc.buttonTextColor || matchedPreset.buttonTextColor,
                glitterColor: tc.glitterColor || matchedPreset.glitterColor,
                doodleColor: tc.doodleColor || matchedPreset.doodleColor,
                glowColor: tc.glowColor || matchedPreset.glowColor,
                showGlitter: tc.showGlitter !== false,
                showDoodles: tc.showDoodles !== false,
                doodleOpacity: typeof tc.doodleOpacity === 'number' ? tc.doodleOpacity : 0.28,
                qrFgColor: tc.qrFgColor || matchedPreset.qrFgColor,
                qrBgColor: tc.qrBgColor || matchedPreset.qrBgColor,
                pricingUnit: tc.pricingUnit || pass.pricingUnit || '/ person',
                emblemType: tc.emblemType || 'crown',
                showIdentity: tc.showIdentity !== false,
                showCrown: tc.showCrown !== false,
                showDescription: tc.showDescription !== false,
                showPerks: tc.showPerks !== false,
                showArtwork: tc.showArtwork !== false,
                showQr: tc.showQr !== false,
                showYear: tc.showYear !== false,
            }
        });
        setActiveTab('content');
        setShowModal(true);
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData(prev => ({ ...prev, [e.target.name]: value }));
    };

    const handleThemeConfigChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            themeConfig: {
                ...prev.themeConfig,
                [key]: value
            }
        }));
    };

    // Apply complete preset to the card
    const handleSelectPreset = (preset) => {
        setFormData(prev => ({
            ...prev,
            color: preset.primaryColor,
            themeConfig: {
                ...prev.themeConfig,
                presetId: preset.id,
                backgroundColor: preset.backgroundColor,
                secondaryBgColor: preset.secondaryBgColor,
                primaryColor: preset.primaryColor,
                secondaryColor: preset.secondaryColor,
                accentColor: preset.accentColor,
                borderColor: preset.borderColor,
                dividerColor: preset.dividerColor,
                titleColor: preset.titleColor,
                textColor: preset.textColor,
                priceColor: preset.priceColor,
                iconColor: preset.iconColor,
                artworkColor: preset.artworkColor,
                buttonBgColor: preset.buttonBgColor,
                buttonTextColor: preset.buttonTextColor,
                glitterColor: preset.glitterColor,
                doodleColor: preset.doodleColor,
                glowColor: preset.glowColor,
                qrFgColor: preset.qrFgColor,
                qrBgColor: preset.qrBgColor,
            }
        }));
    };

    // Reusable Color Control with Swatch, Live Picker, and Hex Input
    const renderColorInput = (label, colorKey, defaultVal = '#D4AF37') => {
        const rawVal = formData.themeConfig?.[colorKey] || defaultVal;
        const isValidHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(rawVal);
        const pickerVal = isValidHex ? (rawVal.length === 4 ? `#${rawVal[1]}${rawVal[1]}${rawVal[2]}${rawVal[2]}${rawVal[3]}${rawVal[3]}` : rawVal) : '#D4AF37';

        return (
            <div key={colorKey} className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-white/25 transition-all">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span
                        className="w-3.5 h-3.5 rounded-full border border-white/40 shrink-0 shadow-sm"
                        style={{ backgroundColor: pickerVal }}
                    />
                    <span className="text-xs text-white/90 font-medium truncate">{label}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <input
                        type="text"
                        value={rawVal}
                        onChange={(e) => {
                            const val = e.target.value;
                            handleThemeConfigChange(colorKey, val);
                            if (colorKey === 'primaryColor') {
                                setFormData(prev => ({ ...prev, color: val }));
                            }
                        }}
                        placeholder="#RRGGBB"
                        maxLength={7}
                        className="w-20 px-2 py-1 rounded-lg bg-black/70 border border-white/15 text-[11px] font-mono text-white text-center uppercase tracking-wider focus:outline-none focus:border-[#8B5CF6]"
                    />
                    <input
                        type="color"
                        value={pickerVal}
                        onChange={(e) => {
                            handleThemeConfigChange(colorKey, e.target.value);
                            if (colorKey === 'primaryColor') {
                                setFormData(prev => ({ ...prev, color: e.target.value }));
                            }
                        }}
                        className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0 bg-transparent shrink-0"
                    />
                </div>
            </div>
        );
    };

    // Inclusions / Perks Management
    const handlePerkChange = (index, value) => {
        const newPerks = [...formData.perks];
        newPerks[index] = value;
        setFormData(prev => ({ ...prev, perks: newPerks }));
    };

    const addPerk = () => {
        setFormData(prev => ({ ...prev, perks: [...prev.perks, ''] }));
    };

    const removePerk = (index) => {
        const newPerks = formData.perks.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, perks: newPerks.length > 0 ? newPerks : [''] }));
    };

    const movePerk = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= formData.perks.length) return;
        const newPerks = [...formData.perks];
        const temp = newPerks[index];
        newPerks[index] = newPerks[newIndex];
        newPerks[newIndex] = temp;
        setFormData(prev => ({ ...prev, perks: newPerks }));
    };

    // Logo Upload Handling
    const handleLogoUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('File size exceeds 2MB limit. Please choose a smaller image.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, customLogo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClearLogo = () => {
        setFormData(prev => ({ ...prev, customLogo: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const parsed = parseColor(formData.themeConfig?.primaryColor || formData.color);
        const payload = {
            ...formData,
            color: parsed.hex,
            perks: formData.perks.filter((p) => p && p.trim()),
        };

        setSaving(true);
        try {
            if (currentPass) {
                await axios.put(`${API_URL}/passes/${currentPass._id || currentPass.id}`, payload, getAuthConfig());
            } else {
                await axios.post(`${API_URL}/passes`, payload, getAuthConfig());
            }
            setShowModal(false);
            setSaving(false);
            fetchPasses();
        } catch (error) {
            console.error('Error saving pass:', error);
            setSaving(false);
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
                window.location.href = '/login';
            } else {
                const errMsg = error.response?.data?.message || error.message || 'Error saving pass';
                alert(`Error: ${errMsg}`);
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this pass? This cannot be undone.')) return;
        try {
            await axios.delete(`${API_URL}/passes/${id}`, getAuthConfig());
            fetchPasses();
        } catch (error) {
            console.error('Error deleting pass:', error);
            alert('Failed to delete pass.');
        }
    };

    return (
        <div className={`flex min-h-screen ${hasBgImage ? 'bg-transparent' : 'bg-[#0a0715]'} text-white`}>
            <Sidebar />

            <div className="flex-1 flex flex-col lg:ml-64 p-6 md:p-10 max-w-7xl w-full">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30 mb-2">
                            <Crown size={12} /> KALAM 2026 Luxury Passes
                        </div>
                        <h1 className="text-3xl font-bold font-heading text-white">Manage Festival Passes</h1>
                        <p className="text-sm text-[#D8D4F0]/70 mt-1">
                            Configure admission passes with customizable editorial themes, dynamic pricing, and scannable QR codes.
                        </p>
                    </div>

                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-[#8B5CF6]/25 transition-all cursor-pointer"
                    >
                        <Plus size={18} /> Create New Pass
                    </button>
                </div>

                {/* Passes Grid */}
                {loading ? (
                    <div className="py-20 flex justify-center"><Loader /></div>
                ) : passes.length === 0 ? (
                    <div className="text-center py-20 bg-[#140612]/60 rounded-3xl border border-white/10 p-8 max-w-md mx-auto">
                        <Crown className="mx-auto text-white/30 mb-3" size={40} />
                        <h3 className="text-lg font-bold text-white mb-1">No Passes Created Yet</h3>
                        <p className="text-xs text-[#D8D4F0]/60 mb-5">Create your first admission pass tier for KALAM 2026.</p>
                        <button
                            onClick={handleOpenCreate}
                            className="inline-flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-xl text-xs font-semibold"
                        >
                            <Plus size={16} /> Create Pass
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {passes.map((pass) => (
                            <PassCard
                                key={pass._id}
                                pass={pass}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal: Pass Editor & Real-Time Live Preview */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
                    <div className="bg-[#0e0a1a] border border-white/15 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30">
                                    <Crown size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold font-heading text-white">
                                        {currentPass ? `Edit ${currentPass.name || 'Pass'}` : 'Create Festival Pass'}
                                    </h2>
                                    <p className="text-xs text-[#D8D4F0]/60">Customize luxury styling, inclusions, pricing, and scannable QR details.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-white/50 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body: Two Columns (Form left, Sticky Preview right) */}
                        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left Column: Configuration Controls (7 cols) */}
                            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
                                {/* Navigation Tabs */}
                                <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('content')}
                                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                                            activeTab === 'content'
                                                ? 'bg-[#8B5CF6] text-white shadow-md'
                                                : 'text-white/60 hover:text-white'
                                        }`}
                                    >
                                        <Type size={14} /> Content
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('colors')}
                                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                                            activeTab === 'colors'
                                                ? 'bg-[#8B5CF6] text-white shadow-md'
                                                : 'text-white/60 hover:text-white'
                                        }`}
                                    >
                                        <Palette size={14} /> Colors & Themes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('design')}
                                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                                            activeTab === 'design'
                                                ? 'bg-[#8B5CF6] text-white shadow-md'
                                                : 'text-white/60 hover:text-white'
                                        }`}
                                    >
                                        <Sliders size={14} /> Visibility & Options
                                    </button>
                                </div>

                                {/* TAB 1: PASS CONTENT */}
                                {activeTab === 'content' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-[#D8D4F0] uppercase tracking-wider mb-1.5">
                                                    Pass Title (Oversized Hero) *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="e.g. VIP"
                                                    className="w-full bg-[#14050E]/90 border border-white/15 focus:border-[#8B5CF6] rounded-xl p-3 text-sm text-white focus:outline-none"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-[#D8D4F0] uppercase tracking-wider mb-1.5">
                                                    Pass Type Label (Badge)
                                                </label>
                                                <input
                                                    type="text"
                                                    name="type"
                                                    value={formData.type}
                                                    onChange={handleChange}
                                                    placeholder="VIP ACCESS"
                                                    className="w-full bg-[#14050E]/90 border border-white/15 focus:border-[#8B5CF6] rounded-xl p-3 text-sm text-white focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Price, Currency, and Unit */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-[#D8D4F0] uppercase tracking-wider mb-1.5">
                                                    Currency
                                                </label>
                                                <select
                                                    name="currency"
                                                    value={formData.currency}
                                                    onChange={handleChange}
                                                    className="w-full bg-[#14050E] border border-white/15 focus:border-[#8B5CF6] rounded-xl p-3 text-sm text-white focus:outline-none [&>option]:bg-[#14050E]"
                                                >
                                                    {CURRENCIES.map(c => (
                                                        <option key={c.symbol} value={c.symbol}>{c.label}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-[#D8D4F0] uppercase tracking-wider mb-1.5">
                                                    Price *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    placeholder="1500"
                                                    className="w-full bg-[#14050E]/90 border border-white/15 focus:border-[#8B5CF6] rounded-xl p-3 text-sm text-white focus:outline-none"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-[#D8D4F0] uppercase tracking-wider mb-1.5">
                                                    Pricing Unit
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.themeConfig?.pricingUnit || '/ person'}
                                                    onChange={(e) => handleThemeConfigChange('pricingUnit', e.target.value)}
                                                    placeholder="/ person"
                                                    className="w-full bg-[#14050E]/90 border border-white/15 focus:border-[#8B5CF6] rounded-xl p-3 text-sm text-white focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-xs font-semibold text-[#D8D4F0] uppercase tracking-wider mb-1.5">
                                                Short Description / Subtitle
                                            </label>
                                            <input
                                                type="text"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                placeholder="FULL FESTIVAL ACCESS"
                                                className="w-full bg-[#14050E]/90 border border-white/15 focus:border-[#8B5CF6] rounded-xl p-3 text-sm text-white focus:outline-none"
                                            />
                                        </div>

                                        {/* Branding & Year */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-[#D8D4F0] uppercase tracking-wider mb-1.5">
                                                    Festival Branding
                                                </label>
                                                <input
                                                    type="text"
                                                    name="eventName"
                                                    value={formData.eventName}
                                                    onChange={handleChange}
                                                    placeholder="KALAM"
                                                    className="w-full bg-[#14050E]/90 border border-white/15 focus:border-[#8B5CF6] rounded-xl p-3 text-sm text-white focus:outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-[#D8D4F0] uppercase tracking-wider mb-1.5">
                                                    Festival Year
                                                </label>
                                                <input
                                                    type="text"
                                                    name="eventYear"
                                                    value={formData.eventYear}
                                                    onChange={handleChange}
                                                    placeholder="2026"
                                                    className="w-full bg-[#14050E]/90 border border-white/15 focus:border-[#8B5CF6] rounded-xl p-3 text-sm text-white focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* CTA Button & QR / Registration URL */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-[#D8D4F0] uppercase tracking-wider mb-1.5">
                                                    Button Label
                                                </label>
                                                <input
                                                    type="text"
                                                    name="buttonText"
                                                    value={formData.buttonText}
                                                    onChange={handleChange}
                                                    placeholder="GET MY PASS"
                                                    className="w-full bg-[#14050E]/90 border border-white/15 focus:border-[#8B5CF6] rounded-xl p-3 text-sm text-white focus:outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-[#D8D4F0] uppercase tracking-wider mb-1.5">
                                                    Registration / QR Destination URL
                                                </label>
                                                <input
                                                    type="url"
                                                    name="registrationUrl"
                                                    value={formData.registrationUrl}
                                                    onChange={handleChange}
                                                    placeholder="https://rzp.io/rzp/..."
                                                    className="w-full bg-[#14050E]/90 border border-white/15 focus:border-[#8B5CF6] rounded-xl p-3 text-sm text-white focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Inclusions List Manager */}
                                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                                                    <Check size={14} className="text-[#6EE7B7]" />
                                                    <span>Inclusions & Privileges ({formData.perks.length})</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={addPerk}
                                                    className="text-xs text-[#8B5CF6] hover:text-[#C4B5FD] font-semibold flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Plus size={14} /> Add Privilege
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                {formData.perks.map((perk, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <div className="flex flex-col gap-0.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => movePerk(index, -1)}
                                                                disabled={index === 0}
                                                                className="text-white/40 hover:text-white disabled:opacity-20 cursor-pointer"
                                                                title="Move Up"
                                                            >
                                                                <ArrowUp size={12} />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => movePerk(index, 1)}
                                                                disabled={index === formData.perks.length - 1}
                                                                className="text-white/40 hover:text-white disabled:opacity-20 cursor-pointer"
                                                                title="Move Down"
                                                            >
                                                                <ArrowDown size={12} />
                                                            </button>
                                                        </div>

                                                        <input
                                                            type="text"
                                                            value={perk}
                                                            onChange={(e) => handlePerkChange(index, e.target.value)}
                                                            placeholder={`Privilege #${index + 1}`}
                                                            className="flex-1 bg-[#14050E] border border-white/15 focus:border-[#8B5CF6] rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none"
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() => removePerk(index)}
                                                            className="p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 cursor-pointer"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 2: COLOR THEME ENGINE */}
                                {activeTab === 'colors' && (
                                    <div className="space-y-6">
                                        {/* Curated Luxury Presets */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2.5">
                                                <span className="text-xs font-semibold text-white uppercase tracking-wider block">
                                                    Curated Luxury Color Presets
                                                </span>
                                                <span className="text-[11px] text-white/50">1-click complete palette setup</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                                {LUXURY_PRESETS.map((preset) => {
                                                    const isSelected = formData.themeConfig?.presetId === preset.id;
                                                    return (
                                                        <button
                                                            key={preset.id}
                                                            type="button"
                                                            onClick={() => handleSelectPreset(preset)}
                                                            className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                                                                isSelected
                                                                    ? 'bg-white/10 border-white ring-2 ring-white/30 shadow-lg'
                                                                    : 'bg-white/[0.02] border-white/10 hover:border-white/30 hover:bg-white/[0.04]'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between w-full">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="w-4 h-4 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: preset.backgroundColor }} title="Background" />
                                                                    <span className="w-4 h-4 rounded-full border border-white/40 shadow-sm -ml-2" style={{ backgroundColor: preset.primaryColor }} title="Primary / Border" />
                                                                    <span className="w-4 h-4 rounded-full border border-white/40 shadow-sm -ml-2" style={{ backgroundColor: preset.accentColor }} title="Accent / Glitter" />
                                                                </div>
                                                                {isSelected && <Check size={14} className="text-[#6EE7B7]" />}
                                                            </div>
                                                            <span className="text-xs font-bold text-white mt-1">{preset.name}</span>
                                                            <span className="text-[10px] text-white/50 leading-tight">{preset.subtitle}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Granular Color Controls - 9 Core Customization Controls */}
                                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                                <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                    Dynamic Color Controls (9 Attributes)
                                                </span>
                                                <span className="text-[10px] text-white/50">Type hex or use color picker</span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                {/* 1. Main Background */}
                                                {renderColorInput('1. Card Background', 'backgroundColor', DEFAULT_PRESET.backgroundColor)}
                                                
                                                {/* 2. Secondary Background / Gradient */}
                                                {renderColorInput('2. Gradient Bottom Stop', 'secondaryBgColor', DEFAULT_PRESET.secondaryBgColor)}

                                                {/* 3. Outer Border */}
                                                {renderColorInput('3. Card Outer Border', 'borderColor', DEFAULT_PRESET.borderColor)}

                                                {/* 4. Title & Heading */}
                                                {renderColorInput('4. Title & Heading Color', 'titleColor', DEFAULT_PRESET.titleColor)}

                                                {/* 5. Body Text */}
                                                {renderColorInput('5. Body & Privilege Text', 'textColor', DEFAULT_PRESET.textColor)}

                                                {/* 6. Accent & Divider */}
                                                {renderColorInput('6. Accent & Dividers', 'accentColor', DEFAULT_PRESET.accentColor)}

                                                {/* 7. Glitter & Sparkles */}
                                                {renderColorInput('7. Glitter & Sparkle Color', 'glitterColor', DEFAULT_PRESET.glitterColor)}

                                                {/* 8. Doodles Color */}
                                                {renderColorInput('8. Doodle Illustration Color', 'doodleColor', DEFAULT_PRESET.doodleColor)}

                                                {/* 9. Glow & Highlight */}
                                                {renderColorInput('9. Glow & Edge Illumination', 'glowColor', DEFAULT_PRESET.glowColor)}

                                                {/* CTA Button Background */}
                                                {renderColorInput('CTA Button Background', 'buttonBgColor', DEFAULT_PRESET.buttonBgColor)}

                                                {/* CTA Button Text */}
                                                {renderColorInput('CTA Button Text Color', 'buttonTextColor', DEFAULT_PRESET.buttonTextColor)}

                                                {/* Price Text Highlight */}
                                                {renderColorInput('Price Number Color', 'priceColor', DEFAULT_PRESET.priceColor)}
                                            </div>
                                        </div>

                                        {/* Visual FX Toggles: Glitter, Shine & Doodles */}
                                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3.5">
                                            <span className="text-xs font-bold text-white uppercase tracking-wider block">
                                                Glitter, Shine & Doodles Configuration
                                            </span>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer">
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles size={15} className="text-[#F7E7A9]" />
                                                        <span className="text-xs text-white/90">Metallic Glitter & Stars</span>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.themeConfig?.showGlitter !== false}
                                                        onChange={(e) => handleThemeConfigChange('showGlitter', e.target.checked)}
                                                        className="w-4 h-4 accent-[#8B5CF6]"
                                                    />
                                                </label>

                                                <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer">
                                                    <div className="flex items-center gap-2">
                                                        <Crown size={15} className="text-[#D4AF37]" />
                                                        <span className="text-xs text-white/90">Elegant Vector Doodles</span>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.themeConfig?.showDoodles !== false}
                                                        onChange={(e) => handleThemeConfigChange('showDoodles', e.target.checked)}
                                                        className="w-4 h-4 accent-[#8B5CF6]"
                                                    />
                                                </label>
                                            </div>

                                            {formData.themeConfig?.showDoodles !== false && (
                                                <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-4">
                                                    <span className="text-xs text-white/80 shrink-0">Doodle Intensity / Opacity:</span>
                                                    <div className="flex items-center gap-3 flex-1 max-w-xs">
                                                        <input
                                                            type="range"
                                                            min="0.10"
                                                            max="0.80"
                                                            step="0.02"
                                                            value={formData.themeConfig?.doodleOpacity ?? 0.28}
                                                            onChange={(e) => handleThemeConfigChange('doodleOpacity', parseFloat(e.target.value))}
                                                            className="w-full accent-[#8B5CF6] cursor-pointer"
                                                        />
                                                        <span className="text-xs font-mono text-white/90 w-10 text-right">
                                                            {Math.round((formData.themeConfig?.doodleOpacity ?? 0.28) * 100)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* TAB 3: DESIGN & VISIBILITY */}
                                {activeTab === 'design' && (
                                    <div className="space-y-4">
                                        {/* Emblem Selector */}
                                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                                            <span className="text-xs font-semibold text-white uppercase tracking-wider block">
                                                Top Emblem Style
                                            </span>
                                            <div className="grid grid-cols-3 gap-2.5">
                                                {[
                                                    { id: 'crown', label: 'Royal Crown', icon: Crown },
                                                    { id: 'star', label: 'Geometric Star', icon: Star },
                                                    { id: 'none', label: 'No Emblem', icon: X }
                                                ].map((emb) => (
                                                    <button
                                                        key={emb.id}
                                                        type="button"
                                                        onClick={() => handleThemeConfigChange('emblemType', emb.id)}
                                                        className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer ${
                                                            (formData.themeConfig?.emblemType || 'crown') === emb.id
                                                                ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white'
                                                                : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                                                        }`}
                                                    >
                                                        <emb.icon size={14} />
                                                        <span>{emb.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Element Visibility Toggles */}
                                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                                            <span className="text-xs font-semibold text-white uppercase tracking-wider block mb-2">
                                                Element Visibility Toggles
                                            </span>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <label className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/10 cursor-pointer">
                                                    <span className="text-xs text-white/80">Top Identity Header</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.themeConfig?.showIdentity !== false}
                                                        onChange={(e) => handleThemeConfigChange('showIdentity', e.target.checked)}
                                                        className="w-4 h-4 accent-[#8B5CF6]"
                                                    />
                                                </label>

                                                <label className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/10 cursor-pointer">
                                                    <span className="text-xs text-white/80">Short Description</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.themeConfig?.showDescription !== false}
                                                        onChange={(e) => handleThemeConfigChange('showDescription', e.target.checked)}
                                                        className="w-4 h-4 accent-[#8B5CF6]"
                                                    />
                                                </label>

                                                <label className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/10 cursor-pointer">
                                                    <span className="text-xs text-white/80">Inclusions List</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.themeConfig?.showPerks !== false}
                                                        onChange={(e) => handleThemeConfigChange('showPerks', e.target.checked)}
                                                        className="w-4 h-4 accent-[#8B5CF6]"
                                                    />
                                                </label>

                                                <label className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/10 cursor-pointer">
                                                    <span className="text-xs text-white/80">Signature Artwork</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.themeConfig?.showArtwork !== false}
                                                        onChange={(e) => handleThemeConfigChange('showArtwork', e.target.checked)}
                                                        className="w-4 h-4 accent-[#8B5CF6]"
                                                    />
                                                </label>

                                                <label className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/10 cursor-pointer">
                                                    <span className="text-xs text-white/80">Integrated QR Code</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.themeConfig?.showQr !== false}
                                                        onChange={(e) => handleThemeConfigChange('showQr', e.target.checked)}
                                                        className="w-4 h-4 accent-[#8B5CF6]"
                                                    />
                                                </label>

                                                <label className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/10 cursor-pointer">
                                                    <span className="text-xs text-white/80">Active for Public</span>
                                                    <input
                                                        type="checkbox"
                                                        name="isActive"
                                                        checked={formData.isActive}
                                                        onChange={handleChange}
                                                        className="w-4 h-4 accent-[#8B5CF6]"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Form Footer Action Buttons */}
                                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="py-2.5 px-5 rounded-xl border border-white/20 text-xs sm:text-sm font-semibold text-[#D8D4F0] hover:text-white hover:bg-white/5 cursor-pointer"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-[#8B5CF6]/30 cursor-pointer disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : currentPass ? 'Save Pass Changes' : 'Create Pass'}
                                    </button>
                                </div>
                            </form>

                            {/* Right Column: Sticky Live Real-Time Interactive Preview (5 cols) */}
                            <div className="lg:col-span-5 flex flex-col items-center sticky top-2">
                                <div className="w-full flex items-center justify-between mb-3 px-2">
                                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                        <Eye size={14} className="text-[#6EE7B7]" />
                                        <span>Live Card Preview</span>
                                    </span>
                                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#6EE7B7] bg-[#087F5B]/20 border border-[#087F5B]/40 px-2 py-0.5 rounded">
                                        Real-time
                                    </span>
                                </div>

                                <div className="w-full flex justify-center py-2">
                                    <PassCard
                                        pass={formData}
                                        isPreview={true}
                                        className="transform scale-[0.95] sm:scale-100 origin-top"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePasses;
