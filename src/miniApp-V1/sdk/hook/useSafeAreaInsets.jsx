// import { useEffect, useState } from "react";
//
// const readCSSInset = (name) => {
//     if (typeof window === "undefined") return 0;
//
//     const val =
//         parseFloat(
//             getComputedStyle(document.documentElement).getPropertyValue(`--tg-safe-area-inset-${name}`)
//         ) ||
//         parseFloat(
//             getComputedStyle(document.documentElement).getPropertyValue(`env(safe-area-inset-${name})`)
//         ) ||
//         0;
//
//     return isNaN(val) ? 0 : val;
// };
//
// const readDOMInset = (side) => {
//     if (typeof document === "undefined") return 0;
//     const el = document.createElement("div");
//     el.style.cssText = `
//         position: fixed;
//         ${side}: 0;
//         left: 0;
//         width: 0;
//         height: 0;
//         padding-${side}: env(safe-area-inset-${side});
//     `;
//     document.body.appendChild(el);
//     const val = parseFloat(getComputedStyle(el).getPropertyValue(`padding-${side}`)) || 0;
//     document.body.removeChild(el);
//     return val;
// };
//
// const useSafeAreaInsets = (tg) => {
//     const [insets, setInsets] = useState({
//         top: 0,
//         bottom: 0,
//         left: 0,
//         right: 0,
//         totalVertical: 0,
//         totalHorizontal: 0,
//     });
//
//     const [contentInsets, setContentInsets] = useState({
//         top: 0,
//         bottom: 0,
//         left: 0,
//         right: 0,
//     });
//
//     const updateInsets = () => {
//         const tgInsets = tg?.contentSafeAreaInset || tg?.contentSafeAreaInsets || {};
//
//         // Telegram SDK значения
//         const tgTop = tgInsets.top || 0;
//         const tgBottom = tgInsets.bottom || 0;
//         const tgLeft = tgInsets.left || 0;
//         const tgRight = tgInsets.right || 0;
//
//         // CSS env() переменные
//         const cssTop = readCSSInset("top");
//         const cssBottom = readCSSInset("bottom");
//         const cssLeft = readCSSInset("left");
//         const cssRight = readCSSInset("right");
//
//         // DOM измерение через padding
//         const domTop = readDOMInset("top");
//         const domBottom = readDOMInset("bottom");
//
//         // Итоговые безопасные отступы
//         const top = Math.max(tgTop, cssTop, domTop);
//         const bottom = Math.max(tgBottom, cssBottom, domBottom);
//         const left = Math.max(tgLeft, cssLeft);
//         const right = Math.max(tgRight, cssRight);
//
//         setInsets({
//             top,
//             bottom,
//             left,
//             right,
//             totalVertical: top + bottom,
//             totalHorizontal: left + right,
//         });
//
//         setContentInsets({
//             top: tgTop || cssTop || domTop,
//             bottom: tgBottom || cssBottom || domBottom,
//             left: tgLeft || cssLeft,
//             right: tgRight || cssRight,
//         });
//     };
//
//     useEffect(() => {
//         updateInsets();
//
//         if (tg?.onEvent) {
//             const handleViewport = () => updateInsets();
//             tg.onEvent("viewportChanged", handleViewport);
//             tg.onEvent("themeChanged", handleViewport);
//             return () => {
//                 tg.offEvent?.("viewportChanged", handleViewport);
//                 tg.offEvent?.("themeChanged", handleViewport);
//             };
//         }
//
//         if (window.visualViewport) {
//             const vv = window.visualViewport;
//             vv.addEventListener("resize", updateInsets);
//             vv.addEventListener("scroll", updateInsets);
//             return () => {
//                 vv.removeEventListener("resize", updateInsets);
//                 vv.removeEventListener("scroll", updateInsets);
//             };
//         }
//     }, [tg]);
//
//     return { insets, contentInsets };
// };
//
// export default useSafeAreaInsets;
//

import { useEffect, useState } from 'react'

const readCSSContentInset = (side) => {
    if (typeof window === 'undefined') return 0
    const root = document.documentElement
    const contentVar = getComputedStyle(root).getPropertyValue(`--tg-content-safe-area-inset-${side}`)
    const envVar = getComputedStyle(root).getPropertyValue(`env(safe-area-inset-${side})`)
    const val = parseFloat(contentVar || envVar || '0')
    return isNaN(val) ? 0 : val
}

const readDOMInset = (side) => {
    if (typeof document === 'undefined') return 0
    const el = document.createElement('div')
    el.style.cssText = `
    position: fixed;
    ${side}: 0;
    left: 0;
    width: 0;
    height: 0;
    padding-${side}: env(safe-area-inset-${side});
  `
    document.body.appendChild(el)
    const val = parseFloat(getComputedStyle(el).getPropertyValue(`padding-${side}`)) || 0
    document.body.removeChild(el)
    return val
}

const useSafeAreaInsets = (tg) => {
    const [insets, setInsets] = useState({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        totalVertical: 0,
        totalHorizontal: 0,
    })

    const [contentInsets, setContentInsets] = useState({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    })

    const updateInsets = () => {
        const tgInsets = tg?.contentSafeAreaInset || tg?.contentSafeAreaInsets || {}

        const tgTop = tgInsets.top || 0
        const tgBottom = tgInsets.bottom || 0
        const tgLeft = tgInsets.left || 0
        const tgRight = tgInsets.right || 0

        const cssTop = readCSSContentInset('top')
        const cssBottom = readCSSContentInset('bottom')
        const cssLeft = readCSSContentInset('left')
        const cssRight = readCSSContentInset('right')

        const domTop = readDOMInset('top')
        const domBottom = readDOMInset('bottom')

        const top = Math.max(tgTop, cssTop, domTop)
        const bottom = Math.max(tgBottom, cssBottom, domBottom)
        const left = Math.max(tgLeft, cssLeft)
        const right = Math.max(tgRight, cssRight)

        setInsets({
            top,
            bottom,
            left,
            right,
            totalVertical: top + bottom,
            totalHorizontal: left + right,
        })

        setContentInsets({
            top: tgTop || cssTop || domTop,
            bottom: tgBottom || cssBottom || domBottom,
            left: tgLeft || cssLeft,
            right: tgRight || cssRight,
        })
    }

    useEffect(() => {
        updateInsets()

        if (tg?.onEvent) {
            const handleViewport = () => updateInsets()
            tg.onEvent('viewportChanged', handleViewport)
            tg.onEvent('themeChanged', handleViewport)
            return () => {
                tg.offEvent?.('viewportChanged', handleViewport)
                tg.offEvent?.('themeChanged', handleViewport)
            }
        }

        if (window.visualViewport) {
            const vv = window.visualViewport
            vv.addEventListener('resize', updateInsets)
            vv.addEventListener('scroll', updateInsets)
            return () => {
                vv.removeEventListener('resize', updateInsets)
                vv.removeEventListener('scroll', updateInsets)
            }
        }
    }, [tg])

    return { insets, contentInsets }
}

export default useSafeAreaInsets
