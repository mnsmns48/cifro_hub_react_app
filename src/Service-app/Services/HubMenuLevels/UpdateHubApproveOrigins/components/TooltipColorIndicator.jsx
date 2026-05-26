import Color from "color";
import {Tag, Tooltip} from "antd";

const BASIC_COLORS = [
    "black", "white", "red", "blue", "green", "yellow", "orange", "pink",
    "purple", "violet", "brown", "beige", "gold", "silver", "gray", "grey",
    "teal", "cyan", "aqua", "navy", "azure", "turquoise", "indigo",
    "ultramarine", "cobalt", "sapphire", "royal", "prussian", "denim",
    "peach", "coral", "rose", "salmon", "apricot",
    "olive", "sand", "tan", "khaki", "mocha", "coffee", "bronze",
    "mint", "lavender", "lilac", "cream",
    "chrome", "graphite", "titanium", "platinum", "copper",
    "emerald", "jade", "forest", "sky", "ocean",
    "midnight", "charcoal", "obsidian",
    "ivory", "pearl", "snow"
];


const WHITE_KEYWORDS = ["white", "starlight", "cloud", "polar", "moonlight", "frosted",
    "arctic", "snow", "pearl"];

const BLACK_KEYWORDS = [
    "black", "midnight", "obsidian", "onyx", "carbon", "graphite", "dark"
];

const tagColorForAttr = (value) => {
    if (!value) {
        return {background: "#8f8f8f", color: "#fff", isBlack: false};
    }

    const lower = value.toLowerCase();

    if (WHITE_KEYWORDS.some(w => lower.includes(w))) {
        return {
            background: "#000",
            color: "#000000",
            isBlack: true
        };
    }

    if (BLACK_KEYWORDS.some(w => lower.includes(w))) {
        return {
            background: "#000000",
            color: "#ffffff",
            isBlack: false,
            border: "none"
        };
    }

    let hex = null;

    try {
        hex = Color(value).hex();
    } catch {
        /* ignore */
    }

    if (!hex) {
        for (const base of BASIC_COLORS) {
            if (lower.includes(base)) {
                try {
                    hex = Color(base).hex();
                    break;
                } catch {
                    /* ignore */
                }
            }
        }
    }

    if (!hex) {
        return {
            background: "#5c334a",
            color: "#fff",
            isBlack: false
        };
    }

    const bg = Color(hex);
    const isLight = bg.isLight();

    return {
        background: hex,
        color: isLight ? "#000" : "#fff",
        isBlack: false
    };
};

export const TooltipColorIndicator = (value) => {
    return tagColorForAttr(value);
};
