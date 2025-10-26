import {useEffect, useState} from "react";

const TelegramDebugPanel = () => {
    const [info, setInfo] = useState({});

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        setInfo({
            now: new Date().toISOString(),
            hasTelegram: Boolean(tg),
            tgObj: tg
                ? {
                    version: tg.version,
                    colorScheme: tg.colorScheme,
                    themeParams: tg.themeParams,
                    initData: Boolean(tg.initData),
                    readyFn: typeof tg.ready,
                    setHeaderColorFn: typeof tg.setHeaderColor,
                    setBackgroundColorFn: typeof tg.setBackgroundColor,
                    onEventFn: typeof tg.onEvent,
                    offEventFn: typeof tg.offEvent,
                }
                : null,
            windowInnerHeight: window.innerHeight,
            visualViewport: {
                height: window.visualViewport?.height,
                offsetTop: window.visualViewport?.offsetTop,
            },
        });
    }, []);

    return (
        <div
            style={{
                background: "white",
                color: "black",
                padding: "16px",
                fontFamily: "monospace",
                fontSize: "14px",
                wordBreak: "break-word",
            }}
        >
            <h2>📍 Telegram Debug Panel</h2>
            <pre>{JSON.stringify(info, null, 2)}</pre>
        </div>
    );
};

export default TelegramDebugPanel;