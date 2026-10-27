import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { API_URL } from '../utils/config';


const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username.endsWith('@kce.ac.in')) {
            setError('Only @kce.ac.in email addresses are allowed.');
            return;
        }

        try {
            const { data } = await axios.post(`${API_URL}/auth/login`, {
                username,
                password,
            });

            // Store token (if sent in body for convenience) or just rely on cookie
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data));

            navigate('/admin/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#14050E] text-white flex flex-col relative overflow-hidden">
            {/* Ambient KALAM glows */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#D62C76]/15 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-[#24BCE0]/15 blur-3xl pointer-events-none" />

            <div className="flex-1 flex items-center justify-center p-4 relative z-10">
                {/* Glassmorphic Container */}
                <div className="w-full max-w-md bg-[#180614]/85 backdrop-blur-xl border border-[#D62C76]/30 rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-[1.01]">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F2D10A] via-[#F47721] to-[#D62C76]">
                            Admin Portal
                        </h2>
                        <p className="text-gray-300/80 mt-2">Secure access for HODs & Club Heads</p>
                    </div>

                    {error && (
                        <div className="bg-[#F04438]/20 border border-[#F04438]/50 text-red-200 px-4 py-2 rounded-lg mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative group">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-[#24BCE0] transition-colors" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#14050E]/90 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#24BCE0]/60 focus:ring-1 focus:ring-[#24BCE0]/40 transition-all placeholder-gray-500"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-[#D62C76] transition-colors" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#14050E]/90 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#D62C76]/60 focus:ring-1 focus:ring-[#D62C76]/40 transition-all placeholder-gray-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#D62C76] to-[#F47721] hover:from-[#c22066] hover:to-[#df6615] text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-[#D62C76]/25 transform active:scale-95 cursor-pointer"
                        >
                            Authenticate
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
