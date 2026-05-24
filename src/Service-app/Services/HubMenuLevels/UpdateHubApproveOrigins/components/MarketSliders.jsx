import { Slider, Tooltip } from "antd";

export default function MarketSliders({
                                          scale,
                                          exponent,
                                          onScaleChange,
                                          onExponentChange,
                                          scaleTooltip = "Мягкость рынка: влияет на диапазон цен",
                                          exponentTooltip = "Степень влияния цены: влияет на чувствительность"
                                      }) {
    return (
        <div
            style={{
                display: "flex",
                gap: 32,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16
            }}
        >
            {/* SCALE */}
            <div style={{ width: 260 }}>
                <Tooltip title={scaleTooltip} placement="bottom">
                    <div style={{ fontSize: 12, marginBottom: 4 }}>
                        Мягкость рынка (scale): {scale?.toFixed(2)}
                    </div>
                </Tooltip>

                <Slider
                    min={0}
                    max={10}
                    step={0.1}
                    value={scale}
                    onChange={onScaleChange}
                />
            </div>

            {/* EXPONENT */}
            <div style={{ width: 260 }}>
                <Tooltip title={exponentTooltip} placement="bottom">
                    <div style={{ fontSize: 12, marginBottom: 4 }}>
                        Степень влияния цены (exponent): {exponent?.toFixed(2)}
                    </div>
                </Tooltip>

                <Slider
                    min={0}
                    max={3}
                    step={0.05}
                    value={exponent}
                    onChange={onExponentChange}
                />
            </div>
        </div>
    );
}
