import {useState, useEffect} from 'react';

const useSafeAreaInsets = () => {
    const [insets, setInsets] = useState({
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px',
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const root = document.documentElement;

        const get = (side) => {
            const val = getComputedStyle(root).getPropertyValue(`--tg-safe-area-inset-${side}`);
            return val?.trim() || '0px';
        };

        const updateInsets = () => {
            setInsets({
                top: get('top'),
                bottom: get('bottom'),
                left: get('left'),
                right: get('right'),
            });
        };

        updateInsets();

        window.addEventListener('resize', updateInsets);
        window.addEventListener('tg:insetsChanged', updateInsets); // на будущее

        return () => {
            window.removeEventListener('resize', updateInsets);
            window.removeEventListener('tg:insetsChanged', updateInsets);
        };
    }, []);

    return insets;
};

export default useSafeAreaInsets;