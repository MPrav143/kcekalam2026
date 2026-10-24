import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-transparent bg-cosmic-grid text-white flex flex-col selection:bg-[#D62C76] selection:text-white">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-[#D62C76]/25 blur-[100px] rounded-full" />
                    <AlertCircle size={120} className="text-[#24BCE0] relative z-10 animate-pulse" />
                </div>

                <h1 className="text-8xl font-black mb-4 bg-gradient-to-r from-[#F2D10A] via-[#F47721] to-[#D62C76] bg-clip-text text-transparent">
                    404
                </h1>

                <h2 className="text-3xl font-bold mb-6 text-white/90">
                    Oops! Page Not Found
                </h2>

                <p className="text-[#D8D4F0]/80 max-w-md mx-auto mb-10 text-lg leading-relaxed font-body">
                    The page you're looking for doesn't exist or has been moved.
                    Let's get you back on track to KALAM 2026!
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#D62C76] to-[#F47721] hover:from-[#c22066] hover:to-[#df6615] text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-[#D62C76]/30 transform hover:-translate-y-1 cursor-pointer font-accent"
                >
                    <Home size={20} />
                    Back to Home
                </button>
            </main>
            <Footer />
        </div>
    );
};

export default NotFound;
