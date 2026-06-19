import {useEffect, useState} from "react";
import CategoriesTree from "./CategoriesTree.jsx";
import ProductsItems from "./ProductsItems.jsx";
import ProgressOverlay from "./ProgressOverlay.jsx";
import {Col, Row} from "antd";
import {FieldTimeOutlined, OrderedListOutlined} from "@ant-design/icons";

const CatalogContent = ({vendorId, vendorFunction, contractorId, deliveryLocationId}) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [rowCount, setRowCount] = useState(0);
    const [execTime, setExecTime] = useState(0);
    const [progressId, setProgressId] = useState(null);
    const [progress, setProgress] = useState(null);
    // const [productsReady, setProductsReady] = useState(false);

    useEffect(() => {
        if (!progressId) return;

        const evtSource = new EventSource(`/progress/${progressId}`);

        evtSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setProgress(data);
            } catch {
            }
        };

        return () => evtSource.close();
    }, [progressId]);

    return (
        <div style={{position: "relative"}}>

            <ProgressOverlay progress={progress}/>

            <Row gutter={16} style={{marginTop: 20}}>
                <Col span={6}>
                    <CategoriesTree
                        vendorId={vendorId}
                        vendorFunction={vendorFunction}

                        onSelectCategory={(catId) => {
                            setSelectedCategory(catId);
                        }}

                        onStartLoading={() => {
                            setProgress({
                                percent: 0,
                                page: 0,
                                pages: 0,
                                total_items: 0,
                                eta: 0
                            });
                        }}
                    />


                </Col>

                <Col span={18}>
                    {rowCount > 0 && (
                        <div style={{marginBottom: 8, fontSize: 16}}>
                            <OrderedListOutlined style={{color: "#1890ff", marginRight: 6}}/>
                            <strong>{rowCount}</strong> шт

                            <FieldTimeOutlined style={{color: "#fa8c16", marginLeft: 20, marginRight: 6}}/>
                            <strong>{execTime}</strong> сек
                        </div>

                    )}

                    {selectedCategory && (
                        <ProductsItems
                            categoryId={selectedCategory}
                            vendorId={vendorId}
                            contractorId={contractorId}
                            deliveryLocationId={deliveryLocationId}
                            onProgressId={setProgressId}
                            onProgressDone={() => {
                                setProgress(null);
                                setProgressId(null);
                            }}
                            setRowCount={setRowCount}
                            setExecTime={setExecTime}
                        />
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default CatalogContent;
