import {useState, useEffect} from "react";

const useSafeAreaInsets = () => {
    const [insets, setInsets] = useState({
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        const root = document.documentElement;

        const computeHInset = () => {
            const win = window.innerWidth || 0;
            const cw = document.documentElement.clientWidth || 0;
            const diff = Math.max(0, win - cw);
            return `${Math.round(diff / 2)}px`;
        };

        const get = (side) => {
            const raw = getComputedStyle(root).getPropertyValue(`--tg-safe-area-inset-${side}`)?.trim();
            if (raw) return raw;
            if (side === "left" || side === "right") return computeHInset();
            return "0px";
        };

        const updateInsets = () => {
            setInsets({
                top: get("top"),
                bottom: get("bottom"),
                left: get("left"),
                right: get("right"),
            });
        };

        updateInsets();

        window.addEventListener("resize", updateInsets);
        window.addEventListener("tg:insetsChanged", updateInsets);

        return () => {
            window.removeEventListener("resize", updateInsets);
            window.removeEventListener("tg:insetsChanged", updateInsets);
        };
    }, []);

    return insets;
};

export default useSafeAreaInsets;
