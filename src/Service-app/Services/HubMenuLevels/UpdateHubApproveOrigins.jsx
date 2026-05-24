import {Modal, Button, Divider} from "antd";

import {useApproveOrigins} from "./UpdateHubApproveOrigins/useApproveOrigins";

import PathSelector from "./UpdateHubApproveOrigins/components/PathSelector";
import ModelSelector from "./UpdateHubApproveOrigins/components/ModelSelector";
import MarketSliders from "./UpdateHubApproveOrigins/components/MarketSliders";
import OriginsTable from "./UpdateHubApproveOrigins/components/OriginsTable";
import OriginsWithoutPics from "./UpdateHubApproveOrigins/components/OriginsWithoutPics";


import {findOrigin} from "./UpdateHubApproveOrigins/helpers";
import {useEffect, useState} from "react";
import OriginImageViewer from "../Common/OriginImageViewer.jsx";


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
        flatOriginsWithoutPics,

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
        commitToHubstock
    } = useApproveOrigins();

    const [opened, setOpened] = useState(true);
    const [openedOriginId, setOpenedOriginId] = useState(null);

    const openedOriginData = openedOriginId
        ? findOrigin(data, openedOriginId)
        : null;

    // -----------------------------
    // LOAD INITIAL DATA
    // -----------------------------
    useEffect(() => {
        if (opened && initialPayload) {
            void loadInitialData(initialPayload);
        }
    }, [opened, initialPayload]);

    // -----------------------------
    // CLOSE HANDLER
    // -----------------------------
    const closeAll = (result = false) => {
        setOpened(false);
        onCloseParent?.(result);
        onCloseApproveOrigins?.(result);
    };

    // -----------------------------
    // TABLE COLUMNS
    // -----------------------------
    const columns = [
        { title: "Цвет", dataIndex: "color", width: "15%" },
        { title: "ROM", dataIndex: "rom", width: "10%" },
        {
            title: "LTE",
            dataIndex: "is_LTE",
            width: "8%",
            render: v => (v ? "Да" : "Нет")
        },
        { title: "Цена", dataIndex: "output_price", width: "12%" },
        { title: "Фото", dataIndex: "pics", width: "12%" }
    ];

    // -----------------------------
    // COMMIT
    // -----------------------------
    const handleCommit = async () => {
        const res = await commitToHubstock();
        if (res.ok) {
            closeAll(true);
        }
    };

    // -----------------------------
    // RENDER
    // -----------------------------
    return (
        <Modal
            open={opened}
            onCancel={() => closeAll(false)}
            width={1200}
            footer={null}
            title="Обновление позиций HubStock"
        >
            {/* MARKET SLIDERS */}
            {selectedPath?.market && (
                <MarketSliders
                    scale={selectedPath.market.market_variance_scale}
                    exponent={selectedPath.market.market_variance_exponent}
                    onScaleChange={(value) =>
                        updateMarketParam({
                            path_id: selectedPathId,
                            scale: value
                        })
                    }
                    onExponentChange={(value) =>
                        updateMarketParam({
                            path_id: selectedPathId,
                            exponent: value
                        })
                    }
                />
            )}

            <Divider />

            <div style={{ display: "flex", gap: 16 }}>
                {/* LEFT: PATH SELECTOR */}
                <div style={{ width: 260 }}>
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

                {/* CENTER: MODEL SELECTOR */}
                <div style={{ width: 260 }}>
                    <ModelSelector
                        models={selectedPath?.models || []}
                        selectedModelId={selectedModelId}
                        onChange={setSelectedModelId}
                    />
                </div>

                {/* RIGHT: ORIGINS TABLE */}
                <div style={{ flex: 1 }}>
                    <OriginsTable
                        origins={selectedModel?.origins || []}
                        columns={columns}
                        selectedRowKeys={selectedRowKeys}
                        onSelectChange={setSelectedRowKeys}
                        onOpenImageModal={setOpenedOriginId}
                        loading={loading}
                    />
                </div>
            </div>

            <Divider />

            {/* BUTTONS */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button onClick={() => setShowWithoutPics(true)}>
                    Показать без картинок
                </Button>

                <Button
                    type="primary"
                    disabled={flatOriginsWithoutPics.length > 0}
                    onClick={handleCommit}
                >
                    Обновить HubStock
                </Button>
            </div>

            {/* MODAL: ORIGINS WITHOUT PICS */}
            <Modal
                open={showWithoutPics}
                onCancel={() => setShowWithoutPics(false)}
                footer={null}
                width={900}
                title="Позиции без фотографий"
            >
                <OriginsWithoutPics
                    items={flatOriginsWithoutPics}
                    columns={columns}
                    onOpenImageModal={setOpenedOriginId}
                    loading={loading}
                />
            </Modal>

            {/* IMAGE VIEWER */}
            {openedOriginData && (
                <OriginImageViewer
                    origin={openedOriginData.origin.origin}
                    images={openedOriginData.origin.pics}
                    title={openedOriginData.origin.title}
                    onClose={() => setOpenedOriginId(null)}
                    onUploaded={({ images }) => {
                        updateOriginPics(openedOriginData.origin.origin, images);
                    }}
                />
            )}
        </Modal>
    );
}
