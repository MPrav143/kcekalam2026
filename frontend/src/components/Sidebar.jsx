import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, FileText, LogOut, Ticket, Image as ImageIcon, FileSpreadsheet, Menu, X } from 'lucide-react';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { DEPARTMENTS as DEFAULT_DEPTS, CULTURAL_SUBCATEGORIES as DEFAULT_SUBS } from '../utils/constants';

const Sidebar = () => {
    const { config, departments, culturalSubcategories } = useGlobalConfig();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [expanded, setExpanded] = useState({});
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('adminUser') || 'null');
        setUser(userData);
    }, []);

    const isActive = (path) => location.pathname === path;

    const toggleSubMenu = (label) => {
        setExpanded(prev => ({ ...prev, [label]: !prev[label] }));
    };

    const getNavItems = () => {
        const activeDepts = (departments && departments.length > 0) ? departments : DEFAULT_DEPTS;
        const activeSubs = (culturalSubcategories && culturalSubcategories.length > 0) ? culturalSubcategories : DEFAULT_SUBS;

        return [
            { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            {
                label: 'Technical Fest',
                icon: Calendar,
                children: [
                    { path: '/admin/events/Technical', label: 'All Technical' },
                    ...activeDepts.map(dept => ({
                        path: `/admin/events/Technical/${encodeURIComponent(dept.code)}`,
                        label: dept.name || dept.code
                    }))
                ]
            },
            {
                label: 'Cultural Fest',
                icon: Calendar,
                children: [
                    { path: '/admin/events/Cultural', label: 'All Cultural' },
                    ...activeSubs.map(sub => ({
                        path: `/admin/events/Cultural/${sub.code}`,
                        label: sub.name
                    }))
                ]
            },
            { path: '/admin/events/Non Technical/All', icon: Calendar, label: 'Non Technical Fest' },
            { path: '/admin/events', icon: Calendar, label: 'All Events' },
            { path: '/admin/passes', icon: Ticket, label: 'Manage Passes' },
            { path: '/admin/content', icon: FileText, label: 'Manage Content' },
            { path: '/admin/sheets', icon: FileSpreadsheet, label: 'Google Sheets Sync' },
            { path: '/admin/images', icon: ImageIcon, label: 'Page Backgrounds & Cards' }
        ];
    };

    const navItems = getNavItems();

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#14050E]/80 backdrop-blur-md rounded-lg text-white border border-[#D62C76]/30"
            >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 h-screen bg-[#14050E] border-r border-[#D62C76]/20 flex flex-col p-6 overflow-y-auto custom-scrollbar select-none transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="mb-10 flex items-center gap-3 shrink-0 mt-8 lg:mt-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D62C76] to-[#F47721] flex items-center justify-center font-bold text-white text-sm">
                        K
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F2D10A] via-[#F47721] to-[#D62C76]">
                        {config.website_name || 'KALAM 2026'}
                    </h1>
                </div>

                <nav className="space-y-2 flex-1">
                    {navItems.map((item) => (
                        <div key={item.label}>
                            {item.children ? (
                                <div>
                                    <button
                                        onClick={() => toggleSubMenu(item.label)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-gray-400 hover:bg-white/5 hover:text-white group`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                        <span className={`transition-transform duration-200 ${expanded[item.label] ? 'rotate-180' : ''}`}>▼</span>
                                    </button>
                                    {expanded[item.label] && (
                                        <div className="pl-12 space-y-1 mt-1">
                                            {item.children.map(child => (
                                                <Link
                                                    key={child.path}
                                                    to={child.path}
                                                    onClick={() => setMobileOpen(false)} // Close on click
                                                    className={`block py-2 text-sm transition-colors ${isActive(child.path) ? 'text-[#24BCE0] font-medium' : 'text-gray-400 hover:text-gray-200'}`}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to={item.path}
                                    onClick={() => setMobileOpen(false)} // Close on click
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive(item.path)
                                        ? 'bg-[#D62C76]/20 text-[#24BCE0] border border-[#D62C76]/30 shadow-lg shadow-[#D62C76]/15'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-[#24BCE0]' : 'text-gray-500 group-hover:text-white'} transition-colors`} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                <button
                    onClick={() => {
                        localStorage.removeItem('adminToken');
                        localStorage.removeItem('adminUser');
                        window.location.href = '/login';
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all mt-auto group w-full"
                >
                    <LogOut className="w-5 h-5 group-hover:text-red-300" />
                    <span className="font-medium">Logout</span>
                </button>
            </aside>

            {/* Overlay for mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-[#14050E]/80 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
