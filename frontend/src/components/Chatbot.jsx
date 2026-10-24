import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Chatbot = () => {
    const location = useLocation();

    useEffect(() => {
        // Hide chatbot on all admin-related routes and login page
        const isAdminPage = location.pathname.startsWith('/admin') ||
            location.pathname === '/login' ||
            location.pathname === '/signup';

        if (isAdminPage) return;

        const script = document.createElement("script");
        script.async = true;
        script.src = "https://embed.tawk.to/6994aacd1b1f6f1c3383596b/1jhmbmda7";
        script.charset = "UTF-8";
        script.setAttribute("crossorigin", "*");

        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [location.pathname]);

    return null;
};

export default Chatbot;
