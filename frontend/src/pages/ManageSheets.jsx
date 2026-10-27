import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import {
    FileSpreadsheet,
    Database,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    Copy,
    Check,
    Zap,
    Save,
    Clock,
    ShieldCheck,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    Layers,
    Server,
    Calendar,
    Ticket,
    Sliders,
    Building2,
    Users,
    Sparkles,
    Film,
    UserCheck
} from 'lucide-react';
import { API_URL } from '../utils/config';

const COLLECTION_ICONS = {
    Events: Calendar,
    Passes: Ticket,
    SiteConfig: Sliders,
    Departments: Building2,
    CulturalSubcategories: Sparkles,
    Clubs: Users,
    PastEvents: Film,
    Admins: UserCheck
};

const ManageSheets = () => {
    const [loading, setLoading] = useState(true);
    const [scriptUrl, setScriptUrl] = useState('');
    const [savedUrl, setSavedUrl] = useState('');
    const [dbInfo, setDbInfo] = useState({
        name: 'kalam',
        cluster: 'kalam.kz35dtp.mongodb.net',
        status: 'Connected'
    });
    const [collections, setCollections] = useState({});
    const [totalRecords, setTotalRecords] = useState(0);
    const [testStatus, setTestStatus] = useState(null);
    const [syncStatus, setSyncStatus] = useState(null);
    const [syncingCollection, setSyncingCollection] = useState({});
    const [savingUrl, setSavingUrl] = useState(false);
    const [scriptCode, setScriptCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    const getAuthConfig = () => {
        const token = localStorage.getItem('adminToken');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const fetchConfigAndStats = async () => {
        try {
            setLoading(true);
            const [configRes, templateRes] = await Promise.all([
                axios.get(`${API_URL}/sheets/config`, getAuthConfig()),
                axios.get(`${API_URL}/sheets/template`, getAuthConfig()).catch(() => ({ data: { scriptCode: '' } }))
            ]);

            const currentUrl = configRes.data.scriptUrl || '';
            setScriptUrl(currentUrl);
            setSavedUrl(currentUrl);
            setDbInfo(configRes.data.database || {
                name: 'kalam',
                cluster: 'kalam.kz35dtp.mongodb.net',
                status: 'Connected'
            });
            setCollections(configRes.data.collections || {});
            setTotalRecords(configRes.data.totalRecords || 0);

            if (templateRes.data?.scriptCode) {
                setScriptCode(templateRes.data.scriptCode);
            }

            if (currentUrl) {
                testConnection(currentUrl);
            }
        } catch (error) {
            console.error('Error loading sheets config:', error);
            if (error.response?.status === 401) {
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfigAndStats();
    }, []);

    const handleSaveUrl = async () => {
        try {
            setSavingUrl(true);
            const res = await axios.post(`${API_URL}/sheets/config`, { scriptUrl: scriptUrl.trim() }, getAuthConfig());
            setSavedUrl(res.data.scriptUrl);
            alert('Google Sheets Web App URL saved successfully!');
            testConnection(res.data.scriptUrl);
        } catch (error) {
            console.error('Failed to save URL:', error);
            alert(error.response?.data?.message || 'Failed to save Google Sheets URL');
        } finally {
            setSavingUrl(false);
        }
    };

    const testConnection = async (urlToTest = scriptUrl) => {
        const target = (urlToTest || '').trim();
        if (!target) {
            setTestStatus({
                loading: false,
                success: false,
                message: 'Please enter a Google Apps Script Web App URL first.'
            });
            return;
        }

        try {
            setTestStatus({ loading: true, success: false, message: 'Pinging Google Sheets Web App...' });
            const res = await axios.post(`${API_URL}/sheets/test`, { scriptUrl: target }, getAuthConfig());

            if (res.data.success) {
                setTestStatus({
                    loading: false,
                    success: true,
                    message: res.data.message || 'Connected to Google Sheets successfully!',
                    spreadsheetTitle: res.data.spreadsheetTitle,
                    sheets: res.data.sheets
                });
            } else {
                setTestStatus({
                    loading: false,
                    success: false,
                    message: res.data.message || 'Connection failed'
                });
            }
        } catch (error) {
            setTestStatus({
                loading: false,
                success: false,
                message: error.response?.data?.message || error.message || 'Could not connect to Google Apps Script'
            });
        }
    };

    const handleSyncAllDatabase = async () => {
        if (!savedUrl) {
            alert('Please configure and save your Google Apps Script URL before syncing.');
            return;
        }

        const confirmSync = window.confirm(
            `Are you sure you want to synchronize all MongoDB Atlas collections (${totalRecords} records across ${Object.keys(collections).length} collections) into Google Sheets?\n\nThis will create/update dedicated tabs for Events, Passes, SiteConfig, Departments, Clubs, Cultural, Past Events, and Admins.`
        );
        if (!confirmSync) return;

        try {
            setSyncStatus({ loading: true, success: false, message: 'Mirroring MongoDB Atlas collections into Google Sheets...' });
            const res = await axios.post(`${API_URL}/sheets/sync`, {}, getAuthConfig());

            if (res.data.success) {
                setSyncStatus({
                    loading: false,
                    success: true,
                    message: res.data.message,
                    counts: res.data.counts
                });
                fetchConfigAndStats();
            } else {
                setSyncStatus({
                    loading: false,
                    success: false,
                    message: res.data.message || 'Sync failed.'
                });
            }
        } catch (error) {
            setSyncStatus({
                loading: false,
                success: false,
                message: error.response?.data?.message || error.message || 'Synchronization failed'
            });
        }
    };

    const handleSyncSingleCollection = async (colName) => {
        if (!savedUrl) {
            alert('Please configure and save your Google Apps Script URL first.');
            return;
        }

        try {
            setSyncingCollection(prev => ({ ...prev, [colName]: true }));
            const res = await axios.post(`${API_URL}/sheets/sync/${colName}`, {}, getAuthConfig());

            if (res.data.success) {
                alert(`Collection "${colName}" synced to Google Sheets (${res.data.rowCount} records)!`);
            } else {
                alert(`Failed to sync ${colName}: ${res.data.message}`);
            }
        } catch (error) {
            console.error('Sync collection error:', error);
            alert(error.response?.data?.message || `Failed to sync ${colName}`);
        } finally {
            setSyncingCollection(prev => ({ ...prev, [colName]: false }));
        }
    };

    const handleCopyScript = () => {
        if (!scriptCode) return;
        navigator.clipboard.writeText(scriptCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-[#14050E] text-white">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader text="Connecting to MongoDB Atlas & Google Sheets..." />
                </div>
            </div>
        );
    }

    const isConnected = testStatus?.success === true;

    return (
        <div className="flex min-h-screen bg-[#14050E] text-white font-inter flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 flex flex-col lg:ml-64">
                <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 max-w-7xl w-full relative z-10">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/10 pb-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                    <Database className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                                        MongoDB Atlas & Google Sheets Database Sync
                                    </h1>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Live database connector for <span className="text-cyan-400 font-mono">{dbInfo.cluster}</span>
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-300 mt-3 text-sm max-w-3xl leading-relaxed">
                                Connect the live MongoDB Atlas database directly with Google Sheets. All website database collections—including
                                <span className="text-white font-semibold"> Events, Passes, Site Configurations, Departments, Clubs, Cultural Categories, and Past Events</span>—are
                                mirrored into dedicated, styled tabs in your Google Spreadsheet.
                            </p>
                        </div>

                        {/* Status Badge */}
                        <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border backdrop-blur-md shadow-md shrink-0 ${
                            isConnected
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                : testStatus?.loading
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        }`}>
                            <div className={`w-2.5 h-2.5 rounded-full ${
                                isConnected
                                    ? 'bg-emerald-400 animate-pulse'
                                    : testStatus?.loading
                                    ? 'bg-amber-400 animate-ping'
                                    : 'bg-rose-500'
                            }`} />
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                {testStatus?.loading
                                    ? 'Verifying...'
                                    : isConnected
                                    ? `Sheets Connected`
                                    : 'Sheets Disconnected'}
                            </span>
                        </div>
                    </div>

                    {/* MongoDB Atlas Database Info Card */}
                    <div className="bg-[#180614]/80 border border-white/10 rounded-2xl p-5 mb-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                                <Server className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Connected Database (.env)</span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        MongoDB Atlas Live
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white font-mono mt-0.5">
                                    mongodb+srv://...@{dbInfo.cluster}/{dbInfo.name}
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Database name: <span className="text-white font-semibold">{dbInfo.name}</span> • Total records: <span className="text-white font-semibold">{totalRecords} documents</span> across {Object.keys(collections).length} collections
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={fetchConfigAndStats}
                                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-colors flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center"
                                title="Refresh Database Document Counts"
                            >
                                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                                Refresh Database Counts
                            </button>
                        </div>
                    </div>

                    {/* Multi-Collection Grid */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-emerald-400" />
                                    MongoDB Atlas Collections Synced to Google Sheets Tabs
                                </h2>
                                <p className="text-xs text-gray-400">
                                    Each collection maps to its own color-coded, formatted tab in the Google Spreadsheet.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Object.entries(collections).map(([key, col]) => {
                                const IconComponent = COLLECTION_ICONS[key] || Database;
                                const isSyncingThis = syncingCollection[key];

                                return (
                                    <div
                                        key={key}
                                        className="bg-[#180614]/70 border border-white/10 hover:border-white/20 rounded-2xl p-5 backdrop-blur-md transition-all shadow-lg flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-2 mb-3">
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                                                    style={{
                                                        backgroundColor: `${col.color}20`,
                                                        borderColor: `${col.color}40`,
                                                        color: col.color
                                                    }}
                                                >
                                                    <IconComponent size={20} />
                                                </div>
                                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10 text-gray-400">
                                                    Tab: {key}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-bold text-white font-heading">{col.label}</h3>
                                            <div className="flex items-baseline gap-2 mt-1">
                                                <span className="text-2xl font-extrabold text-white">{col.count}</span>
                                                <span className="text-xs text-gray-400">documents</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2">
                                            <span className="text-[11px] text-gray-400">Sheet: <code className="text-emerald-400">{key}</code></span>
                                            <button
                                                type="button"
                                                onClick={() => handleSyncSingleCollection(key)}
                                                disabled={isSyncingThis || !savedUrl}
                                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[11px] font-semibold text-gray-300 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                                                title={`Sync only the ${key} collection tab to Google Sheets`}
                                            >
                                                {isSyncingThis ? (
                                                    <RefreshCw size={12} className="animate-spin text-cyan-400" />
                                                ) : (
                                                    <Zap size={12} className="text-emerald-400" />
                                                )}
                                                Sync Tab
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Master Database Sync Action Banner */}
                    <div className="bg-gradient-to-r from-emerald-950/60 via-[#180614] to-cyan-950/60 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 mb-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
                                    <Zap size={14} className="text-emerald-400" />
                                    Full MongoDB Database Export & Mirror
                                </div>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                                    Sync Entire MongoDB Database to Google Sheets
                                </h2>
                                <p className="text-gray-300 text-sm mt-1.5 leading-relaxed">
                                    Exports all <span className="text-white font-semibold">{totalRecords} documents</span> from
                                    Events, Passes, Site Configurations, Departments, Clubs, Cultural Categories, Past Events, and Admins into separate, styled tabs in your Google Sheet, along with a live <code className="text-emerald-400">DB_Overview</code> dashboard tab.
                                </p>
                            </div>

                            <button
                                onClick={handleSyncAllDatabase}
                                disabled={syncStatus?.loading || !savedUrl}
                                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2.5 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {syncStatus?.loading ? (
                                    <>
                                        <RefreshCw size={18} className="animate-spin" />
                                        <span>Syncing All Collections...</span>
                                    </>
                                ) : (
                                    <>
                                        <FileSpreadsheet size={18} />
                                        <span>Sync All Collections to Sheets</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Sync Status Banner */}
                        {syncStatus && (
                            <div className={`mt-6 p-4 rounded-xl border flex items-center justify-between gap-3 animate-fadeInUp ${
                                syncStatus.success
                                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                                    : syncStatus.loading
                                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                                    : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                            }`}>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    {syncStatus.loading ? (
                                        <RefreshCw size={16} className="animate-spin text-cyan-400" />
                                    ) : syncStatus.success ? (
                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                    ) : (
                                        <AlertCircle size={16} className="text-rose-400" />
                                    )}
                                    <span>{syncStatus.message}</span>
                                </div>
                                <button
                                    onClick={() => setSyncStatus(null)}
                                    className="text-xs opacity-70 hover:opacity-100 underline cursor-pointer"
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Google Apps Script Configuration Card */}
                    <div className="bg-[#180614]/80 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md shadow-xl">
                        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                                    <FileSpreadsheet size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Google Sheets Web App URL</h3>
                                    <p className="text-xs text-gray-400">
                                        Your deployed Apps Script Web App endpoint from your Google Spreadsheet
                                    </p>
                                </div>
                            </div>

                            {savedUrl && (
                                <a
                                    href={savedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                                    title="Open Web App in new tab"
                                >
                                    <span>Test Endpoint</span>
                                    <ExternalLink size={12} />
                                </a>
                            )}
                        </div>

                        {/* Input Row */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                                    Web App Deployment URL (starts with https://script.google.com/macros/s/.../exec)
                                </label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="url"
                                        value={scriptUrl}
                                        onChange={(e) => setScriptUrl(e.target.value)}
                                        placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                                        className="flex-1 bg-black/50 border border-white/15 focus:border-emerald-400 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-gray-600 focus:outline-none transition-all shadow-inner"
                                    />
                                    <button
                                        onClick={handleSaveUrl}
                                        disabled={savingUrl || scriptUrl === savedUrl}
                                        className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-md"
                                    >
                                        {savingUrl ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                                        <span>Save URL</span>
                                    </button>
                                    <button
                                        onClick={() => testConnection(scriptUrl)}
                                        disabled={testStatus?.loading || !scriptUrl}
                                        className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 border border-white/10"
                                    >
                                        <RefreshCw size={16} className={testStatus?.loading ? 'animate-spin' : ''} />
                                        <span>Test Connection</span>
                                    </button>
                                </div>
                            </div>

                            {/* Test Status Feedback */}
                            {testStatus && (
                                <div className={`p-4 rounded-xl border flex items-center justify-between text-xs sm:text-sm animate-fadeIn ${
                                    testStatus.success
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                        : testStatus.loading
                                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        {testStatus.loading ? (
                                            <RefreshCw size={16} className="animate-spin text-cyan-400" />
                                        ) : testStatus.success ? (
                                            <CheckCircle2 size={16} className="text-emerald-400" />
                                        ) : (
                                            <AlertCircle size={16} className="text-rose-400" />
                                        )}
                                        <span>{testStatus.message}</span>
                                        {testStatus.spreadsheetTitle && (
                                            <span className="font-semibold text-white ml-1">
                                                (Sheet: "{testStatus.spreadsheetTitle}")
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setTestStatus(null)}
                                        className="opacity-70 hover:opacity-100 cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Interactive Setup Guide Toggle */}
                    <div className="bg-[#180614]/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl mb-12">
                        <button
                            onClick={() => setShowGuide(!showGuide)}
                            className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <HelpCircle className="w-5 h-5 text-emerald-400" />
                                <div>
                                    <h3 className="font-bold text-white text-base">
                                        4-Step Google Apps Script Setup Guide (Copy & Paste Code)
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Click to view full Apps Script code with multi-collection MongoDB Atlas synchronization
                                    </p>
                                </div>
                            </div>
                            {showGuide ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                        </button>

                        {showGuide && (
                            <div className="p-6 border-t border-white/10 bg-black/40 space-y-6 animate-fadeIn">
                                {/* Steps */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs mb-2">1</div>
                                        <h4 className="font-semibold text-sm text-white">Create Google Sheet</h4>
                                        <p className="text-xs text-gray-400 mt-1">Open <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">sheets.new</a> in your browser to create a new spreadsheet.</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs mb-2">2</div>
                                        <h4 className="font-semibold text-sm text-white">Open Apps Script</h4>
                                        <p className="text-xs text-gray-400 mt-1">Click <strong>Extensions &gt; Apps Script</strong> in your Google Sheet menu bar.</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs mb-2">3</div>
                                        <h4 className="font-semibold text-sm text-white">Paste Code</h4>
                                        <p className="text-xs text-gray-400 mt-1">Delete existing code in <code className="text-cyan-300">Code.gs</code> and paste the script below.</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs mb-2">4</div>
                                        <h4 className="font-semibold text-sm text-white">Deploy Web App</h4>
                                        <p className="text-xs text-gray-400 mt-1">Click <strong>Deploy &gt; New deployment &gt; Web app</strong>. Set access to <strong>"Anyone"</strong> and copy URL.</p>
                                    </div>
                                </div>

                                {/* Script Code Display */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Google Apps Script Code (Code.gs)
                                        </label>
                                        <button
                                            onClick={handleCopyScript}
                                            className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-500/30"
                                        >
                                            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                            <span>{copied ? 'Copied to Clipboard!' : 'Copy Script Code'}</span>
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <pre className="bg-black/80 border border-white/10 rounded-xl p-4 text-xs font-mono text-cyan-200 overflow-x-auto max-h-96 leading-relaxed">
                                            {scriptCode || '// Loading script template...'}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ManageSheets;
