import { useEffect } from 'react';

export const useTelegramScriptLoader = () => {
    useEffect(() => {
        const alreadyLoaded = document.querySelector('script[src="https://telegram.org/js/telegram-web-app.js"]');
        const isWebAppAvailable = window.Telegram?.WebApp;

        if (!isWebAppAvailable && !alreadyLoaded) {
            const script = document.createElement('script');
            script.src = 'https://telegram.org/js/telegram-web-app.js';
            script.async = true;
            script.onerror = () => {
                console.error('Не удалось загрузить telegram-web-app.js');
            };
            document.head.appendChild(script);
        }
    }, []);
};
