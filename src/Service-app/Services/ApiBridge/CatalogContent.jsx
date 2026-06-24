import {useEffect, useRef, useState} from "react";
import CategoriesTree from "./CategoriesTree.jsx";
import ProductsItems from "./ProductsItems.jsx";
import ProgressOverlay from "./ProgressOverlay.jsx";
import {Button, Col, message, Row} from "antd";
import {FieldTimeOutlined, OrderedListOutlined} from "@ant-design/icons";
import CategoryInfoPanel from "./CategoryInfoPanel.jsx";
import {fetchPostData} from "../Common/api.js";

const CatalogContent = ({vendorId, vendorFunction, contractorId, deliveryLocationId}) => {
    const [selectedNode, setSelectedNode] = useState(null);
    const [rowCount, setRowCount] = useState(0);
    const [execTime, setExecTime] = useState(0);
    const [progressId, setProgressId] = useState(null);
    const [progress, setProgress] = useState(null);
    const [alreadyExists, setAlreadyExists] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);


    const productsItemsRef = useRef(null);

    useEffect(() => {
        if (!progressId) return;

        const evtSource = new EventSource(`/progress/${progressId}`);

        evtSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setProgress(data);
            } catch (e) {
                console.error(e);
            }
        };

        return () => evtSource.close();
    }, [progressId]);


    const handleAddBrands = async () => {
        if (!selectedProducts?.length) return;
        const brands_bulk = selectedProducts.map(p => p.brand).filter(Boolean);
        if (brands_bulk.length === 0) return;
        try {
            const added = await fetchPostData(
                "/service/product/update_brands",
                {brands: brands_bulk}
            );
            setSelectedProducts([]);
            if (added?.length > 0) {
                message.success(`Добавлены бренды: ${added.join(", ")}`);
            } else {
                message.info("Все бренды уже существуют");
            }
        } catch (e) {
            console.error("Ошибка добавления брендов:", e);
        }
    };


    const handleSaveParsingLines = (linkedVSL) => {
        void productsItemsRef.current?.saveParsingLines(linkedVSL);
    };


    return (
        <div style={{position: "relative"}}>
            <ProgressOverlay progress={progress}/>
            <Row gutter={16}>
                <Col span={8}>
                    <CategoryInfoPanel
                        nodeKey={selectedNode?.key}
                        title={selectedNode?.title}
                        idPath={selectedNode?.idPath}
                        alreadyExists={alreadyExists}
                        vendorId={vendorId}
                        onAdded={(data) => {
                            setAlreadyExists(data);
                        }}
                        onSaveParsingLines={handleSaveParsingLines}
                    />
                    <div>
                        <CategoriesTree vendorId={vendorId}
                                        vendorFunction={vendorFunction}
                                        onSelectCategory={(node) => setSelectedNode(node)}
                                        onStartLoading={() => {
                                            setProgress({percent: 0, page: 0, pages: 0, total_items: 0, eta: 0});
                                        }}/>
                    </div>

                </Col>
                <Col span={16}>
                    {rowCount > 0 && (
                        <div style={{marginBottom: 8, fontSize: 16}}>
                            <OrderedListOutlined style={{color: "#1890ff", marginRight: 6}}/>
                            <strong>{rowCount}</strong>
                            <FieldTimeOutlined style={{color: "#fa8c16", marginLeft: 20, marginRight: 6}}/>
                            <strong>{execTime}</strong> сек
                            {selectedProducts?.length > 0 && (
                                <Button style={{marginLeft: 6}} type="primary" onClick={handleAddBrands}>
                                    Добавить бренды
                                </Button>
                            )}

                        </div>
                    )}

                    {selectedNode ? (
                        <ProductsItems
                            ref={productsItemsRef}
                            categoryId={selectedNode.categoryId}
                            idPath={selectedNode.idPath}
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
                            setAlreadyExists={setAlreadyExists}
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
                        />
                    ) : null}
                </Col>
            </Row>
        </div>);
};

export default CatalogContent;
