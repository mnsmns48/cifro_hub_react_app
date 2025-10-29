import {useContext, useEffect, useState, useRef} from "react";
import {loadTelegramScript} from "../utils/loadTelegramScript";
import {ThemeContext} from "../theme/ThemeContext.jsx";
import useSafeAreaInsets from "./useSafeAreaInsets.jsx";


const isIPadLike = () =>
    /iPad/.test(navigator.userAgent) || (navigator.maxTouchPoints > 2 && screen.width >= 768);

const resolvePlatform = (tg) =>
    tg?.platform ||
    tg?.initDataUnsafe?.device_platform ||
    (/Android/i.test(navigator.userAgent)
        ? "android"
        : /iPhone|iPad|iPod/i.test(navigator.userAgent)
            ? "ios"
            : "web");

const resolveIsMobile = (platform) => ["android", "ios"].includes(platform) || isIPadLike();

export function useTelegram() {
    const [hasTelegram, setHasTelegram] = useState(false);
    const [tg, setTg] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const theme = useContext(ThemeContext);
    const cleanupFns = useRef([]);

    useEffect(() => {
        let stopped = false;

        const initTelegram = async () => {
            await loadTelegramScript();
            const telegram = window.Telegram?.WebApp;
            if (!telegram || stopped) return;

            setHasTelegram(true);
            setTg(telegram);

            const platform = resolvePlatform(telegram);
            const mobile = resolveIsMobile(platform);
            setIsMobile(mobile);
            setIsDesktop(!mobile);

            if (theme?.colorBackground) {
                telegram.setHeaderColor?.(theme.colorBackground);
                telegram.setBackgroundColor?.(theme.colorBackground);
            }

            if (mobile) {
                telegram.expand?.();
            }
            telegram.ready?.();
            setViewportHeight(telegram.viewportHeight || window.innerHeight);


            const handleChange = () => {
                if (!stopped) {
                    telegram.recalculateViewportHeight?.();
                    const newHeight = telegram.viewportHeight || window.innerHeight;
                    setViewportHeight(newHeight);
                }
            };

            telegram.onEvent?.("viewportChanged", handleChange);
            telegram.onEvent?.("themeChanged", handleChange);

            cleanupFns.current.push(() => {
                telegram.offEvent?.("viewportChanged", handleChange);
                telegram.offEvent?.("themeChanged", handleChange);
            });
        };

        void initTelegram();

        return () => {
            stopped = true;
            cleanupFns.current.forEach((fn) => fn && fn());
        };
    }, [theme]);


    const {insets, contentInsets} = useSafeAreaInsets(tg);


    const handleResize = () => {
        setViewportHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    cleanupFns.current.push(() => {
        window.removeEventListener("resize", handleResize);
    });

    return {
        hasTelegram,
        tg,
        isMobile,
        isDesktop,
        theme,
        insets,
        contentInsets,
        viewportHeight
    };
}

export default useTelegram;