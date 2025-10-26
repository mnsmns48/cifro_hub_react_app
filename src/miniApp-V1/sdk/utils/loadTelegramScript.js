export const loadTelegramScript = () => {
    return new Promise((resolve, reject) => {
        if (window.Telegram?.WebApp) {
            resolve(true);
            return;
        }

        const existing = document.querySelector(
            'script[src="https://telegram.org/js/telegram-web-app.js"]'
        );

        if (existing) {
            const interval = setInterval(() => {
                if (window.Telegram?.WebApp) {
                    clearInterval(interval);
                    resolve(true);
                }
            }, 50);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-web-app.js';
        script.async = true;

        script.onload = () => {
            if (window.Telegram?.WebApp) resolve(true);
            else {
                const interval = setInterval(() => {
                    if (window.Telegram?.WebApp) {
                        clearInterval(interval);
                        resolve(true);
                    }
                }, 50);
                setTimeout(() => {
                    clearInterval(interval);
                    reject(new Error('Telegram WebApp не инициализировался'));
                }, 5000);
            }
        };

        script.onerror = () => reject(new Error('Не удалось загрузить telegram-web-app.js'));
        document.body.appendChild(script);
    });
};