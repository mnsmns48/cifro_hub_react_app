import { useEffect, useState } from 'react';
import { loadTelegramScript } from '../utils/loadTelegramScript';

// Включи debug = true для подробных логов в консоль при отладке на устройствах
const DEBUG = false;

const readSafeAreaInsetTop = () => {
    try {
        // создаём элемент со стилем padding-top: env(safe-area-inset-top) и читаем computed value
        const el = document.createElement('div');
        el.style.cssText = 'position:fixed; top:0; left:0; width:0; height:0; padding-top: env(safe-area-inset-top);';
        document.body.appendChild(el);
        const computed = parseFloat(getComputedStyle(el).paddingTop) || 0;
        document.body.removeChild(el);
        return computed;
    } catch (e) {
        return 0;
    }
};

const isIPadLike = () => {
    const ua = navigator.userAgent || '';
    // iPadOS 13+ reports MacIntel with touch points -> detect via maxTouchPoints
    if (/iPad/.test(ua)) return true;
    if (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && screen.width >= 768) return true;
    return false;
};

export const useTelegram = () => {
    const [hasTelegram, setHasTelegram] = useState(false);
    const [safeTopOffset, setSafeTopOffset] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        let cleanupFns = [];
        let stopped = false;

        const setOffsetSafely = (val) => {
            if (stopped) return;
            setSafeTopOffset(val || 0);
            if (DEBUG) console.log('[useTelegramApp] safeTopOffset set ->', val);
        };

        const initTelegram = async () => {
            try {
                await loadTelegramScript();
            } catch (err) {
                if (DEBUG) console.warn('[useTelegramApp] script load error', err);
                return;
            }

            const tg = window.Telegram?.WebApp;
            if (!tg) {
                if (DEBUG) console.warn('[useTelegramApp] Telegram.WebApp not found after load');
                return;
            }

            setHasTelegram(true);

            // определяем платформу (используем tg.platform когда есть)
            const platform =
                tg.platform ||
                tg.initDataUnsafe?.device_platform ||
                (/Android/i.test(navigator.userAgent) ? 'android' : /iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'ios' : 'web');

            const mobile = ['android', 'ios'].includes(platform) || isIPadLike();
            setIsMobile(mobile);
            setIsDesktop(!mobile);

            // Попытка получить viewportTop из Telegram — с ожиданием
            const tryGetViewportTopFromTelegram = async (timeout = 2000) => {
                // первый быстрый вызов
                tg.recalculateViewportHeight?.();
                if (tg.viewportTop > 0) return tg.viewportTop;

                // слушаем событие viewportChanged
                let resolved = null;
                const onViewport = () => {
                    if (tg.viewportTop > 0) {
                        resolved = tg.viewportTop;
                        // не забываем удалить слушателя
                        tg.offEvent?.('viewportChanged', onViewport);
                    }
                };
                tg.onEvent?.('viewportChanged', onViewport);

                // подстраховка: ждём до timeout ms, проверяя раз в 150ms
                const start = Date.now();
                while (Date.now() - start < timeout) {
                    if (resolved) break;
                    if (tg.viewportTop > 0) {
                        resolved = tg.viewportTop;
                        break;
                    }
                    // eslint-disable-next-line no-await-in-loop
                    await new Promise((r) => setTimeout(r, 150));
                }
                // очистка
                tg.offEvent?.('viewportChanged', onViewport);
                return resolved || 0;
            };

            let offset = 0;

            try {
                const tgTop = await tryGetViewportTopFromTelegram(2500); // ждём до 2.5s
                if (tgTop > 0) {
                    offset = tgTop;
                    if (DEBUG) console.log('[useTelegramApp] got viewportTop from Telegram:', tgTop);
                } else {
                    // fallback: используем visualViewport + safe-area-inset
                    const vv = window.visualViewport;
                    const vvOffset = vv ? (typeof vv.offsetTop === 'number' ? vv.offsetTop : (vv.pageTop || 0)) : 0;
                    const safeInset = readSafeAreaInsetTop();
                    if (DEBUG) {
                        console.log('[useTelegramApp] tgTop=0, visualViewport.offsetTop=', vvOffset, 'safe-area-inset-top=', safeInset);
                    }

                    // Логика: если мобильное устройство — берем visualViewport.offsetTop + safeInset (если оба есть)
                    if (mobile) {
                        // При некоторых браузерах offsetTop уже включает safe-area; на других — нет, поэтому используем максимум
                        offset = Math.max(vvOffset || 0, safeInset || 0) || (vvOffset + safeInset) || 0;

                        // Если всё ещё 0, пробуем более агрессивную эвристику:
                        if (!offset) {
                            // iPad special detection might yield positive values - try small pause and re-read visualViewport
                            if (vv) {
                                // краткая задержка, т.к. визуальная вьюпорта может обновиться
                                await new Promise((r) => setTimeout(r, 200));
                                const vv2 = window.visualViewport;
                                const vvOffset2 = vv2 ? (typeof vv2.offsetTop === 'number' ? vv2.offsetTop : (vv2.pageTop || 0)) : 0;
                                offset = vvOffset2 || safeInset || 0;
                            }
                        }
                    } else {
                        // desktop -> 0
                        offset = 0;
                    }
                }
            } catch (err) {
                if (DEBUG) console.warn('[useTelegramApp] error while resolving offset', err);
                offset = 0;
            }

            setOffsetSafely(offset);

            // подписываемся на изменения viewport (чтобы в будущем обновлять)
            const handleViewportChanged = () => {
                try {
                    const newTop = tg.viewportTop || 0;
                    if (mobile) {
                        if (newTop > 0) {
                            setOffsetSafely(newTop);
                        } else {
                            // fallback to visualViewport if tg reports 0
                            const vv = window.visualViewport;
                            const vvOffset = vv ? (typeof vv.offsetTop === 'number' ? vv.offsetTop : (vv.pageTop || 0)) : 0;
                            const safeInset = readSafeAreaInsetTop();
                            const guessed = Math.max(vvOffset || 0, safeInset || 0) || (vvOffset + safeInset) || 0;
                            setOffsetSafely(guessed);
                        }
                    } else {
                        setOffsetSafely(0);
                    }
                } catch (e) {
                    if (DEBUG) console.warn('[useTelegramApp] viewportChanged handler error', e);
                }
            };

            tg.onEvent?.('viewportChanged', handleViewportChanged);
            cleanupFns.push(() => tg.offEvent?.('viewportChanged', handleViewportChanged));

            // Also listen to 'ready' to re-run resolve if needed
            const handleReady = () => {
                // re-resolve quickly
                handleViewportChanged();
            };
            tg.onEvent?.('ready', handleReady);
            cleanupFns.push(() => tg.offEvent?.('ready', handleReady));
        };

        initTelegram();

        return () => {
            stopped = true;
            cleanupFns.forEach((fn) => fn && fn());
        };
    }, []);

    return { hasTelegram, safeTopOffset, isMobile, isDesktop };
};