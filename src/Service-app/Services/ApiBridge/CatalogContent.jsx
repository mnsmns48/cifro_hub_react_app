import {useEffect, useState} from "react";
import CategoriesTree from "./CategoriesTree.jsx";
import ProductsItems from "./ProductsItems.jsx";
import {Col, Row, Spin} from "antd";

const CatalogContent = ({vendorId, vendorFunction, contractorId, deliveryLocationId}) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [rowCount, setRowCount] = useState(0);
    const [progressId, setProgressId] = useState(null);
    const [progress, setProgress] = useState(null);

    // SSE подписка
    useEffect(() => {
        if (!progressId) return;

        console.log(">>> SSE CONNECT:", progressId);

        const evtSource = new EventSource(`/progress/${progressId}`);

        evtSource.onmessage = (event) => {
            console.log(">>> SSE RAW:", event.data);

            try {
                const data = JSON.parse(event.data);
                console.log(">>> SSE PARSED:", data);
                setProgress(data);
            } catch (e) {
                console.error(">>> SSE JSON ERROR:", e);
            }
        };

        return () => evtSource.close();
    }, [progressId]);

    return (
        <div style={{position: "relative"}}>

            {/* ПРОГРЕСС-БАР ВМЕСТО SPIN */}
            {progress && (
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(255,255,255,0.85)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10
                }}>
                    <div style={{
                        width: "60%",
                        height: 12,
                        background: "#eee",
                        borderRadius: 6,
                        overflow: "hidden",
                        marginBottom: 10
                    }}>
                        <div style={{
                            width: `${progress.percent}%`,
                            height: "100%",
                            background: "#1890ff",
                            transition: "width 0.3s ease"
                        }} />
                    </div>

                    <div style={{fontSize: 14, fontWeight: 500}}>
                        Загружаем товары: {progress.percent}%
                    </div>

                    <div style={{fontSize: 12, color: "#666"}}>
                        Страница {progress.page} из {progress.pages} •
                        Получено {progress.total_items} •
                        ETA: {progress.eta}s
                    </div>
                </div>
            )}

            <Row gutter={16} style={{marginTop: 20}}>
                <Col span={6}>
                    <CategoriesTree
                        vendorId={vendorId}
                        vendorFunction={vendorFunction}
                        onSelectCategory={setSelectedCategory}
                    />
                </Col>

                <Col span={18}>
                    количество {rowCount}
                    <ProductsItems
                        categoryId={selectedCategory}
                        vendorId={vendorId}
                        contractorId={contractorId}
                        deliveryLocationId={deliveryLocationId}
                        onProgressId={setProgressId}
                        setRowCount={setRowCount}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default CatalogContent;