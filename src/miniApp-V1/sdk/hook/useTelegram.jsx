import {useContext, useEffect, useState} from 'react';
import {loadTelegramScript} from '../utils/loadTelegramScript';
import {ThemeContext} from "../theme/ThemeContext.jsx";

const readSafeAreaInsetTop = () => {
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed; top:0; left:0; width:0; height:0; padding-top: env(safe-area-inset-top);';
    document.body.appendChild(el);
    const computed = parseFloat(getComputedStyle(el).paddingTop) || 0;
    document.body.removeChild(el);
    return computed;
};

const isIPadLike = () => {
    const ua = navigator.userAgent || '';
    return /iPad/.test(ua) || (navigator.maxTouchPoints > 2 && screen.width >= 768);
};

const resolvePlatform = (tg) => {
    return tg?.platform ||
        tg?.initDataUnsafe?.device_platform ||
        (/Android/i.test(navigator.userAgent) ? 'android' : /iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'ios' : 'web');
};

const resolveIsMobile = (platform) => {
    return ['android', 'ios'].includes(platform) || isIPadLike();
};

const tryGetViewportTopFromTelegram = async (tg, timeout = 1200) => {
    tg.recalculateViewportHeight?.();
    if (tg.viewportTop > 0) return tg.viewportTop;

    let resolved = null;
    const onViewport = () => {
        if (tg.viewportTop > 0) {
            resolved = tg.viewportTop;
            tg.offEvent?.('viewportChanged', onViewport);
        }
    };
    tg.onEvent?.('viewportChanged', onViewport);

    const start = Date.now();
    while (Date.now() - start < timeout) {
        if (resolved || tg.viewportTop > 0) {
            resolved = tg.viewportTop;
            break;
        }
        await new Promise((r) => setTimeout(r, 100));
    }

    tg.offEvent?.('viewportChanged', onViewport);
    return resolved || 0;
};

const resolveSafeTopOffset = async (tg, platform) => {
    const tgTop = await tryGetViewportTopFromTelegram(tg, 1200);
    if (tgTop > 0) return tgTop;
    if (!platform) return 0;

    const vv = window.visualViewport;
    const vvOffset = vv ? (typeof vv.offsetTop === 'number' ? vv.offsetTop : vv.pageTop || 0) : 0;
    const safeInset = readSafeAreaInsetTop();
    let offset = Math.max(vvOffset || 0, safeInset || 0) || (vvOffset + safeInset) || 0;

    return offset;
};

function useTelegram() {
    const [hasTelegram, setHasTelegram] = useState(false);
    const [safeTopOffset, setSafeTopOffset] = useState(() => {
        const cached = sessionStorage.getItem('safeTopOffset');
        return cached ? Number(cached) : 0;
    });
    const [isMobile, setIsMobile] = useState(() => {
        const platform = resolvePlatform(window.Telegram?.WebApp || {});
        return resolveIsMobile(platform);
    });
    const [isDesktop, setIsDesktop] = useState(() => !isMobile);

    const theme = useContext(ThemeContext);

    useEffect(() => {
        let stopped = false;
        let cleanupFns = [];

        const setOffsetSafely = (val) => {
            if (!stopped) {
                setSafeTopOffset(val || 0);
                sessionStorage.setItem('safeTopOffset', String(val || 0));
            }
        };

        const subscribeToViewportChanges = (tg, mobile) => {
            const handleViewportChanged = () => {
                const newTop = tg.viewportTop || 0;
                if (mobile) {
                    if (newTop > 0) {
                        setOffsetSafely(newTop);
                    } else {
                        const vv = window.visualViewport;
                        const vvOffset = vv ? (typeof vv.offsetTop === 'number' ? vv.offsetTop : vv.pageTop || 0) : 0;
                        const safeInset = readSafeAreaInsetTop();
                        const guessed = Math.max(vvOffset || 0, safeInset || 0) || (vvOffset + safeInset) || 0;
                        setOffsetSafely(guessed);
                    }
                } else {
                    setOffsetSafely(0);
                }
            };

            tg.onEvent?.('viewportChanged', handleViewportChanged);
            cleanupFns.push(() => tg.offEvent?.('viewportChanged', handleViewportChanged));

            tg.onEvent?.('ready', handleViewportChanged);
            cleanupFns.push(() => tg.offEvent?.('ready', handleViewportChanged));
        };

        const initTelegram = async () => {
            await loadTelegramScript();
            const tg = window.Telegram?.WebApp;
            if (!tg) return;

            setHasTelegram(true);

            const platform = resolvePlatform(tg);
            const mobile = resolveIsMobile(platform);
            setIsMobile(mobile);
            setIsDesktop(!mobile);

            if (theme?.colorBackground) {
                tg.setHeaderColor(theme.colorBackground);
                tg.setBackgroundColor(theme.colorBackground);
            }


            const offset = await resolveSafeTopOffset(tg, mobile);
            setOffsetSafely(mobile ? offset : 0);

            subscribeToViewportChanges(tg, mobile);
        };

        void initTelegram();

        return () => {
            stopped = true;
            cleanupFns.forEach((fn) => fn && fn());
        };
    }, []);

    return {
        hasTelegram,
        safeTopOffset,
        isMobile,
        isDesktop,
        theme
    };
}

export default useTelegram;
