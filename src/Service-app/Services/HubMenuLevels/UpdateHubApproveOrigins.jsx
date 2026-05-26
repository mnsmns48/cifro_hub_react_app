import {Modal, Button, Popconfirm, Col, Row} from "antd";

import {useApproveOrigins} from "./UpdateHubApproveOrigins/useApproveOrigins";

import PathSelector from "./UpdateHubApproveOrigins/components/PathSelector";
import ModelSelector from "./UpdateHubApproveOrigins/components/ModelSelector";
import MarketSliders from "./UpdateHubApproveOrigins/components/MarketSliders";
import OriginsTable from "./UpdateHubApproveOrigins/components/OriginsTable";
import OriginsWithoutPics from "./UpdateHubApproveOrigins/components/OriginsWithoutPics";


import {findOrigin} from "./UpdateHubApproveOrigins/helpers";
import {useEffect, useState} from "react";
import OriginImageViewer from "../Common/OriginImageViewer.jsx";
import {buildApproveOriginsColumns} from "./UpdateHubApproveOrigins/components/ColumnsBuilder.jsx";
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";
import {PriceSyncFlow} from "./PriceSyncFlow.jsx";
import {CloseOutlined, CloudUploadOutlined, FileExcelOutlined} from "@ant-design/icons";
import "./Css/UpdateHubApproveOrigins.css"
import {getAllOriginsWithoutPics} from "./UpdateHubApproveOrigins/selectors.js";


export default function UpdateHubApproveOrigins({
                                                    initialPayload,
                                                    onCloseParent,
                                                    onCloseApproveOrigins
                                                }) {
    const {
        loading,
        data,

        selectedPath,
        selectedModel,

        selectedPathId,
        setSelectedPathId,

        selectedModelId,
        setSelectedModelId,

        selectedRowKeys,
        setSelectedRowKeys,

        showWithoutPics,
        setShowWithoutPics,

        loadInitialData,

        updateMarketParam,
        updateOriginPics,
        commitToHubstock,

        updateVerdictForCurrentPath

    } = useApproveOrigins();

    const [opened, setOpened] = useState(true);
    const [openedOriginId, setOpenedOriginId] = useState(null);


    const openedOriginData = openedOriginId
        ? findOrigin(data, openedOriginId)
        : null;

    useEffect(() => {
        if (!selectedPathId || !data.length) return;

        const path = data.find(p => p.path_id === selectedPathId);
        if (!path) return;

        const newVerdictKeys = path.models
            .flatMap(m => m.origins)
            .filter(o => o.analyze?.verdict)
            .map(o => o.origin);

        setSelectedRowKeys(newVerdictKeys);

    }, [data, selectedPathId]);


    useEffect(() => {
        if (opened && initialPayload) {
            void loadInitialData(initialPayload);
        }
    }, [opened, initialPayload]);


    const closeAll = (result = false) => {
        setOpened(false);
        onCloseParent?.(result);
        onCloseApproveOrigins?.(result);
    };

    const columns = buildApproveOriginsColumns({
        setOpenedOriginId,
        selectedModel
    });


    const handleCommit = async () => {
        const res = await commitToHubstock();
        if (res.ok) {
            closeAll(true);
        }
    };

    const disableExport = data.some(path =>
        path.models.some(model =>
            model.origins.some(o =>
                o.analyze?.verdict && (!o.pics || o.pics.length === 0)
            )
        )
    );


    return (
        <Modal open={opened} width={1450} footer={null} closable={false}>
            {loading ?
                <Spinner/> :
                (
                    <div style={{padding: 16}}>
                        <PriceSyncFlow step={4}/>
                        <div style={{
                            marginBottom: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <div style={{display: "flex", alignItems: "center", gap: 12}}>
                                <Button icon={<CloseOutlined/>} type="primary" onClick={onCloseApproveOrigins}>
                                    Закрыть
                                </Button>
                                <Button icon={<FileExcelOutlined/>}
                                        type={showWithoutPics ? "primary" : "default"}
                                        onClick={() => setShowWithoutPics(true)}>
                                    {showWithoutPics ? "Показать все" : "Показать без картинок"}
                                </Button>
                                <Popconfirm title="Выгрузить выбранные позиции?"
                                            description="Будут выгружены только выделенные позиции. Продолжить?"
                                            okText="Да"
                                            cancelText="Нет"
                                            onConfirm={handleCommit}>
                                    <Button color="purple"
                                            variant="solid"
                                            icon={<CloudUploadOutlined/>}
                                            disabled={disableExport}
                                    >
                                        Выгрузить в хаб
                                    </Button>
                                </Popconfirm>

                            </div>
                            {selectedPath?.market && (
                                <div style={{
                                    display: "flex",
                                    gap: 32,
                                    alignItems: "center",
                                    flexGrow: 1,
                                    justifyContent: "center"
                                }}>
                                    <MarketSliders
                                        scale={selectedPath.market.market_variance_scale}
                                        exponent={selectedPath.market.market_variance_exponent}
                                        onScaleChange={(value, final) => {
                                            if (final) {
                                                void updateMarketParam({path_id: selectedPathId, scale: value});
                                            }
                                        }}
                                        onExponentChange={(value, final) => {
                                            if (final) {
                                                void updateMarketParam({path_id: selectedPathId, exponent: value});
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <Row gutter={16} wrap>
                            <Col xs={24} sm={24} md={8} lg={6} xl={6} xxl={6}>
                                <div style={{display: "flex", gap: 16}}>
                                    <div style={{width: 300}}>
                                        <PathSelector
                                            paths={data}
                                            selectedPathId={selectedPathId}
                                            onChange={(val) => {
                                                setSelectedPathId(val);
                                                const backendPath = data.find(p => p.path_id === val);
                                                if (backendPath && backendPath.models.length > 0) {
                                                    setSelectedModelId(backendPath.models[0].id);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </Col>

                            <Col xs={24} sm={24} md={16} lg={18} xl={18} xxl={18}>
                                <div style={{width: 260}}>
                                    <ModelSelector
                                        models={selectedPath?.models || []}
                                        selectedModelId={selectedModelId}
                                        onChange={setSelectedModelId}
                                    />
                                </div>
                                <div style={{flex: 1}}>
                                    <OriginsTable
                                        origins={selectedModel?.origins || []}
                                        columns={columns}
                                        selectedRowKeys={selectedRowKeys}
                                        onSelectChange={(keys) => {
                                            setSelectedRowKeys(keys);
                                            updateVerdictForCurrentPath(keys);
                                        }}
                                        onOpenImageModal={setOpenedOriginId}
                                        loading={loading}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Modal open={showWithoutPics}
                               onCancel={() => setShowWithoutPics(false)}
                               footer={null}
                               width={1450}
                               title="Позиции без фотографий">
                            <OriginsWithoutPics
                                items={getAllOriginsWithoutPics(data)}
                                columns={columns}
                                onOpenImageModal={setOpenedOriginId}
                                loading={loading}
                            />
                        </Modal>

                        {openedOriginData && (
                            <OriginImageViewer
                                origin={openedOriginData.origin.origin}
                                images={openedOriginData.origin.pics}
                                title={openedOriginData.origin.title}
                                onClose={() => setOpenedOriginId(null)}
                                onUploaded={({images}) => {
                                    updateOriginPics(openedOriginData.origin.origin, images);
                                }}
                            />
                        )}
                    </div>
                )}
        </Modal>
    );
}
