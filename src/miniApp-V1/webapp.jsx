import {useEffect, useState} from 'react';

const MiniAppMainComponent = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        tg?.ready();

        const initDataUnsafe = tg?.initDataUnsafe;
        if (initDataUnsafe?.user) {
            setUser(initDataUnsafe.user);
        }
    }, []);

    return (
        <div style={{padding: '20px'}}>
            <h1>Привет, {user?.first_name || 'гость'}!</h1>
            <p>Добро пожаловать в Telegram WebApp</p>
        </div>
    );
};

export default MiniAppMainComponent;
