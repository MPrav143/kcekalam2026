import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ParticleLoader from './ParticleLoader';

const LoaderContext = createContext({
    triggerLoader: () => { },
    isLoading: false,
});

export const useParticleLoader = () => useContext(LoaderContext);

export const GlobalNavigationLoader = ({ children }) => {
    const location = useLocation();
    const previousPathRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [loaderKey, setLoaderKey] = useState(0);

    // Trigger on initial entry and subsequent pathname changes
    useEffect(() => {
        const currentPath = location.pathname;

        // Initial entry or direct deep link access
        if (previousPathRef.current === null) {
            previousPathRef.current = currentPath;
            setIsLoading(true);
            setIsInitialLoad(true);
            return;
        }

        // Internal route change to a different path
        if (currentPath !== previousPathRef.current) {
            previousPathRef.current = currentPath;
            setIsInitialLoad(false);
            setIsLoading(true);
            setLoaderKey((prev) => prev + 1);
        }
    }, [location.pathname]);

    const handleAnimationComplete = () => {
        setIsLoading(false);
    };

    const triggerLoader = () => {
        setIsInitialLoad(false);
        setIsLoading(true);
        setLoaderKey((prev) => prev + 1);
    };

    return (
        <LoaderContext.Provider value={{ triggerLoader, isLoading }}>
            {isLoading && (
                <ParticleLoader
                    key={`loader-${loaderKey}`}
                    isActive={isLoading}
                    isInitial={isInitialLoad}
                    onComplete={handleAnimationComplete}
                    pageLabel={location.pathname === '/' ? 'KALAM 2026' : location.pathname.slice(1).toUpperCase()}
                />
            )}
            {children}
        </LoaderContext.Provider>
    );
};

export default GlobalNavigationLoader;
