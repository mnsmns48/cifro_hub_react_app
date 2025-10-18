import {useEffect} from 'react';
import {requestFullscreen} from '@telegram-apps/sdk-react';
import './miniapp.css';

const MiniAppMainComponent = () => {
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            requestFullscreen();
            tg.setBackgroundColor('#000000');
            tg.showCloseConfirmation = true;
        }
    }, []);

    return (
        <div className="miniapp-container">
            <img
                src="/logo-cifro-hub.svg"
                alt="Цифро Хаб"
                className="miniapp-logo"
            />
            <div className="miniapp-text">в разработке</div>
        </div>
    );
};

export default MiniAppMainComponent;
