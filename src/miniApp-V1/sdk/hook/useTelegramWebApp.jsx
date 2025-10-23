import { useEffect } from "react";

const useTelegramWebApp = ({ preferLightHeader = false } = {}) => {
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg) return;

        // цвета из themeParams
        const theme = tg.themeParams || {};
        const bgColor = theme.bg_color || "#ffffff";
        const headerBg = theme.header_bg_color || theme.secondary_bg_color || "#000000";

        const safeCall = (fn, name) => {
            try {
                if (typeof fn === "function") {
                    fn();
                    console.log(`[tg] called ${name}`);
                }
            } catch (e) {
                console.warn(`[tg] ${name} failed`, e);
            }
        };

        // 1) явная установка фоновых цветов в Telegram
        // — используем header_bg_color (hex) чтобы Telegram правильно выбрал стиль статус-бара
        safeCall(() => tg.setHeaderColor(headerBg), "setHeaderColor(header_bg_color)");
        safeCall(() => tg.setBackgroundColor(bgColor), "setBackgroundColor(bg_color)");

        // 2) принудительно задаём фон для html/body — чтобы WebView area не была белой
        try {
            document.documentElement.style.backgroundColor = bgColor;
            document.body.style.backgroundColor = bgColor;
        } catch (e) { /* ignore */ }

        // 3) ready + небольшой таймаут, потом expand
        safeCall(() => tg.ready(), "ready");
        setTimeout(() => {
            if (!tg.isExpanded) safeCall(() => tg.expand(), "expand");
        }, 220); // можно увеличить до 400ms при необходимости

        // 4) подписка на смену темы — повторяем действия
        const onThemeChanged = () => {
            const newTheme = tg.themeParams || {};
            const newBg = newTheme.bg_color || bgColor;
            const newHeader = newTheme.header_bg_color || newTheme.secondary_bg_color || headerBg;
            safeCall(() => tg.setHeaderColor(newHeader), "setHeaderColor (themeChanged)");
            safeCall(() => tg.setBackgroundColor(newBg), "setBackgroundColor (themeChanged)");
            try {
                document.documentElement.style.backgroundColor = newBg;
                document.body.style.backgroundColor = newBg;
            } catch (e) {}
        };

        if (typeof tg.onEvent === "function") {
            tg.onEvent("themeChanged", onThemeChanged);
        } else if (typeof tg.onThemeChanged === "function") {
            tg.onThemeChanged(onThemeChanged);
        }

        // 5) fallback overlay (если спустя 400ms иконки всё ещё не контрастны)
        let overlay = null;
        const insertOverlay = () => {
            if (overlay) return;
            overlay = document.createElement("div");
            overlay.id = "tg-top-overlay-fallback";
            overlay.style.position = "fixed";
            overlay.style.left = "0";
            overlay.style.right = "0";
            overlay.style.top = "0";
            overlay.style.height = "env(safe-area-inset-top, 44px)";
            overlay.style.background = headerBg; // ставим header color
            overlay.style.zIndex = "9999999";
            overlay.style.pointerEvents = "none";
            document.body.appendChild(overlay);
        };

        const fallbackTimer = setTimeout(() => {
            // вставляем оверлей как запасной хак
            insertOverlay();
        }, 600);

        return () => {
            clearTimeout(fallbackTimer);
            if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
            if (typeof tg.offEvent === "function") {
                try { tg.offEvent("themeChanged", onThemeChanged); } catch(e) {}
            } else if (typeof tg.offThemeChanged === "function") {
                try { tg.offThemeChanged(onThemeChanged); } catch(e) {}
            }
        };
    }, [preferLightHeader]);
};

export default useTelegramWebApp;