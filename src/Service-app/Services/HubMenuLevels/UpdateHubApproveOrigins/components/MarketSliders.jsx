import {useEffect, useRef, useState} from "react";
import {Slider, Tooltip} from "antd";
import {exponentTooltip, scaleTooltip} from "./MarketTooltips.jsx";
import {QuestionCircleOutlined} from "@ant-design/icons";

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
        }, 120);
    };

    const handleExponent = (value) => {
        setLocalExponent(value);

        clearTimeout(exponentTimer.current);
        exponentTimer.current = setTimeout(() => {
            onExponentChange(value, true);
        }, 120);
    };

    return (
        <div style={{display: "flex", gap: 32}}>
            <div style={{width: 260}}>
                <div style={{display: "flex", alignItems: "center", gap: 6, marginBottom: 4}}>
                    <Tooltip title={scaleTooltip} placement="bottom">
                        <QuestionCircleOutlined style={{fontSize: 14, color: "green"}}/>
                    </Tooltip>

                    <div style={{fontSize: 12}}>
                        Коэффициент мягкости рынка (scale): {localScale.toFixed(2)}
                    </div>
                </div>

                <Slider
                    min={0}
                    max={10}
                    step={0.1}
                    value={localScale}
                    onChange={handleScale}
                />
            </div>

            <div style={{width: 260}}>
                <div style={{display: "flex", alignItems: "center", gap: 6, marginBottom: 4}}>
                    <Tooltip title={exponentTooltip} placement="bottom">
                        <QuestionCircleOutlined style={{fontSize: 14, color: "green"}}/>
                    </Tooltip>
                    <div style={{fontSize: 12, marginBottom: 4}}>
                        Степень влияния цены (exponent): {localExponent.toFixed(2)}
                    </div>
                </div>
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
