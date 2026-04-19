import { useState, useEffect } from "react";
import ResolveModelTypeDependencies from "./ResolveModelTypeDependencies";

function ProductPopoverContent({ record }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div style={{ maxWidth: 900 }}>
            <div style={{ textAlign: "center", marginBottom: 10 }}>
                <div style={{ color: "blue" }}>{record.source}</div>
                <div style={{ fontWeight: 600 }}>{record.title}</div>
            </div>

            <div style={{ textAlign: "left", marginBottom: 15 }}>
                {mounted && (
                    <ResolveModelTypeDependencies
                        source={record.source}
                        info={record.info}
                        type={record.type}
                        brand={record.brand}
                    />
                )}
            </div>

            {record.available?.length ? (
                <div style={{ maxWidth: 900 }}>
                    {[...record.available]
                        .sort((a, b) => a.output_price - b.output_price)
                        .map((a, i) => (
                            <div key={i} style={{ marginBottom: 4 }}>
                                <span>{a.title}: </span>
                                <span style={{ color: "#7FFF00", fontWeight: 600 }}>
                                    {a.output_price.toLocaleString("ru-RU")} ₽
                                </span>
                            </div>
                        ))}
                </div>
            ) : (
                <div>Нет данных</div>
            )}
        </div>
    );
}


export default ProductPopoverContent;