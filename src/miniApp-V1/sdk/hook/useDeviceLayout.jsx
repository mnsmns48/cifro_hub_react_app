import {useEffect, useState} from 'react';

export const useDeviceLayout = () => {
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const check = () => {
            setIsTablet(window.innerWidth >= 768);
        };
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    return {isTablet};
};
