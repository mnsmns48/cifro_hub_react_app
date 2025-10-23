import {useEffect} from 'react';


const MiniAppMain = () => {

    useEffect(() => {
        if (!window.Telegram) {
            const script = document.createElement('script');
            script.src = 'https://telegram.org/js/telegram-web-app.js';
            script.async = true;
            script.onerror = () => {
                console.error('❌ Не удалось загрузить telegram-web-app.js');
            };
            document.head.appendChild(script);
        }
    }, []);
}

export default MiniAppMain;