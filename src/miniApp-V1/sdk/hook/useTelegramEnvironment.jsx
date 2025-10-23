// useTelegramEnvironment.js
import { useState, useEffect, useLayoutEffect } from 'react';

const parsePx = (v) => {
    if (!v) return 0;
    const n = parseFloat(v.replace('px',''));
    return Number.isFinite(n) ? n : 0;
};

const measureCssEnv = (prop) => {
    const el = document.createElement('div');
    el.style.cssText = `
    position: absolute;
    inset: 0 auto auto 0;
    width: 0;
    height: 0;
    padding-top: 0;
    padding-bottom: 0;
    visibility: hidden;
    pointer-events: none;
  `;

    if (prop === 'safe-area-inset-top') {
        el.style.paddingTop = `env(${prop}, 0px)`;
    } else if (prop === 'safe-area-inset-bottom') {
        el.style.paddingBottom = `env(${prop}, 0px)`;
    }
    document.body.appendChild(el);
    const cs = window.getComputedStyle(el);
    const val = prop === 'safe-area-inset-top' ? cs.paddingTop : cs.paddingBottom;
    document.body.removeChild(el);
    return parsePx(val);
};

const useTelegramEnvironment = () => {
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const [viewportStableHeight, setViewportStableHeight] = useState(null);
    const [safeTop, setSafeTop] = useState(0);
    const [safeBottom, setSafeBottom] = useState(0);
    const [tg, setTg] = useState(null);

    useLayoutEffect(() => {
        try {
            const measuredTop = measureCssEnv('safe-area-inset-top');
            const measuredBottom = measureCssEnv('safe-area-inset-bottom');
            setSafeTop(measuredTop);
            setSafeBottom(measuredBottom);
        } catch (e) {
            setSafeTop(0);
            setSafeBottom(0);
        }
    }, []);

    useEffect(() => {
        const telegram = window.Telegram?.WebApp;
        if (telegram) {
            setTg(telegram);
            if (!telegram.isExpanded) {
                try { telegram.expand(); } catch(e) {}
            }
            setViewportHeight(telegram.viewportHeight || window.innerHeight);
            setViewportStableHeight(telegram.viewportStableHeight || telegram.viewportHeight || window.innerHeight);
        } else {
            setViewportHeight(window.innerHeight);
            setViewportStableHeight(window.innerHeight);
        }

        const update = () => {
            const visual = window.visualViewport;
            const height = telegram?.viewportHeight || (visual?.height ? Math.round(visual.height) : window.innerHeight);
            const stable = telegram?.viewportStableHeight || height;
            setViewportHeight(height);
            setViewportStableHeight(stable);

            try {
                const measuredTop = measureCssEnv('safe-area-inset-top');
                const measuredBottom = measureCssEnv('safe-area-inset-bottom');
                setSafeTop(measuredTop);
                setSafeBottom(measuredBottom);
            } catch (e) {
                // ignore
            }
        };

        window.addEventListener('resize', update);
        window.addEventListener('orientationchange', update);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', update);
            window.visualViewport.addEventListener('scroll', update);
        }

        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('orientationchange', update);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', update);
                window.visualViewport.removeEventListener('scroll', update);
            }
        };
    }, []);

    return {
        tg,
        viewportHeight,
        viewportStableHeight,
        safeTop,
        safeBottom,
        themeParams: tg?.themeParams,
        initData: tg?.initData,
        initDataRaw: tg?.initDataRaw,
    };
};

export default useTelegramEnvironment;