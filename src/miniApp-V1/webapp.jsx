import { useEffect, useState } from 'react';
import { miniApp } from '@telegram-apps/sdk';

const MiniAppMainComponent = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (miniApp.mount.isAvailable()) {
            miniApp.mount().then(() => {
                const tgUser = miniApp.initDataUnsafe?.user;
                if (tgUser) {
                    setUser(tgUser);
                }
            }).catch((err) => {
                console.error('Ошибка при mount():', err);
            });
        } else {
            console.warn('miniApp.mount недоступен');
        }
    }, []);

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: '#121212',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'sans-serif',
            padding: '20px',
            boxSizing: 'border-box',
        }}>
            <h1>Добро пожаловать в Telegram Mini App</h1>
            {user && <p>👋 Привет, {user.first_name}!</p>}
        </div>
    );
};

export default MiniAppMainComponent;
