import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Filter, X, Save, Edit, Trash2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import EventDetailsModal from '../components/EventDetailsModal';

import { useParams, Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import { DEPARTMENTS as DEFAULT_DEPTS, CULTURAL_SUBCATEGORIES as DEFAULT_SUBS } from '../utils/constants';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { API_URL } from '../utils/config';
import { useHasPageBackground } from '../components/PageBackground';

const ManageEvents = () => {
    const hasBgImage = useHasPageBackground();
    const { departments, culturalSubcategories } = useGlobalConfig();
    const { category, subcategory } = useParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [selectedDetailsEvent, setSelectedDetailsEvent] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        eventDescription: '',
        date: '',
        venue: '',
        eventType: 'Normal', // Added eventType for specific classification
        category: 'Technical',
        department: '',
        club: '',
        image: '',
        pptTemplateUrl: '',
        rounds: [{ name: '', description: '' }],
        rules: [''],
        fromTime: '', // Added fromTime
        toTime: '',   // Added toTime
        runnerPrize: '', // Added runner prize
        artistName: '', // Added artistName
        theme: [''], // Changed to array for multiple topics
        generalPrize: [''], // Added general prize array
        facultyCoordinators: [],
        studentCoordinators: [],
        resourcePerson: '',
        resourcePersonPosition: '',
        resourcePersonCompany: '',
        gender: '', // Added gender
        teamPrice: '', // Added teamPrice
    });

    const getAuthConfig = () => {
        const token = localStorage.getItem('adminToken');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    useEffect(() => {
        fetchEvents();
    }, [category, subcategory]); // Re-fetch or re-filter when params change

    const fetchEvents = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/events`);
            setEvents(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    // Filter events based on URL params and search
    const filteredEvents = events.filter(e => {
        // Category Filter
        if (category) {
            if (category === 'Technical') {
                // For Technical view, include explicitly 'Technical' events AND specialized types
                const techTypes = ['Technical', 'Workshop', 'Hackathon', 'Ideathon', 'Paper Presentation', 'Project Presentation', 'Non Technical'];
                if (!techTypes.includes(e.category)) return false;
            } else if (e.category !== category) {
                return false;
            }
        }

        // Subcategory Filter (Department or Club depending on context)
        if (subcategory && subcategory !== 'All') {
            const decodedSub = decodeURIComponent(subcategory);
            if (e.department !== subcategory &&
                e.department !== decodedSub &&
                e.eventType !== subcategory &&
                e.eventType !== decodedSub) return false;
        }

        // Search Filter
        const s = searchTerm.toLowerCase();
        return (
            e.title.toLowerCase().includes(s) ||
            (e.venue && e.venue.toLowerCase().includes(s)) ||
            (e.department && e.department.toLowerCase().includes(s))
        );
    });


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const handleCoordinatorChange = (index, field, value, type) => {
        const listName = type === 'faculty' ? 'facultyCoordinators' : 'studentCoordinators';
        const newCoordinators = [...formData[listName]];
        newCoordinators[index][field] = value;
        setFormData({ ...formData, [listName]: newCoordinators });
    };

    const addCoordinator = (type) => {
        const listName = type === 'faculty' ? 'facultyCoordinators' : 'studentCoordinators';
        setFormData({ ...formData, [listName]: [...formData[listName], { name: '', phone: '' }] });
    };

    const removeCoordinator = (index, type) => {
        const listName = type === 'faculty' ? 'facultyCoordinators' : 'studentCoordinators';
        const newCoordinators = formData[listName].filter((_, i) => i !== index);
        setFormData({ ...formData, [listName]: newCoordinators });
    };

    // Rounds Handling
    const handleRoundChange = (index, field, value) => {
        const newRounds = [...formData.rounds];
        newRounds[index][field] = value;
        setFormData({ ...formData, rounds: newRounds });
    };

    const addRound = () => {
        setFormData({ ...formData, rounds: [...formData.rounds, { name: '', description: '' }] });
    };

    const removeRound = (index) => {
        const newRounds = formData.rounds.filter((_, i) => i !== index);
        setFormData({ ...formData, rounds: newRounds });
    };

    // Rules Handling
    const handleRuleChange = (index, value) => {
        const newRules = [...formData.rules];
        newRules[index] = value;
        setFormData({ ...formData, rules: newRules });
    };

    const addRule = () => {
        setFormData({ ...formData, rules: [...formData.rules, ''] });
    };

    const removeRule = (index) => {
        const newRules = formData.rules.filter((_, i) => i !== index);
        setFormData({ ...formData, rules: newRules });
    };

    // Theme Handling (Multiple Topics)
    const handleThemeChange = (index, value) => {
        const newThemes = [...formData.theme];
        newThemes[index] = value;
        setFormData({ ...formData, theme: newThemes });
    };

    const addTheme = () => {
        setFormData({ ...formData, theme: [...formData.theme, ''] });
    };

    const removeTheme = (index) => {
        const newThemes = formData.theme.filter((_, i) => i !== index);
        setFormData({ ...formData, theme: newThemes });
    };

    // General Prize Handling
    const handleGeneralPrizeChange = (index, value) => {
        const newPrizes = [...formData.generalPrize];
        newPrizes[index] = value;
        setFormData({ ...formData, generalPrize: newPrizes });
    };

    const addGeneralPrize = () => {
        setFormData({ ...formData, generalPrize: [...formData.generalPrize, ''] });
    };

    const removeGeneralPrize = (index) => {
        const newPrizes = formData.generalPrize.filter((_, i) => i !== index);
        setFormData({ ...formData, generalPrize: newPrizes });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Construct a fallback timings string if needed, or backend can handle it.
            // But let's keep data consistent if we want to support both.
            // Ensure Description is passed correctly
            // Clean up the payload before sending
            const cleanPayload = {
                ...formData,
                description: formData.eventDescription || formData.description,
                timings: `${formData.fromTime} - ${formData.toTime}`,
                rounds: formData.rounds.filter(r => isNotEmpty(r.name)),
                rules: formData.rules.filter(r => isNotEmpty(r)),
                theme: formData.theme.filter(t => isNotEmpty(t)),
                generalPrize: formData.generalPrize.filter(p => isNotEmpty(p)),
                facultyCoordinators: formData.facultyCoordinators.filter(c => isNotEmpty(c.name)),
                studentCoordinators: formData.studentCoordinators.filter(c => isNotEmpty(c.name))
            };

            // Sanitize numeric fields - Mongoose fails if these are empty strings
            if (cleanPayload.teamPrice === '' || cleanPayload.teamPrice === null) {
                delete cleanPayload.teamPrice;
            } else {
                cleanPayload.teamPrice = Number(cleanPayload.teamPrice);
            }

            if (cleanPayload.registrationFee === '' || cleanPayload.registrationFee === null) {
                delete cleanPayload.registrationFee;
            } else if (cleanPayload.registrationFee) {
                cleanPayload.registrationFee = Number(cleanPayload.registrationFee);
            }

            // Ensure date is not an empty string if it's required by schema
            if (!cleanPayload.date) {
                delete cleanPayload.date;
            }

            console.log('Final Cleaned Payload:', cleanPayload);

            // Helper to check for meaningful content
            function isNotEmpty(str) {
                if (str === null || str === undefined) return false;
                if (typeof str !== 'string') return true; // Non-string objects are not "empty"
                return str.trim() !== '';
            }

            if (currentEvent) {
                await axios.put(`${API_URL}/events/${currentEvent._id}`, cleanPayload, getAuthConfig());
            } else {
                await axios.post(`${API_URL}/events`, cleanPayload, getAuthConfig());
            }
            setShowModal(false);
            resetForm();
            fetchEvents();
        } catch (error) {
            console.error('Save Event Error Details:', error.response?.data);
            console.error(error);
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
                window.location.href = '/login';
            } else {
                alert('Error saving event');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await axios.delete(`${API_URL}/events/${id}`, getAuthConfig());
                fetchEvents();
            } catch (error) {
                console.error(error);
                if (error.response?.status === 401) {
                    window.location.href = '/login';
                }
            }
        }
    };

    const handleEdit = (event) => {
        setCurrentEvent(event);

        // Attempt to split legacy timings if fromTime/toTime are missing
        let fromTime = event.fromTime || '';
        let toTime = event.toTime || '';

        if (!fromTime && !toTime && event.timings && event.timings.includes('-')) {
            const parts = event.timings.split('-');
            fromTime = parts[0].trim();
            toTime = parts[1].trim();
        }

        // Safely extract date string YYYY-MM-DD for the date input
        let dateVal = '';
        try {
            if (event.date) {
                const d = new Date(event.date);
                if (!isNaN(d.getTime())) {
                    dateVal = d.toISOString().split('T')[0];
                }
            }
        } catch (e) {
            console.error("Date parsing error:", e);
        }

        setFormData({
            title: event.title || '',
            eventDescription: event.eventDescription || event.description || '',
            date: dateVal,
            venue: event.venue || '',
            category: event.category || 'Technical',
            eventType: event.eventType || 'Normal',
            department: event.department || '',
            club: event.club || '',
            image: event.image || '',
            pptTemplateUrl: event.pptTemplateUrl || '',
            rounds: Array.isArray(event.rounds) && event.rounds.length > 0
                ? event.rounds
                : (event.rounds && typeof event.rounds === 'string')
                    ? [{ name: 'Round Details', description: event.rounds }]
                    : [{ name: '', description: '' }],
            rules: Array.isArray(event.rules) && event.rules.length > 0
                ? event.rules
                : (event.rules && typeof event.rules === 'string')
                    ? event.rules.split('\n').filter(r => r.trim() !== '')
                    : [''],
            fromTime: fromTime,
            toTime: toTime,
            winnerPrize: event.winnerPrize || '',
            runnerPrize: event.runnerPrize || '',
            generalPrize: Array.isArray(event.generalPrize) && event.generalPrize.length > 0
                ? event.generalPrize
                : (event.prize && typeof event.prize === 'string' && !event.winnerPrize)
                    ? [event.prize]
                    : [''],
            artistName: event.artistName || '',
            theme: Array.isArray(event.theme) && event.theme.length > 0
                ? event.theme
                : (event.theme && typeof event.theme === 'string')
                    ? [event.theme]
                    : [''],
            facultyCoordinators: event.facultyCoordinators || [],
            studentCoordinators: event.studentCoordinators || event.coordinators || [],
            resourcePerson: event.resourcePerson || '',
            resourcePersonPosition: event.resourcePersonPosition || '',
            resourcePersonCompany: event.resourcePersonCompany || '',
            gender: event.gender || '',
            teamPrice: event.teamPrice || ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setCurrentEvent(null);
        setFormData({
            title: '',
            eventDescription: '',
            date: '',
            venue: '',
            category: category || 'Technical',
            eventType: category === 'Technical' ? 'Normal' :
                category === 'Workshop' ? 'Workshop' :
                    category === 'Cultural' ? 'Cultural' :
                        category === 'Non Technical' ? 'Non Technical' : 'Normal',
            department: subcategory && subcategory !== 'All' ? subcategory : '',
            club: '',
            image: '',
            pptTemplateUrl: '',
            rounds: [{ name: '', description: '' }],
            rules: [''],
            fromTime: '',
            toTime: '',
            winnerPrize: '',
            runnerPrize: '',
            generalPrize: [''],
            artistName: '',
            theme: [''],
            facultyCoordinators: [],
            studentCoordinators: [],
            resourcePerson: '',
            resourcePersonPosition: '',
            resourcePersonCompany: ''
        });
    };

    const openModal = () => {
        resetForm();
        setShowModal(true);
    };

    return (
        <div className={`flex min-h-screen ${hasBgImage ? 'bg-transparent' : 'bg-[#14050E] bg-cosmic-grid'} text-white font-inter flex-col md:flex-row`}>
            <Sidebar />
            <div className="flex-1 flex flex-col lg:ml-64">
                <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F2D10A] via-[#F47721] to-[#D62C76]">
                                {subcategory ? `${subcategory} Events` : category ? `${category} Events` : 'Manage Events'}
                            </h1>
                            <div className="text-gray-400 mt-1 flex items-center gap-2 text-sm">
                                {category && <span className="px-2 py-0.5 bg-[#24BCE0]/20 text-[#24BCE0] rounded border border-[#24BCE0]/40">{category}</span>}
                                {subcategory && <span>/</span>}
                                {subcategory && <span className="px-2 py-0.5 bg-[#D62C76]/20 text-[#D62C76] rounded border border-[#D62C76]/40">{subcategory}</span>}
                            </div>
                        </div>
                        <button onClick={openModal} className="bg-gradient-to-r from-[#D62C76] to-[#F47721] hover:from-[#c22066] hover:to-[#df6615] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-[#D62C76]/20 transition-all cursor-pointer">
                            <Plus size={20} /> Add {subcategory && subcategory !== 'All' ? subcategory : category || ''} Event
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, venue or dept..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <Loader text="Loading events..." />
                    ) : filteredEvents.length === 0 ? (
                        <div className="text-center text-gray-500 py-12 bg-white/5 rounded-xl border border-white/5 border-dashed">
                            No events found in {subcategory || category}.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredEvents.map(event => (
                                <div key={event._id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 group">
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={getImageUrl(event.image) || 'https://via.placeholder.com/400x200?text=No+Image'}
                                            alt={event.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                                        />
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/20">
                                            {event.department || event.category}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{event.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.eventDescription || event.description}</p>
                                        <div className="flex gap-3 mt-auto lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex-wrap">
                                            <button onClick={() => setSelectedDetailsEvent(event)} className="w-full flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 py-2 rounded-lg transition-colors border border-blue-500/20 text-sm font-medium mb-1">
                                                <ExternalLink size={16} /> View Participants
                                            </button>
                                            <button onClick={() => handleEdit(event)} className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg transition-colors border border-white/10 text-sm font-medium">
                                                <Edit size={16} /> Edit
                                            </button>
                                            <button onClick={() => handleDelete(event._id)} className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg transition-colors border border-red-500/20 text-sm font-medium">
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Edit/Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl custom-scrollbar">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#1a1a1a] z-10">
                            <h2 className="text-2xl font-bold text-white">{currentEvent ? 'Edit Event' : 'Create New Event'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Event Title" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" required />
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors [&>option]:bg-[#1a1a1a] [&>option]:text-white ">
                                        <option value="Technical">Technical</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Non Technical">Non Technical</option>
                                        <option value="Cultural">Cultural</option>
                                    </select>

                                    {/* Event Type for Technical Category */}
                                    {formData.category === 'Technical' && (
                                        <select name="eventType" value={formData.eventType} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors [&>option]:bg-[#1a1a1a] [&>option]:text-white ">
                                            <option value="Normal">General Technical</option>
                                            <option value="Hackathon">Hackathon</option>
                                            <option value="Ideathon">Ideathon</option>
                                            <option value="Paper Presentation">Paper Presentation</option>
                                            <option value="Project Presentation">Project Presentation</option>
                                        </select>
                                    )}



                                    {/* Department Field - Always show if Technical or if subcategory maps to it */}
                                    {/* Department Field - Conditional Rendering based on Category */}
                                    {['Technical', 'Non Technical', 'Workshop'].includes(formData.category) ? (
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                                        >
                                            <option value="">Select Department</option>
                                            {(departments && departments.length > 0 ? departments : DEFAULT_DEPTS).map(dept => (
                                                <option key={dept.code} value={dept.code}>
                                                    {dept.code} - {dept.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : formData.category === 'Cultural' ? (
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                                            required
                                        >
                                            <option value="">Select Cultural Subcategory</option>
                                            {(culturalSubcategories && culturalSubcategories.length > 0 ? culturalSubcategories : DEFAULT_SUBS).map(sub => (
                                                <option key={sub.code} value={sub.code}>
                                                    {sub.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            placeholder="Department / Sub-type"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors"
                                        />
                                    )}

                                    {/* Club Field - Hide if Technical */}
                                    {formData.category !== 'Technical' && (
                                        <input name="club" value={formData.club} onChange={handleChange} placeholder="Club Name (Optional)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" />
                                    )}

                                    {/* Theme Field - Show for specific Technical Event Types */}
                                    {(['Hackathon', 'Ideathon', 'Paper Presentation', 'Project Presentation', 'Workshop'].includes(formData.eventType) ||
                                        ['Hackathon', 'Ideathon', 'Paper Presentation', 'Project Presentation', 'Workshop'].includes(formData.category)) && (
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-semibold text-blue-400">Themes / Topics</h3>
                                                {formData.theme.map((topic, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <input
                                                            value={topic}
                                                            onChange={(e) => handleThemeChange(index, e.target.value)}
                                                            placeholder={`Topic ${index + 1} (e.g. AI, Cyber Security)`}
                                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors"
                                                        />
                                                        {formData.theme.length > 1 && (
                                                            <button type="button" onClick={() => removeTheme(index)} className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20">
                                                                <Trash2 size={20} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button type="button" onClick={addTheme} className="w-full px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 font-medium text-sm transition-colors border border-blue-500/20">
                                                    + Add Another Topic
                                                </button>
                                            </div>
                                        )}



                                    {/* Resource Person - Show for Workshop */}
                                    {formData.category === 'Workshop' && (
                                        <div className="space-y-4 pt-4 border-t border-white/10">
                                            <h3 className="text-lg font-semibold text-green-400">Resource Person Details</h3>
                                            <input name="resourcePerson" value={formData.resourcePerson} onChange={handleChange} placeholder="Resource Person Name" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" />
                                            <input name="resourcePersonPosition" value={formData.resourcePersonPosition} onChange={handleChange} placeholder="Resource Person's Position (e.g. Senior Architect)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" />
                                            <input name="resourcePersonCompany" value={formData.resourcePersonCompany} onChange={handleChange} placeholder="Resource Person's Company (e.g. Google)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" />
                                        </div>
                                    )}

                                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors text-white" />
                                    <input name="venue" value={formData.venue} onChange={handleChange} placeholder="Venue" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="fromTime" value={formData.fromTime} onChange={handleChange} placeholder="From Time (e.g. 10:00 AM)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" required />
                                        <input name="toTime" value={formData.toTime} onChange={handleChange} placeholder="To Time (e.g. 04:00 PM)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="winnerPrize" value={formData.winnerPrize} onChange={handleChange} placeholder="Winner Prize (₹)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" />
                                        <input name="runnerPrize" value={formData.runnerPrize} onChange={handleChange} placeholder="Runner Prize (₹)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" />
                                    </div>



                                    {/* General Prize - Dynamic Array */}
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold text-yellow-400">Other Prizes / Perks</h3>
                                        {formData.generalPrize.map((prize, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    value={prize}
                                                    onChange={(e) => handleGeneralPrizeChange(index, e.target.value)}
                                                    placeholder={`Prize ${index + 1} (e.g. Merit Certificate, Goodies)`}
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors"
                                                />
                                                {formData.generalPrize.length > 1 && (
                                                    <button type="button" onClick={() => removeGeneralPrize(index)} className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20">
                                                        <Trash2 size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button type="button" onClick={addGeneralPrize} className="w-full px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/20 font-medium text-sm transition-colors border border-yellow-500/20">
                                            + Add Another Prize
                                        </button>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                <LinkIcon size={16} className="text-gray-500" />
                                            </div>
                                            <input
                                                name="image"
                                                value={formData.image}
                                                onChange={handleChange}
                                                placeholder="Image URL (Drive link supported)"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 focus:border-blue-500 outline-none transition-colors"
                                            />
                                        </div>

                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                            <LinkIcon size={16} className="text-gray-500" />
                                        </div>
                                        <input
                                            name="pptTemplateUrl"
                                            value={formData.pptTemplateUrl}
                                            onChange={handleChange}
                                            placeholder="PPT Template URL (Optional)"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 focus:border-blue-500 outline-none transition-colors"
                                        />
                                    </div>
                                    {/* Rounds */}
                                    <textarea name="eventDescription" value={formData.eventDescription} onChange={handleChange} placeholder="Description" rows="3" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" required />
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 text-purple-400">Rounds</h3>
                                        {formData.rounds.map((round, index) => (
                                            <div key={index} className="space-y-3 mb-4 p-3 bg-white/5 rounded-xl border border-white/5 relative">
                                                <input
                                                    value={round.name}
                                                    onChange={(e) => handleRoundChange(index, 'name', e.target.value)}
                                                    placeholder={`Round ${index + 1} Title`}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm"
                                                />
                                                <textarea
                                                    value={round.description}
                                                    onChange={(e) => handleRoundChange(index, 'description', e.target.value)}
                                                    placeholder="Round Description"
                                                    rows="2"
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm"

                                                />
                                                <button type="button" onClick={() => removeRound(index)} className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={addRound} className="w-full px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 font-medium text-sm transition-colors border border-purple-500/20">+ Add Round</button>
                                    </div>

                                    {/* Rules */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 text-orange-400">Rules</h3>
                                        {formData.rules.map((rule, index) => (
                                            <div key={index} className="flex gap-2 mb-2">
                                                <input
                                                    value={rule}
                                                    onChange={(e) => handleRuleChange(index, e.target.value)}
                                                    placeholder={`Rule ${index + 1}`}
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm"
                                                />
                                                <button type="button" onClick={() => removeRule(index)} className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><Trash2 size={18} /></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={addRule} className="w-full px-4 py-2 bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500/20 font-medium text-sm transition-colors border border-orange-500/20">+ Add Rule</button>
                                    </div>


                                </div>
                            </div>

                            {/* Coordinators */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Faculty Coordinators */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-purple-400">Faculty Coordinators</h3>
                                    {formData.facultyCoordinators.map((coordinator, index) => (
                                        <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr,1fr,auto] gap-3 mb-4 p-3 bg-white/5 rounded-xl border border-white/5">
                                            <input value={coordinator.name} onChange={(e) => handleCoordinatorChange(index, 'name', e.target.value, 'faculty')} placeholder="Name" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm" />
                                            <input value={coordinator.phone} onChange={(e) => handleCoordinatorChange(index, 'phone', e.target.value, 'faculty')} placeholder="Phone" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm" />
                                            <button type="button" onClick={() => removeCoordinator(index, 'faculty')} className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 flex items-center justify-center"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addCoordinator('faculty')} className="w-full md:w-auto px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 font-medium text-sm transition-colors border border-purple-500/20">+ Add Faculty</button>
                                </div>

                                {/* Student Coordinators */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-blue-400">Student Coordinators</h3>
                                    {formData.studentCoordinators.map((coordinator, index) => (
                                        <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr,1fr,auto] gap-3 mb-4 p-3 bg-white/5 rounded-xl border border-white/5">
                                            <input value={coordinator.name} onChange={(e) => handleCoordinatorChange(index, 'name', e.target.value, 'student')} placeholder="Name" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm" />
                                            <input value={coordinator.phone} onChange={(e) => handleCoordinatorChange(index, 'phone', e.target.value, 'student')} placeholder="Phone" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm" />
                                            <button type="button" onClick={() => removeCoordinator(index, 'student')} className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 flex items-center justify-center"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addCoordinator('student')} className="w-full md:w-auto px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 font-medium text-sm transition-colors border border-blue-500/20">+ Add Student</button>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20">
                                {currentEvent ? 'Update Event' : 'Create Event'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <EventDetailsModal event={selectedDetailsEvent} onClose={() => setSelectedDetailsEvent(null)} isAdminView={true} />
        </div>
    );
};

export default ManageEvents;