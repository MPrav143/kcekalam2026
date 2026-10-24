import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Calendar, MapPin, Zap, Search, Filter, Sparkles, Cpu, Music,
    RotateCcw, ArrowRight, ArrowLeft, ChevronRight, Trophy, BookOpen,
    Code, Palette, Layers, Eye
} from 'lucide-react';
import axios from 'axios';
import { getImageUrl } from '../utils/imageUtils';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { DEPARTMENTS } from '../utils/constants';
import { API_URL } from '../utils/config';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import DepartmentCard from '../components/DepartmentCard';
import EventDetailsModal from '../components/EventDetailsModal';
import SectionBackground from '../components/SectionBackground';
import About from './About';
import PastEvents from '../components/PastEvents';
import Passes from './Passes';
import Doodles from '../components/Doodles';
import Popup from '../components/Popup';
import OptimizedImage from '../components/OptimizedImage';

const kalamLogo = 'https://ik.imagekit.io/kalam/About%20Page/Logo.png?updatedAt=1792635761882';

const Home = () => {
    const { config, departments: globalDepartments, culturalSubcategories } = useGlobalConfig();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Three-Level Event Navigation State:
    // Level 1: activeEventType: null (shows 2 main cards) | 'Technical' | 'Cultural'
    const [activeEventType, setActiveEventType] = useState(null);

    // Level 2: selectedCategory: null (shows categories for active type) | string (e.g. 'CSE', 'AIDS', 'OnStage')
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Category search query (filters category cards in Level 2)
    const [categorySearchQuery, setCategorySearchQuery] = useState('');

    // Event filtering within the selected category (Level 3)
    const [eventSearchQuery, setEventSearchQuery] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    const departments = useMemo(() => {
        const list = [...DEPARTMENTS];
        if (Array.isArray(globalDepartments)) {
            globalDepartments.forEach(d => {
                const idx = list.findIndex(item => item.code?.toLowerCase() === d.code?.toLowerCase());
                if (idx >= 0) {
                    list[idx] = { ...list[idx], ...d };
                } else {
                    list.push(d);
                }
            });
        }
        return list;
    }, [globalDepartments]);

    // Fetch Events Data
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/events`);
                setEvents(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch events:', error);
            }
        };
        fetchEvents();
    }, []);

    // Department Normalization Helper
    const normalizeDept = (s) => {
        let n = (s || '').replace(/%26|&|-|_/g, '').replace(/\s/g, '').toLowerCase();
        if (n === 'csd' || n === 'cst' || n === 'csdcst') return 'csdcst';
        if (n === 'ete' || n === 'vlsi' || n === 'etevlsi') return 'etevlsi';
        return n;
    };

    // Smooth scroll helper
    const scrollTo = (elementId) => {
        const el = document.getElementById(elementId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', `#${elementId}`);
        }
    };

    // Listen for custom events from Navbar dropdowns / mega-menu
    useEffect(() => {
        const handleFilterDept = (e) => {
            if (e.detail?.dept) {
                setActiveEventType('Technical');
                setSelectedCategory(e.detail.dept);
                setEventSearchQuery('');
            }
        };

        const handleFilterCultural = (e) => {
            if (e.detail?.subCategory) {
                setActiveEventType('Cultural');
                setSelectedCategory(e.detail.subCategory);
                setEventSearchQuery('');
            }
        };

        const handleSelectEventType = (e) => {
            if (e.detail?.type) {
                setActiveEventType(e.detail.type);
                setSelectedCategory(null);
                setCategorySearchQuery('');
            }
        };

        window.addEventListener('filter-technical-dept', handleFilterDept);
        window.addEventListener('filter-cultural-sub', handleFilterCultural);
        window.addEventListener('select-event-type', handleSelectEventType);

        return () => {
            window.removeEventListener('filter-technical-dept', handleFilterDept);
            window.removeEventListener('filter-cultural-sub', handleFilterCultural);
            window.removeEventListener('select-event-type', handleSelectEventType);
        };
    }, []);

    // Deep linking from URL parameters
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const deptParam = queryParams.get('dept');
        const catParam = queryParams.get('cat');
        const typeParam = queryParams.get('type');

        if (deptParam) {
            setActiveEventType('Technical');
            setSelectedCategory(deptParam);
        } else if (catParam === 'Cultural') {
            setActiveEventType('Cultural');
            if (typeParam) setSelectedCategory(typeParam);
        } else if (catParam === 'Technical') {
            setActiveEventType('Technical');
            if (typeParam) setSelectedCategory(typeParam);
        }
    }, [location.search]);

    // Split events into Technical and Cultural collections
    const { technicalEvents, culturalEvents } = useMemo(() => {
        const tech = [];
        const cult = [];

        events.forEach((evt) => {
            if (evt.category === 'Cultural') {
                cult.push(evt);
            } else {
                tech.push(evt);
            }
        });

        tech.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        cult.sort((a, b) => (a.title || '').localeCompare(b.title || ''));

        return { technicalEvents: tech, culturalEvents: cult };
    }, [events]);

    // Dynamic Admin-Driven Technical Categories (Departments list merged with any custom categories in events)
    const dynamicTechnicalCategories = useMemo(() => {
        const list = [...departments];

        // Ensure any department present in events is represented
        technicalEvents.forEach((evt) => {
            if (evt.department) {
                const norm = normalizeDept(evt.department);
                const exists = list.some(d => normalizeDept(d.code) === norm);
                if (!exists) {
                    list.push({
                        code: evt.department,
                        name: evt.department.length <= 6 ? `Department of ${evt.department}` : evt.department,
                        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
                    });
                }
            }
        });

        return list;
    }, [departments, technicalEvents]);

    // Dynamic Admin-Driven Cultural Categories
    const dynamicCulturalCategories = useMemo(() => {
        const list = [];
        const baseSubs = (culturalSubcategories && culturalSubcategories.length > 0)
            ? culturalSubcategories
            : [
                {
                    code: 'OnStage',
                    name: 'On Stage Events',
                    tagline: 'Dance Battles, Music Showdown, Band Wars, Theatrics & Fashion Walk',
                    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'
                },
                {
                    code: 'OffStage',
                    name: 'Off Stage Events',
                    tagline: 'Fine Arts, Photography, Short Film, Creative Writing & Quiz Challenges',
                    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80'
                }
            ];

        baseSubs.forEach((sub) => {
            const subCode = sub.code || sub.type;
            const normSub = (subCode || '').toLowerCase().replace(/\s+/g, '');
            const count = culturalEvents.filter((e) => {
                const eventSub = (e.subCategory || e.eventType || e.department || '').toLowerCase().replace(/\s+/g, '');
                return eventSub === normSub || (normSub === 'onstage' && eventSub === 'stage');
            }).length;

            list.push({
                code: subCode,
                name: sub.name || subCode,
                tagline: sub.tagline || 'Stage performances, live showcases and creative arts competitions.',
                image: sub.image || (normSub === 'offstage'
                    ? 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80'
                    : 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'),
                count
            });
        });

        // Ensure any custom cultural categories found in events are also dynamically represented
        culturalEvents.forEach((evt) => {
            const catName = evt.subCategory || evt.eventType || evt.department;
            if (catName && catName !== 'Cultural' && catName !== 'Normal') {
                const norm = catName.toLowerCase().replace(/\s+/g, '');
                const exists = list.some(c => c.code.toLowerCase().replace(/\s+/g, '') === norm);
                if (!exists) {
                    const count = culturalEvents.filter(e => {
                        const eventSub = (e.subCategory || e.eventType || e.department || '').toLowerCase().replace(/\s+/g, '');
                        return eventSub === norm;
                    }).length;
                    list.push({
                        code: catName,
                        name: catName,
                        tagline: 'Special cultural category showcase',
                        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
                        count
                    });
                }
            }
        });

        return list;
    }, [culturalSubcategories, culturalEvents]);

    // Filtered departments for category cards in Level 2
    const filteredTechnicalCategories = useMemo(() => {
        if (!categorySearchQuery.trim()) return dynamicTechnicalCategories;
        const q = categorySearchQuery.toLowerCase();
        return dynamicTechnicalCategories.filter(d =>
            (d.name || '').toLowerCase().includes(q) ||
            (d.code || '').toLowerCase().includes(q)
        );
    }, [dynamicTechnicalCategories, categorySearchQuery]);

    // Filtered cultural categories for category cards in Level 2
    const filteredCulturalCategories = useMemo(() => {
        if (!categorySearchQuery.trim()) return dynamicCulturalCategories;
        const q = categorySearchQuery.toLowerCase();
        return dynamicCulturalCategories.filter(c =>
            (c.name || '').toLowerCase().includes(q) ||
            (c.tagline || '').toLowerCase().includes(q)
        );
    }, [dynamicCulturalCategories, categorySearchQuery]);

    // Current category events (when viewing Level 3)
    const currentCategoryEvents = useMemo(() => {
        if (!selectedCategory) return [];

        if (activeEventType === 'Technical') {
            const normSelectedDept = normalizeDept(selectedCategory);
            return technicalEvents.filter((evt) => {
                if (normalizeDept(evt.department) !== normSelectedDept && normalizeDept(evt.category) !== normSelectedDept) {
                    return false;
                }

                if (eventSearchQuery.trim()) {
                    const q = eventSearchQuery.toLowerCase();
                    const matchTitle = (evt.title || '').toLowerCase().includes(q);
                    const matchDesc = (evt.description || evt.eventDescription || '').toLowerCase().includes(q);
                    if (!matchTitle && !matchDesc) return false;
                }

                return true;
            });
        }

        if (activeEventType === 'Cultural') {
            const normSelectedCat = selectedCategory.toLowerCase().replace(/\s+/g, '');
            return culturalEvents.filter((evt) => {
                const eventSub = (evt.subCategory || evt.eventType || evt.department || '').toLowerCase().replace(/\s+/g, '');
                if (eventSub !== normSelectedCat && !(normSelectedCat === 'onstage' && eventSub === 'stage')) {
                    return false;
                }

                if (eventSearchQuery.trim()) {
                    const q = eventSearchQuery.toLowerCase();
                    const matchTitle = (evt.title || '').toLowerCase().includes(q);
                    const matchDesc = (evt.description || evt.eventDescription || '').toLowerCase().includes(q);
                    if (!matchTitle && !matchDesc) return false;
                }

                return true;
            });
        }

        return [];
    }, [activeEventType, selectedCategory, technicalEvents, culturalEvents, eventSearchQuery]);

    // Metadata for the currently selected category
    const selectedCategoryMeta = useMemo(() => {
        if (!selectedCategory) return null;
        if (activeEventType === 'Technical') {
            const found = dynamicTechnicalCategories.find(d => normalizeDept(d.code) === normalizeDept(selectedCategory));
            return {
                title: found?.name || `Department of ${selectedCategory}`,
                code: found?.code || selectedCategory,
                type: 'Technical',
                icon: Cpu,
                accentColor: '#24BCE0',
                badgeText: 'Technical Fest'
            };
        }
        if (activeEventType === 'Cultural') {
            const found = dynamicCulturalCategories.find(c => c.code.toLowerCase().replace(/\s+/g, '') === selectedCategory.toLowerCase().replace(/\s+/g, ''));
            return {
                title: found?.name || `${selectedCategory} Events`,
                code: found?.code || selectedCategory,
                type: 'Cultural',
                icon: Music,
                accentColor: '#D62C76',
                badgeText: 'Cultural Fest'
            };
        }
        return null;
    }, [activeEventType, selectedCategory, dynamicTechnicalCategories, dynamicCulturalCategories]);

    // High quality card artwork
    const technicalCardImage = config.technical_card_image || config.cat_technical_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';
    const culturalCardImage = config.cultural_card_image || config.cat_cultural_image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80';

    return (
        <div className="min-h-screen bg-transparent text-white font-body relative overflow-x-hidden">
            <Doodles />
            <Popup />
            <Navbar />

            <main className="w-full max-w-full overflow-x-clip">
                {/* ============================================================ */}
                {/* 1. Hero Section — Visitor Portal Background                   */}
                {/* ============================================================ */}
                <section
                    id="home"
                    className="w-full max-w-full relative pt-16 pb-4 h-[100dvh] min-h-[100dvh] flex flex-col justify-center items-center text-center overflow-hidden border-b border-[#24BCE0]/20"
                >
                    <SectionBackground
                        bgKey="home_hero_bg"
                        fallbackKey="home_bg"
                        config={config}
                        fallbackGradient="bg-[#0a0715]"
                        overlayOpacity=""
                    />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col items-center justify-center relative z-10 my-auto py-2">
                        {/* Kalam Fest Logo */}
                        <div className="w-full flex justify-center animate-fadeInUp mb-3 sm:mb-4 md:mb-5">
                            <OptimizedImage
                                src={kalamLogo}
                                alt="KALAM - Inter-College Science Fest"
                                priority={true}
                                width={1080}
                                height={383}
                                className="w-full max-w-[420px] sm:max-w-[560px] md:max-w-[700px] lg:max-w-[800px] max-h-[19vh] sm:max-h-[22vh] md:max-h-[25vh] min-h-[85px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)] transition-transform duration-300 hover:scale-[1.02]"
                                fallbackSrc={kalamLogo}
                            />
                        </div>

                        {/* Hero Headline */}
                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading text-white leading-tight mb-3 sm:mb-4 max-w-4xl drop-shadow-[0_6px_24px_rgba(0,0,0,0.95)] animate-fadeInUp">
                            Your First Year, <br className="hidden sm:inline" />
                            <span className="bg-gradient-to-r from-[#24BCE0] via-[#F2D10A] to-[#D62C76] bg-clip-text text-transparent">
                                Your First Breakthrough
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-4 sm:mb-6 leading-relaxed font-body font-normal px-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] animate-fadeInUp">
                            Discovering Tomorrow’s Talent. A vibrant inter-college gathering of first-year students, bringing together curious minds, budding scientists, aspiring engineers, and creative thinkers to explore, compete, and innovate.
                        </p>

                        {/* Event Key Details Pills */}
                        <div className="mb-5 sm:mb-7 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-white animate-fadeInUp font-body font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                            <div className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-black/65 border border-[#24BCE0]/40 backdrop-blur-md shadow-md">
                                <Calendar size={15} className="text-[#F5A623] shrink-0" />
                                <span>Annual Fest <strong className="font-semibold text-white">{config.event_year || '2026'}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-black/65 border border-[#24BCE0]/40 backdrop-blur-md shadow-md">
                                <MapPin size={15} className="text-[#24BCE0] shrink-0" />
                                <span><strong className="font-semibold text-white">Karpagam College of Engineering</strong>, Coimbatore</span>
                            </div>
                            <div className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-black/65 border border-[#24BCE0]/40 backdrop-blur-md shadow-md">
                                <Zap size={15} className="text-[#F2D10A] shrink-0" />
                                <span>Registration <strong className="font-semibold text-white">Open for All Colleges</strong></span>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-row gap-3 sm:gap-4 items-center justify-center animate-fadeInUp">
                            <button
                                onClick={() => scrollTo('passes')}
                                className="px-7 py-2.5 sm:px-9 sm:py-3.5 rounded-2xl font-heading font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#D62C76] via-[#F47721] to-[#F5A623] hover:from-[#bf2264] hover:to-[#e09418] shadow-[0_0_30px_rgba(214,44,118,0.65)] hover:shadow-[0_0_40px_rgba(244,119,33,0.85)] border border-[#F2D10A]/50 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                            >
                                Register Now
                            </button>
                            <button
                                onClick={() => scrollTo('events')}
                                className="px-7 py-2.5 sm:px-9 sm:py-3.5 rounded-2xl font-body font-semibold text-sm sm:text-base text-white bg-black/60 hover:bg-[#24BCE0]/25 border border-[#24BCE0]/50 hover:border-[#24BCE0] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-[0_0_25px_rgba(36,188,224,0.4)]"
                            >
                                Explore Events
                            </button>
                        </div>
                    </div>
                </section>

                {/* ============================================================ */}
                {/* 2. About KCE / About KALAM Section — Independently Configured */}
                {/* ============================================================ */}
                <About embed={true} />

                {/* ============================================================ */}
                {/* 3. Festival Highlights Section — Independently Configured     */}
                {/* ============================================================ */}
                <PastEvents />

                {/* ============================================================ */}
                {/* 4. Three-Level Event Navigation & Image Cards Section         */}
                {/* ============================================================ */}
                <section
                    id="events"
                    className="w-full max-w-full relative py-8 sm:py-12 border-t border-[#24BCE0]/25 overflow-hidden"
                >
                    {/* Anchors for navigation without offset gaps */}
                    <div id="technical-events" className="absolute top-0 pointer-events-none" />
                    <div id="cultural-events" className="absolute top-0 pointer-events-none" />

                    {/* Section-Specific Independently Configured Background */}
                    <SectionBackground
                        bgKey={activeEventType === 'Cultural' ? 'cultural_events_bg' : 'events_bg'}
                        fallbackKey="events_bg"
                        config={config}
                        fallbackGradient="bg-gradient-to-b from-[#070913] via-[#0c0d1e] to-[#080914]"
                        overlayOpacity=""
                    />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                        {/* ======================================================== */}
                        {/* LEVEL 1: TWO MAIN EVENT CARDS (Technical & Cultural)     */}
                        {/* ======================================================== */}
                        {activeEventType === null && (
                            <div className="space-y-6 sm:space-y-7 animate-fadeInUp">
                                {/* Section Header */}
                                <div className="text-center max-w-3xl mx-auto">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#24BCE0] bg-[#24BCE0]/15 border border-[#24BCE0]/35 mb-2">
                                        <Sparkles size={13} className="text-[#F2D10A]" />
                                        Festival Event Tracks · KALAM 2026
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-white tracking-tight">
                                        Choose Your <span className="bg-gradient-to-r from-[#24BCE0] via-[#F2D10A] to-[#D62C76] bg-clip-text text-transparent">Arena of Glory</span>
                                    </h2>
                                    <p className="text-xs sm:text-sm text-[#D8D4F0]/80 mt-1.5 font-body leading-relaxed max-w-2xl mx-auto">
                                        Select between our flagship Engineering Technical Fest or the vibrant Cultural Arts Showcase to begin exploring categories and events.
                                    </p>
                                </div>

                                {/* Two Prominent Image-Based Cards Grid — 2 Columns on Mobile */}
                                <div className="grid grid-cols-2 gap-2.5 sm:gap-5 lg:gap-6 max-w-4xl mx-auto">
                                    {/* 1. Technical Events Card */}
                                    <div
                                        onClick={() => {
                                            setActiveEventType('Technical');
                                            setSelectedCategory(null);
                                            setCategorySearchQuery('');
                                            setEventSearchQuery('');
                                        }}
                                        className="group flex flex-col rounded-2xl sm:rounded-3xl border border-white/10 hover:border-[#24BCE0]/60 bg-[#140816]/90 backdrop-blur-xl shadow-2xl hover:shadow-[0_20px_50px_rgba(36,188,224,0.35)] transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-1.5"
                                    >
                                        {/* Large High-Quality Top Image */}
                                        <div className="aspect-[4/3] w-full overflow-hidden relative bg-[#14050E]">
                                            <img
                                                src={getImageUrl(technicalCardImage)}
                                                alt="Technical Events"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                loading="eager"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#140816] via-[#140816]/30 to-transparent" />
                                            <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 z-10 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#24BCE0] bg-[#14050E]/85 border border-[#24BCE0]/40 backdrop-blur-md">
                                                <Cpu size={11} className="text-[#24BCE0] shrink-0" />
                                                <span>Tech<span className="hidden sm:inline"> & Innovation</span></span>
                                            </div>
                                            <div className="absolute top-2 right-2 sm:top-3.5 sm:right-3.5 z-10">
                                                <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#24BCE0] text-[#0A051B] shadow-lg">
                                                    {technicalEvents.length} Events
                                                </span>
                                            </div>
                                        </div>

                                        {/* Dark-Themed Information Panel */}
                                        <div className="p-3 sm:p-5 md:p-6 flex flex-col flex-1 justify-between">
                                            <div>
                                                <h3 className="text-sm sm:text-xl md:text-2xl font-bold font-heading text-white group-hover:text-[#24BCE0] transition-colors leading-snug sm:leading-tight mb-1 sm:mb-2">
                                                    Technical Events
                                                </h3>
                                                <p className="text-[10px] sm:text-xs md:text-sm text-[#D8D4F0]/80 leading-relaxed font-body mb-2 sm:mb-3.5 line-clamp-2">
                                                    Hands-on workshops, coding hackathons, paper presentations, project expos, and engineering challenges.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Cultural Events Card */}
                                    <div
                                        onClick={() => {
                                            setActiveEventType('Cultural');
                                            setSelectedCategory(null);
                                            setCategorySearchQuery('');
                                            setEventSearchQuery('');
                                        }}
                                        className="group flex flex-col rounded-2xl sm:rounded-3xl border border-white/10 hover:border-[#D62C76]/60 bg-[#160814]/90 backdrop-blur-xl shadow-2xl hover:shadow-[0_20px_50px_rgba(214,44,118,0.35)] transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-1.5"
                                    >
                                        {/* Large High-Quality Top Image */}
                                        <div className="aspect-[4/3] w-full overflow-hidden relative bg-[#14050E]">
                                            <img
                                                src={getImageUrl(culturalCardImage)}
                                                alt="Cultural Events"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                loading="eager"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#160814] via-[#160814]/30 to-transparent" />
                                            <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 z-10 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#D62C76] bg-[#14050E]/85 border border-[#D62C76]/40 backdrop-blur-md">
                                                <Music size={11} className="text-[#D62C76] shrink-0" />
                                                <span>Arts<span className="hidden sm:inline"> & Culture</span></span>
                                            </div>
                                            <div className="absolute top-2 right-2 sm:top-3.5 sm:right-3.5 z-10">
                                                <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#D62C76] text-white shadow-lg">
                                                    {culturalEvents.length} Events
                                                </span>
                                            </div>
                                        </div>

                                        {/* Dark-Themed Information Panel */}
                                        <div className="p-3 sm:p-5 md:p-6 flex flex-col flex-1 justify-between">
                                            <div>
                                                <h3 className="text-sm sm:text-xl md:text-2xl font-bold font-heading text-white group-hover:text-[#F472B6] transition-colors leading-snug sm:leading-tight mb-1 sm:mb-2">
                                                    Cultural Events
                                                </h3>
                                                <p className="text-[10px] sm:text-xs md:text-sm text-[#D8D4F0]/80 leading-relaxed font-body mb-2 sm:mb-3.5 line-clamp-2">
                                                    High-voltage dance face-offs, live music band battles, theatrical acts, fashion parades, and fine arts.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ======================================================== */}
                        {/* LEVEL 2: DYNAMIC ADMIN-DRIVEN CATEGORIES                  */}
                        {/* ======================================================== */}
                        {activeEventType !== null && selectedCategory === null && (
                            <div className="space-y-6 animate-fadeInUp">
                                {/* Navigation Breadcrumbs & Back Button */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setActiveEventType(null)}
                                            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white/90 bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                                        >
                                            <ArrowLeft size={16} />
                                            <span>Back to Event Tracks</span>
                                        </button>
                                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-white/50">
                                            <span>Events</span>
                                            <ChevronRight size={14} />
                                            <span className="font-semibold text-white">{activeEventType} Events</span>
                                        </div>
                                    </div>

                                    {/* Search input for categories */}
                                    <div className="relative w-full sm:w-72">
                                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                                        <input
                                            type="text"
                                            value={categorySearchQuery}
                                            onChange={(e) => setCategorySearchQuery(e.target.value)}
                                            placeholder={`Search ${activeEventType.toLowerCase()} categories...`}
                                            className="w-full pl-10 pr-8 py-2 rounded-xl bg-[#140612]/80 border border-white/15 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#24BCE0] transition-colors"
                                        />
                                        {categorySearchQuery && (
                                            <button
                                                onClick={() => setCategorySearchQuery('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Section Header */}
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2"
                                        style={{
                                            color: activeEventType === 'Technical' ? '#24BCE0' : '#D62C76',
                                            background: activeEventType === 'Technical' ? 'rgba(36, 188, 224, 0.15)' : 'rgba(214, 44, 118, 0.15)',
                                            border: `1px solid ${activeEventType === 'Technical' ? 'rgba(36, 188, 224, 0.35)' : 'rgba(214, 44, 118, 0.35)'}`
                                        }}
                                    >
                                        {activeEventType === 'Technical' ? <Cpu size={14} /> : <Music size={14} />}
                                        {activeEventType} Categories
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-white">
                                        Select a <span className="bg-gradient-to-r from-[#24BCE0] via-[#F2D10A] to-[#D62C76] bg-clip-text text-transparent">Category</span> to View Events
                                    </h2>
                                    <p className="text-xs sm:text-sm text-[#D8D4F0]/80 mt-1 font-body">
                                        Click any category card below to display its assigned events and competitions.
                                    </p>
                                </div>

                                {/* Technical Categories Grid (Departments & Custom Tech Categories) */}
                                {activeEventType === 'Technical' && (
                                    <div>
                                        {filteredTechnicalCategories.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {filteredTechnicalCategories.map((dept) => {
                                                    const deptEvents = technicalEvents.filter(e => normalizeDept(e.department) === normalizeDept(dept.code) || normalizeDept(e.category) === normalizeDept(dept.code));
                                                    const totalEvents = deptEvents.length;
                                                    const displayImage = config[`dept_${dept.code}_image`] || dept.image;

                                                    return (
                                                        <DepartmentCard
                                                            key={dept.code}
                                                            dept={{ ...dept, image: displayImage }}
                                                            totalEvents={totalEvents}
                                                            accentColor="#24BCE0"
                                                            onClick={() => {
                                                                setSelectedCategory(dept.code);
                                                                setEventSearchQuery('');
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-16 bg-[#180715]/40 rounded-3xl border border-white/5 p-8 max-w-md mx-auto">
                                                <Cpu className="mx-auto mb-3 text-white/30" size={36} />
                                                <p className="text-base text-white/80 font-medium">No departments matched "{categorySearchQuery}".</p>
                                                <button
                                                    onClick={() => setCategorySearchQuery('')}
                                                    className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                                                >
                                                    <RotateCcw size={14} /> Clear Search
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Cultural Categories Grid (Dynamic Admin-Managed Categories) */}
                                {activeEventType === 'Cultural' && (
                                    <div>
                                        {filteredCulturalCategories.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {filteredCulturalCategories.map((cat) => {
                                                    const catEvents = culturalEvents.filter((e) => {
                                                        const normSub = (cat.code || '').toLowerCase().replace(/\s+/g, '');
                                                        const eventSub = (e.subCategory || e.eventType || e.department || '').toLowerCase().replace(/\s+/g, '');
                                                        return eventSub === normSub || (normSub === 'onstage' && eventSub === 'stage');
                                                    });
                                                    const totalEvents = catEvents.length;
                                                    const displayImage = config[`cultural_${cat.code}_image`] || cat.image;

                                                    return (
                                                        <DepartmentCard
                                                            key={cat.code}
                                                            dept={{ ...cat, image: displayImage }}
                                                            totalEvents={totalEvents}
                                                            accentColor="#D62C76"
                                                            onClick={() => {
                                                                setSelectedCategory(cat.code);
                                                                setEventSearchQuery('');
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-16 bg-[#180715]/40 rounded-3xl border border-white/5 p-8 max-w-md mx-auto">
                                                <Music className="mx-auto mb-3 text-white/30" size={36} />
                                                <p className="text-base text-white/80 font-medium">No cultural categories matched "{categorySearchQuery}".</p>
                                                <button
                                                    onClick={() => setCategorySearchQuery('')}
                                                    className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                                                >
                                                    <RotateCcw size={14} /> Clear Search
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ======================================================== */}
                        {/* LEVEL 3: INDIVIDUAL EVENT CARDS (For Selected Category)  */}
                        {/* ======================================================== */}
                        {selectedCategory !== null && (
                            <div className="space-y-5 sm:space-y-6 animate-fadeInUp">
                                {/* Navigation Breadcrumbs & Back Button to Categories */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                                        <button
                                            onClick={() => setSelectedCategory(null)}
                                            className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-white/90 bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                                        >
                                            <ArrowLeft size={15} />
                                            <span>Back to Categories</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setActiveEventType(null);
                                                setSelectedCategory(null);
                                            }}
                                            className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                                        >
                                            All Event Tracks
                                        </button>

                                        <div className="hidden sm:flex items-center gap-1 text-xs text-white/50">
                                            <span>Events</span>
                                            <ChevronRight size={13} />
                                            <span>{activeEventType}</span>
                                            <ChevronRight size={13} />
                                            <span className="font-semibold text-white line-clamp-1 max-w-[200px]">
                                                {selectedCategoryMeta?.code}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Event Search Box within Category */}
                                    <div className="relative w-full sm:w-64">
                                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                        <input
                                            type="text"
                                            value={eventSearchQuery}
                                            onChange={(e) => setEventSearchQuery(e.target.value)}
                                            placeholder="Search events in this category..."
                                            className="w-full pl-9 pr-7 py-1.5 rounded-xl bg-[#140612]/80 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#24BCE0] transition-colors"
                                        />
                                        {eventSearchQuery && (
                                            <button
                                                onClick={() => setEventSearchQuery('')}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Active Category Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-[#140612]/80 border border-white/10">
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                                            style={{
                                                color: selectedCategoryMeta?.accentColor,
                                                background: `${selectedCategoryMeta?.accentColor}20`,
                                                border: `1px solid ${selectedCategoryMeta?.accentColor}40`
                                            }}
                                        >
                                            <span>{selectedCategoryMeta?.badgeText}</span>
                                            <span>·</span>
                                            <span>{selectedCategoryMeta?.code}</span>
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                                            {selectedCategoryMeta?.title}
                                        </h2>
                                        <p className="text-xs text-[#D8D4F0]/80 mt-0.5 font-body">
                                            Showing events assigned to this category. Click any event card below to open its full details and registration popup.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 text-white border border-white/15">
                                            {currentCategoryEvents.length} {currentCategoryEvents.length === 1 ? 'Event' : 'Events'}
                                        </span>
                                    </div>
                                </div>

                                {/* Grid of Event Cards */}
                                {currentCategoryEvents.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                                        {currentCategoryEvents.map((event) => (
                                            <EventCard
                                                key={event._id || event.id}
                                                event={event}
                                                onExplore={(evt) => setSelectedEvent(evt)}
                                                onRegister={(evt) => setSelectedEvent(evt)}
                                                onView={(evt) => setSelectedEvent(evt)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-[#180715]/40 rounded-3xl border border-white/5 p-8 max-w-md mx-auto">
                                        <Calendar className="mx-auto mb-3 text-white/30" size={36} />
                                        <p className="text-base text-white/80 font-medium">No events available in this category yet.</p>
                                        <p className="text-xs text-[#D8D4F0]/60 mt-1">Check back soon or explore other categories.</p>
                                        {eventSearchQuery && (
                                            <button
                                                onClick={() => setEventSearchQuery('')}
                                                className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                                            >
                                                <RotateCcw size={14} /> Clear Search
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* ============================================================ */}
                {/* 5. Passes Section — Independently Configured Background       */}
                {/* ============================================================ */}
                <Passes embed={true} />

                {/* ============================================================ */}
                {/* 6. Sponsors & Footer Section — Independently Configured       */}
                {/* ============================================================ */}
                <Footer />
            </main>

            {/* In-place Centered Event Details Modal Popup */}
            <EventDetailsModal
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                showRegister={true}
            />
        </div>
    );
};

export default Home;
