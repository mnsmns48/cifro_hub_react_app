import { useEffect, useState } from 'react';

const TelegramDiagnostics = () => {
    const [diagnostics, setDiagnostics] = useState({
        initDataRaw: '',
        themeParams: {},
        viewportHeight: 0,
        innerHeight: 0,
        isExpanded: false,
        webAppAvailable: false,
    });

    useEffect(() => {
        const tg = window.Telegram?.WebApp;

        setDiagnostics({
            initDataRaw: tg?.initData || '',
            themeParams: tg?.themeParams || {},
            viewportHeight: tg?.viewportHeight || 0,
            innerHeight: window.innerHeight,
            isExpanded: tg?.isExpanded || false,
            webAppAvailable: !!tg,
        });
    }, []);

    return (
        <div style={{ padding: '1rem', fontFamily: 'monospace' }}>
            <h2>📊 Telegram Diagnostics</h2>
            <pre>{JSON.stringify(diagnostics, null, 2)}</pre>
        </div>
    );
};

export default TelegramDiagnostics;