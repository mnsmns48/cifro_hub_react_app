import {useEffect, useState} from "react";
import CategoriesTree from "./CategoriesTree.jsx";
import ProductsItems from "./ProductsItems.jsx";
import ProgressOverlay from "./ProgressOverlay.jsx";
import {Col, Row} from "antd";
import {FieldTimeOutlined, OrderedListOutlined} from "@ant-design/icons";
import CategoryInfoPanel from "./CategoryInfoPanel.jsx";

const CatalogContent = ({vendorId, vendorFunction, contractorId, deliveryLocationId}) => {
    const [selectedNode, setSelectedNode] = useState(null);
    const [rowCount, setRowCount] = useState(0);
    const [execTime, setExecTime] = useState(0);
    const [progressId, setProgressId] = useState(null);
    const [progress, setProgress] = useState(null);
    const [alreadyExists, setAlreadyExists] = useState(null);


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
                        onAdded={(val) => setAlreadyExists(val)}
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
                    {rowCount > 0 && (<div style={{marginBottom: 8, fontSize: 16}}>
                        <OrderedListOutlined style={{color: "#1890ff", marginRight: 6}}/>
                        <strong>{rowCount}</strong>
                        <FieldTimeOutlined style={{color: "#fa8c16", marginLeft: 20, marginRight: 6}}/>
                        <strong>{execTime}</strong> сек
                    </div>)}

                    {selectedNode ? (
                        <ProductsItems
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
                        />
                    ) : null}

                </Col>
            </Row>
        </div>);
};

export default CatalogContent;
