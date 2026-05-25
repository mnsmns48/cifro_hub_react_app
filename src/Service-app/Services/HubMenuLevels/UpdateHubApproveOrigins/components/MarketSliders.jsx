import { useEffect, useRef, useState } from "react";
import { Slider, Tooltip } from "antd";

export default function MarketSliders({
                                          scale,
                                          exponent,
                                          onScaleChange,
                                          onExponentChange
                                      }) {
    const [localScale, setLocalScale] = useState(scale);
    const [localExponent, setLocalExponent] = useState(exponent);

    const scaleTimer = useRef(null);
    const exponentTimer = useRef(null);

    // 🔥 ВСЕГДА синхронизируем локальный state с бэкендом
    useEffect(() => {
        setLocalScale(scale);
    }, [scale]);

    useEffect(() => {
        setLocalExponent(exponent);
    }, [exponent]);

    const handleScale = (value) => {
        setLocalScale(value);

        clearTimeout(scaleTimer.current);
        scaleTimer.current = setTimeout(() => {
            onScaleChange(value, true);
        }, 120); // 🔥 уменьшенный debounce
    };

    const handleExponent = (value) => {
        setLocalExponent(value);

        clearTimeout(exponentTimer.current);
        exponentTimer.current = setTimeout(() => {
            onExponentChange(value, true);
        }, 120); // 🔥 уменьшенный debounce
    };

    return (
        <div style={{ display: "flex", gap: 32 }}>
            <div style={{ width: 260 }}>
                <Tooltip title="Мягкость рынка">
                    <div style={{ fontSize: 12, marginBottom: 4 }}>
                        Scale: {localScale.toFixed(2)}
                    </div>
                </Tooltip>

                <Slider
                    min={0}
                    max={10}
                    step={0.1}
                    value={localScale}
                    onChange={handleScale}
                />
            </div>

            <div style={{ width: 260 }}>
                <Tooltip title="Степень влияния цены">
                    <div style={{ fontSize: 12, marginBottom: 4 }}>
                        Exponent: {localExponent.toFixed(2)}
                    </div>
                </Tooltip>

                <Slider
                    min={0}
                    max={3}
                    step={0.05}
                    value={localExponent}
                    onChange={handleExponent}
                />
            </div>
        </div>
    );
}
