import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Building, Briefcase, ChevronDown } from 'lucide-react';
import { API_URL } from '../utils/config';

const AdminSignup = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'admin',
        department: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username.endsWith('@kce.ac.in')) {
            setError('Email must end with @kce.ac.in');
            return;
        }

        if (formData.role === 'hod' && !formData.department) {
            setError('Department is required for HODs');
            return;
        }

        try {
            await axios.post(`${API_URL}/auth/setup`, formData);

            // Auto login or redirect to login
            // For now, redirect to login with a success message (could use state or toast)
            alert('Signup successful! Please login.');
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#14050E] text-white flex flex-col relative overflow-hidden">
            {/* Ambient KALAM glows */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#D62C76]/15 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-[#24BCE0]/15 blur-3xl pointer-events-none" />

            <div className="flex-1 flex items-center justify-center p-4 relative z-10">
                <div className="w-full max-w-md bg-[#180614]/85 backdrop-blur-xl border border-[#D62C76]/30 rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-[1.01]">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F2D10A] via-[#F47721] to-[#D62C76]">
                            Create Account
                        </h2>
                        <p className="text-gray-300/80 mt-2">For Faculty & Administration</p>
                    </div>

                    {error && (
                        <div className="bg-[#F04438]/20 border border-[#F04438]/50 text-red-200 px-4 py-2 rounded-lg mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div className="relative group">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-[#24BCE0] transition-colors" />
                            <input
                                type="email"
                                name="username"
                                placeholder="Email (@kce.ac.in)"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full bg-[#14050E]/90 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#24BCE0]/60 focus:ring-1 focus:ring-[#24BCE0]/40 transition-all placeholder-gray-500"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-[#D62C76] transition-colors" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-[#14050E]/90 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#D62C76]/60 focus:ring-1 focus:ring-[#D62C76]/40 transition-all placeholder-gray-500"
                                required
                            />
                        </div>

                        {/* Role Selection */}
                        <div className="relative group">
                            <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-[#F5A623] transition-colors z-10" />
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full bg-[#14050E]/90 border border-white/10 rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:border-[#F5A623]/60 focus:ring-1 focus:ring-[#F5A623]/40 transition-all text-white appearance-none cursor-pointer [&>option]:bg-[#180614]"
                            >
                                <option value="admin">Kalam Team (Admin)</option>
                                <option value="principal">Principal</option>
                                <option value="dean">Dean</option>
                                <option value="hod">HOD</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Department Selection (Conditional) */}
                        {formData.role === 'hod' && (
                            <div className="relative group animate-fade-in-down">
                                <Building className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-[#F2D10A] transition-colors z-10" />
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full bg-[#14050E]/90 border border-white/10 rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:border-[#F2D10A]/60 focus:ring-1 focus:ring-[#F2D10A]/40 transition-all text-white appearance-none cursor-pointer [&>option]:bg-[#180614]"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    <option value="CSE">CSE</option>
                                    <option value="ECE">ECE</option>
                                    <option value="EEE">EEE</option>
                                    <option value="MECH">MECH</option>
                                    <option value="CIVIL">CIVIL</option>
                                    <option value="IT">IT</option>
                                    <option value="AIDS">AIDS</option>
                                    <option value="CSBS">CSBS</option>
                                    {/* Add other departments as needed */}
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#D62C76] to-[#F47721] hover:from-[#c22066] hover:to-[#df6615] text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-[#D62C76]/25 transform active:scale-95 cursor-pointer"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-[#24BCE0] hover:text-[#52cde9] transition-colors font-medium cursor-pointer"
                            >
                                Login here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSignup;
