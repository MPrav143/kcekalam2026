import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { API_URL } from '../utils/config';
import ComingSoonModal from '../components/ComingSoonModal';
import SuccessModal from '../components/SuccessModal';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, GraduationCap, Building2, MapPin, CreditCard, ChevronRight, Sparkles, Trophy, Ticket } from 'lucide-react';
import Doodles from '../components/Doodles';
import { useHasPageBackground } from '../components/PageBackground';

const EventSelection = () => {
    const hasBgImage = useHasPageBackground();
    const location = useLocation();
    const navigate = useNavigate();
    const { pass } = location.state || {}; // Expect pass object
    const { config } = useGlobalConfig();

    const [formData, setFormData] = useState({
        studentName: '',
        rollNumber: '',
        email: '',
        phone: '',
        department: '',
        customDepartment: '',
        year: '',
        college: '',
        district: '',
        state: '',
        pass: pass?._id || '',
    });
    const [passes, setPasses] = useState([]);
    const [currentPass, setCurrentPass] = useState(pass);
    const [submitting, setSubmitting] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [successState, setSuccessState] = useState({ show: false, title: '', message: '', ticketId: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: passesData } = await axios.get(`${API_URL}/passes`);
                if (Array.isArray(passesData)) {
                    setPasses(passesData.filter(p => p.isActive));
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        if (!currentPass) {
            navigate('/passes');
            return;
        }
        fetchData();
    }, [currentPass, navigate]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'pass') {
            const selected = passes.find(p => p._id === value);
            if (selected) {
                setCurrentPass(selected);
                // Scroll to top to show updated pass details
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        if (config.registration_open === 'false') {
            try {
                const payload = {
                    passId: currentPass?._id,
                    eventIds: [],
                    ...formData,
                    department: formData.department === 'Other' ? formData.customDepartment : formData.department
                };
                delete payload.customDepartment;
                await axios.post(`${API_URL}/registrations/pre-register`, payload);
                setShowComingSoon(true);
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || 'Failed to register interest');
            } finally {
                setSubmitting(false);
            }
            return;
        }
        try {
            const payload = {
                passId: currentPass?._id,
                eventIds: [],
                ...formData,
                department: formData.department === 'Other' ? formData.customDepartment : formData.department
            };
            delete payload.customDepartment;

            const { data: regData } = await axios.post(`${API_URL}/registrations`, payload);

            // Check if payment was bypassed
            if (regData.paymentStatus === 'Completed' || regData.paymentStatus === 'Bypassed') {
                setSuccessState({
                    show: true,
                    title: 'Registration Successful!',
                    message: "Welcome to Kalam! Your registration has been confirmed. See you at the event!",
                    ticketId: regData.ticketId
                });
                setSubmitting(false);
                return;
            }

            // Razorpay Checkout
            const options = {
                key: window.RAZORPAY_KEY_ID || 'rzp_test_5h5Hk8zY9I1qV3',
                amount: Math.round((parseFloat(regData.amount.toString().split('/')[0]) || 0) * 100),
                currency: 'INR',
                name: `${config.website_name || 'Kalam'} ${config.event_year || '2026'}`,
                description: `Payment for ${currentPass?.name}`,
                handler: async function (response) {
                    try {
                        await axios.post(`${API_URL}/payment/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            registrationId: regData.registrationId
                        });
                        setSuccessState({
                            show: true,
                            title: 'Payment Successful!',
                            message: "Your payment has been verified and registration is confirmed. Get ready for an epic experience!",
                            ticketId: regData.ticketId
                        });
                    } catch (err) {
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: formData.studentName,
                    pass: formData.pass,
                    department: formData.department,
                    year: formData.year,
                    college: formData.college,
                    district: formData.district,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: { color: '#D62C76' },
                modal: {
                    ondismiss: async function () {
                        try {
                            await axios.post(`${API_URL}/payment/failed`, {
                                registrationId: regData.registrationId,
                                reason: 'Payment modal closed by user'
                            });
                        } catch (err) {
                            console.error('Failed to log payment cancellation', err);
                        }
                    }
                }
            };

            try {
                const { data: order } = await axios.post(`${API_URL}/payment/order`, {
                    amount: regData.amount,
                    receipt: regData.registrationId
                });
                if (order && order.id) {
                    options.order_id = order.id;
                }
            } catch (err) {
                console.warn("Failed to create official order, proceeding.", err);
            }

            const rzp = new window.Razorpay(options);

            // Add failure listener for specific payment errors
            rzp.on('payment.failed', async function (response) {
                try {
                    await axios.post(`${API_URL}/payment/failed`, {
                        registrationId: regData.registrationId,
                        reason: response.error.description || 'Payment failed at gateway'
                    });
                } catch (err) {
                    console.error('Failed to log payment failure', err);
                }
            });

            rzp.open();
            setSubmitting(false);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Registration failed');
            setSubmitting(false);
        }
    };

    const getPassColorGradient = (color) => {
        switch (color?.toLowerCase()) {
            case 'orange': return 'from-orange-400 via-orange-500 to-red-500';
            case 'yellow': return 'from-yellow-300 via-yellow-400 to-orange-400';
            case 'red': return 'from-red-400 via-rose-500 to-red-600';
            case 'green': return 'from-emerald-400 via-green-500 to-emerald-600';
            case 'purple': return 'from-violet-400 via-purple-500 to-fuchsia-600';
            case 'pink': return 'from-pink-400 via-rose-400 to-fuchsia-500';
            case 'blue': return 'from-blue-400 via-cyan-500 to-blue-600';
            default: return 'from-white via-white to-white/50';
        }
    };

    if (!pass) return null;

    return (
        <div className="min-h-screen bg-transparent text-white font-body flex flex-col relative overflow-x-hidden selection:bg-[#D62C76] selection:text-white">
            {/* Premium Dynamic Background - Only rendered when no background image is present */}
            {!hasBgImage && (
                <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-[#D62C76]/22 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-[#24BCE0]/20 rounded-full blur-[120px] animate-float" />
                    <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-[#F47721]/18 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
                    <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[35%] bg-[#F5A623]/16 rounded-full blur-[120px] animate-float delay-500" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#14050E_90%)]" />
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
                </div>
            )}

            <Doodles />
            <Navbar />

            <main className="flex-1 relative z-10 max-w-4xl mx-auto w-full px-4 pt-28 pb-12 font-body">
                {/* Hero Section with Glassmorphism */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 p-1 rounded-3xl bg-gradient-to-r from-[#D62C76] via-[#F47721] to-[#F5A623] shadow-[0_0_50px_-12px_rgba(214,44,118,0.5)]"
                >
                    <div className="bg-[#14050E]/90 backdrop-blur-xl rounded-[22px] p-6 sm:p-10 text-center relative overflow-hidden border border-[#24BCE0]/30">
                        {/* Decorative background circle */}
                        <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#D62C76]/25 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[#24BCE0]/20 rounded-full blur-3xl" />

                        <h1 className="text-2xl sm:text-4xl font-semibold mb-2 font-accent tracking-tight text-white">
                            {currentPass?.name}
                        </h1>

                        {currentPass?.perks && Array.isArray(currentPass.perks) && (
                            <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-2xl mx-auto">
                                {currentPass.perks.filter(p => p).map((perk, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-[#24BCE0]/15 border border-[#24BCE0]/30 text-xs sm:text-sm text-white/90 flex items-center gap-2 font-body font-normal">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#F2D10A]" />
                                        {perk}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="inline-block p-1 rounded-2xl bg-[#180614]/90 border border-[#F5A623]/40">
                            <div className="text-3xl sm:text-5xl font-bold font-accent tracking-tight text-white">
                                ₹{currentPass?.price}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#180614]/85 backdrop-blur-2xl border border-[#D62C76]/25 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden relative"
                >
                    {/* Corner gradient hits */}
                    <div className="absolute top-0 right-0 w-36 h-36 bg-[#D62C76]/15 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#24BCE0]/15 blur-3xl pointer-events-none" />

                    <div className="flex items-center gap-4 mb-10 pb-4 border-b border-[#D62C76]/20">
                        <div className="p-3 bg-[#D62C76]/20 border border-[#D62C76]/30 rounded-xl text-[#24BCE0]">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white font-heading">Registration Details</h2>
                            <p className="text-[#D8D4F0] text-xs sm:text-sm font-body">Please fill in your academic information</p>
                        </div>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-8">

                        <div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Student Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#24BCE0] transition-colors" size={20} />
                                    <input name="studentName" value={formData.studentName} onChange={handleFormChange} required placeholder="Enter full name" className="w-full bg-[#14050E]/80 border border-[#24BCE0]/25 rounded-xl py-4 pl-12 pr-4 focus:border-[#24BCE0] focus:bg-[#14050E] outline-none transition-all placeholder:text-gray-500 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Department</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full bg-[#14050E]/80 border border-[#24BCE0]/25 rounded-xl py-4 px-5 focus:border-[#24BCE0] focus:bg-[#14050E] outline-none text-gray-200 transition-all [&>option]:bg-[#14050E]"
                                >
                                    <option value="">Select Dept</option>
                                    {/* Core Engineering */}
                                    <option value="AIDS">AIDS</option>
                                    <option value="CIVIL">CIVIL</option>
                                    <option value="CSD-CST">CSD-CST</option>
                                    <option value="CSE">CSE</option>
                                    <option value="CSECS">CSE(CY)</option>
                                    <option value="ECE">ECE</option>
                                    <option value="EEE">EEE</option>
                                    <option value="ETE-VLSI">ETE-VLSI</option>
                                    <option value="MECH">MECH</option>
                                    <option value="IT">IT</option>
                                    <option value="CHEM">CHEM</option>
                                    <option value="BIOTECH">BIOTECH</option>
                                    {/* Core Sciences */}
                                    <option value="PHYSICS">Physics</option>
                                    <option value="CHEMISTRY">Chemistry</option>
                                    <option value="MATHEMATICS">Mathematics</option>
                                    <option value="BIOLOGY">Biology</option>
                                    {/* Commerce & Management */}
                                    <option value="BCom">B.Com - Commerce</option>
                                    <option value="BBA">BBA - Business Administration</option>
                                    <option value="MBA">MBA - Master of Business Administration</option>
                                    <option value="Other">Other (Please Specify)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Current Year</label>
                                <select name="year" value={formData.year} onChange={handleFormChange} required className="w-full bg-[#14050E]/80 border border-[#24BCE0]/25 rounded-xl py-4 px-5 focus:border-[#24BCE0] focus:bg-[#14050E] outline-none text-gray-200 transition-all [&>option]:bg-[#14050E]">
                                    <option value="">Select Year</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                    <option value="5">5th Year</option>
                                </select>
                            </div>
                        </div>

                        <AnimatePresence>
                            {formData.department === 'Other' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2"
                                >
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Specify Department</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#24BCE0] transition-colors" size={20} />
                                        <input
                                            name="customDepartment"
                                            value={formData.customDepartment}
                                            onChange={handleFormChange}
                                            required
                                            placeholder="Enter your department name"
                                            className="w-full bg-[#14050E]/80 border border-[#24BCE0]/25 rounded-xl py-4 pl-12 pr-4 focus:border-[#24BCE0] focus:bg-[#14050E] outline-none transition-all placeholder:text-gray-500 text-white"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email ID</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#24BCE0] transition-colors" size={20} />
                                    <input name="email" type="email" value={formData.email} onChange={handleFormChange} required placeholder="Email Address" className="w-full bg-[#14050E]/80 border border-[#24BCE0]/25 rounded-xl py-4 pl-12 pr-4 focus:border-[#24BCE0] focus:bg-[#14050E] outline-none transition-all placeholder:text-gray-500 text-white" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#24BCE0] transition-colors" size={20} />
                                    <input name="phone" value={formData.phone} onChange={handleFormChange} required placeholder="Contact Number" className="w-full bg-[#14050E]/80 border border-[#24BCE0]/25 rounded-xl py-4 pl-12 pr-4 focus:border-[#24BCE0] focus:bg-[#14050E] outline-none transition-all placeholder:text-gray-500 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">College / Institution</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#24BCE0] transition-colors" size={20} />
                                    <input name="college" value={formData.college} onChange={handleFormChange} required placeholder="Institution Name" className="w-full bg-[#14050E]/80 border border-[#24BCE0]/25 rounded-xl py-4 pl-12 pr-4 focus:border-[#24BCE0] focus:bg-[#14050E] outline-none transition-all placeholder:text-gray-500 text-white" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">District / City</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#24BCE0] transition-colors" size={20} />
                                    <input name="district" value={formData.district} onChange={handleFormChange} required placeholder="District" className="w-full bg-[#14050E]/80 border border-[#24BCE0]/25 rounded-xl py-4 pl-12 pr-4 focus:border-[#24BCE0] focus:bg-[#14050E] outline-none transition-all placeholder:text-gray-500 text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Selected Pass</label>
                            <div className="relative group">
                                <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#24BCE0] transition-colors" size={20} />
                                <select
                                    name="pass"
                                    value={formData.pass}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full bg-[#14050E]/80 border border-[#24BCE0]/25 rounded-xl py-4 pl-12 pr-4 focus:border-[#24BCE0] focus:bg-[#14050E] outline-none text-gray-200 transition-all [&>option]:bg-[#14050E]"
                                >
                                    <option value="">Select Pass</option>
                                    {passes.map((p) => (
                                        <option key={p._id} value={p._id}>
                                            {p.name} - ₹{p.price}/-
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="pt-10">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full h-15 relative overflow-hidden group rounded-2xl transition-all border border-[#F2D10A]/40 shadow-2xl shadow-[#D62C76]/40 cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#D62C76] via-[#F47721] to-[#F5A623] group-hover:scale-105 transition-transform duration-500" />
                                <div className="relative flex items-center justify-center gap-3 text-base sm:text-lg font-accent font-semibold tracking-wide text-white">
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard size={20} className="text-[#F2D10A]" />
                                            <span>{config.registration_open === 'false' ? 'Register Interest' : `Checkout — ₹${dynamicPrice || currentPass?.price}`}</span>
                                            <ChevronRight size={20} className="text-[#24BCE0] group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </main>

            <ComingSoonModal
                isOpen={showComingSoon}
                onClose={() => setShowComingSoon(false)}
                isPreRegistration={true}
            />
            <SuccessModal
                isOpen={successState.show}
                onClose={() => setSuccessState({ ...successState, show: false })}
                title={successState.title}
                message={successState.message}
                ticketId={successState.ticketId}
            />
            <Footer />
        </div>
    );
};

export default EventSelection;

