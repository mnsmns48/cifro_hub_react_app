import {useEffect, useMemo, useRef, useState} from "react";
import {Button, Modal, Slider, Tooltip, message, Popconfirm} from "antd";
import {CloseOutlined, CloudUploadOutlined, FileExcelOutlined} from "@ant-design/icons";
import {fetchPostData} from "../Common/api.js";
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";
import "./Css/UpdateHubApproveOrigins.css"
import OriginImageViewer from "../Common/OriginImageViewer.jsx";
import {buildApproveOriginsColumns} from "./UpdateHubApproveOriginsColumns.jsx";
import {PriceSyncFlow} from "./PriceSyncFlow.jsx";
import {exponentTooltip, scaleTooltip} from "./UpdateHubApproveOrigins/TooltipHelper.jsx";
import {
    buildHubStockPayload,
    computeSelectedRowKeys,
    getOriginById,
    getOriginsWithoutPics,
    getSelectedModel,
    getSelectedPath
} from "./UpdateHubApproveOrigins/utils.js";
import ApproveWithoutPicsView from "./UpdateHubApproveOrigins/ApproveWithoutPicsView.jsx";
import ApproveMainTableView from "./UpdateHubApproveOrigins/ApproveMainTableView.jsx";


const UpdateHubApproveOrigins = ({objForUpdate, onCloseParent, onCloseApproveOrigins}) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [selectedPathId, setSelectedPathId] = useState(null);
    const [selectedModelId, setSelectedModelId] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [showWithoutPics, setShowWithoutPics] = useState(false);
    const [openedOriginId, setOpenedOriginId] = useState(null);

    const debounceRef = useRef(null);

    const paths = useMemo(() => {
        return objForUpdate.sortOrderPathId.map(id => objForUpdate[id]);

    }, [objForUpdate]);


    const selectedPath = useMemo(() => {
        return getSelectedPath(data, selectedPathId);
    }, [data, selectedPathId]);


    const selectedModel = useMemo(() => {
        return getSelectedModel(selectedPath, selectedModelId);
    }, [selectedPath, selectedModelId]);


    const openedOriginData = useMemo(() => {
        if (!openedOriginId) {
            return null;
        }
        return getOriginById(data, openedOriginId);
    }, [data, openedOriginId]);


    const flatOriginsWithoutPics = useMemo(() => {
        if (!showWithoutPics) {
            return [];
        }
        return getOriginsWithoutPics({data, selectedRowKeys});
    }, [showWithoutPics, data, selectedRowKeys]);

    const hasSelectedWithoutPics = useMemo(() => {
        return flatOriginsWithoutPics.length > 0;
    }, [flatOriginsWithoutPics]);


    useEffect(() => {
        void (async () => {
            try {
                setLoading(true);
                const res = await fetchPostData("/service/approve_origins_for_update", paths);
                if (Array.isArray(res)) {
                    setData(res);
                    setSelectedRowKeys(computeSelectedRowKeys(res));
                }
            } catch (e) {
                console.error("approveOriginsRequest error:", e);
            } finally {
                setLoading(false);
            }
        })();
    }, [paths]);

    useEffect(() => {
        if (loading || data.length === 0) {
            return;
        }
        setSelectedPathId(prev => {
            const exists = data.some(p => p.path_id === prev);
            return exists ? prev : data[0].path_id;
        });
    }, [loading, data]);


    useEffect(() => {
        if (!selectedPath) {
            return;
        }
        setSelectedModelId(prev => {
            const exists = selectedPath.models.some(m => m.id === prev);
            return exists ? prev : selectedPath.models?.[0]?.id ?? null;
        });
    }, [selectedPath]);


    const debounceUpdate = (callback, delay = 400) => {

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(callback, delay);
    };

    const patchPathMarket = (updatedPath) => {
        setData(prev => {
            return prev.map(path => {
                if (path.path_id !== updatedPath.path_id) {
                    return path;
                }
                return {
                    ...path, market: updatedPath.market, models: updatedPath.models
                };
            });
        });
    };


    const patchOriginImages = ({originId, images}) => {
        setData(prev => {
            return prev.map(path => {
                return {
                    ...path, models: path.models.map(model => {
                        return {
                            ...model, origins: model.origins.map(origin => {
                                if (origin.origin !== originId) {
                                    return origin;
                                }
                                return {
                                    ...origin, pics: images
                                };
                            })
                        };
                    })
                };
            });
        });
    };


    const updateMarketParam = (path_id, scale, exponent) => {
        debounceUpdate(async () => {
            try {
                const res = await fetchPostData("/service/update_market_param", {
                    path_id, route: selectedPath.route, models: selectedPath.models, ...(scale !== null ? {
                        market_variance_scale: scale
                    } : {}), ...(exponent !== null ? {
                        market_variance_exponent: exponent
                    } : {})
                });
                if (Array.isArray(res) && res.length > 0) {
                    patchPathMarket(res[0]);
                }
            } catch (e) {
                console.error("update_market_param error:", e);
            }
        });
    };


    const updateOriginsInHubstock = async () => {
        try {
            const payload = buildHubStockPayload({data, selectedRowKeys});
            if (payload.length === 0) {
                message.warning("Нет выбранных origins");
                return;
            }
            const res = await fetchPostData("/service/update_origins_in_hubstock", payload);
            if (res !== false) {
                message.success("HubStock обновлён");
                onCloseParent(true);
            } else {
                message.error("Ошибка при обновлении HubStock");
            }
        } catch (e) {
            message.error("Ошибка при обновлении HubStock", e);
        }
    };


    const columns = buildApproveOriginsColumns({
        selectedModel, setOpenedImageModalView: (originData) => {
            setOpenedOriginId(originData.origin);
        }
    });


    return (<>
        <Modal open
               closable={false}
               footer={null}
               width={1450}
               onCancel={onCloseApproveOrigins}
        >

            {loading ? (<Spinner/>) : (<div style={{padding: 16}}>
                <PriceSyncFlow step={4}/>
                <div
                    style={{
                        marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between"
                    }}
                >
                    <div
                        style={{
                            display: "flex", alignItems: "center", gap: 12
                        }}
                    >
                        <Button icon={<CloseOutlined/>}
                                type="primary"
                                onClick={onCloseApproveOrigins}
                        >
                            Закрыть
                        </Button>
                        <Button icon={<FileExcelOutlined/>}
                                type={showWithoutPics ? "primary" : "default"}
                                onClick={() => {
                                    setShowWithoutPics(prev => !prev);
                                }}
                        >
                            {showWithoutPics ? "Показать все" : "Показать без картинок"}
                        </Button>

                        <Popconfirm
                            title="Выгрузить выбранные позиции?"
                            description="Будут выгружены только выделенные позиции. Продолжить?"
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={updateOriginsInHubstock}
                            disabled={hasSelectedWithoutPics}
                        >
                            <Button
                                color="purple"
                                variant="solid"
                                icon={<CloudUploadOutlined/>}
                                disabled={hasSelectedWithoutPics}
                            >
                                Выгрузить в хаб
                            </Button>
                        </Popconfirm>
                    </div>

                    {selectedPath?.market && (
                        <div
                            style={{
                                display: "flex",
                                gap: 32,
                                alignItems: "center",
                                flexGrow: 1,
                                justifyContent: "center"
                            }}
                        >
                            <div style={{width: 260}}>
                                <Tooltip title={scaleTooltip}
                                         placement="bottom"
                                >
                                    <div style={{fontSize: 12, marginBottom: 4}}>
                                        Мягкость рынка (scale):
                                        {(selectedPath.market?.market_variance_scale ?? 0).toFixed(2)}
                                    </div>
                                </Tooltip>

                                <Slider min={0}
                                        max={10}
                                        step={0.1}
                                        value={selectedPath.market?.market_variance_scale ?? 0}
                                        onChange={(value) => {
                                            updateMarketParam(selectedPath.path_id, value, null);
                                        }}
                                />
                            </div>
                            <div style={{width: 260}}>
                                <Tooltip title={exponentTooltip}
                                         placement="bottom">
                                    <div style={{fontSize: 12, marginBottom: 4}}>
                                        Степень влияния цены (exponent):
                                        {(selectedPath.market?.market_variance_exponent ?? 0).toFixed(2)}
                                    </div>
                                </Tooltip>

                                <Slider min={0}
                                        max={3}
                                        step={0.05}
                                        value={selectedPath.market?.market_variance_exponent ?? 0}
                                        onChange={(value) => {
                                            updateMarketParam(selectedPath.path_id, null, value);
                                        }}
                                />
                            </div>
                        </div>)}
                    <div style={{width: 80}}/>
                </div>
                {showWithoutPics ? (<ApproveWithoutPicsView
                    dataSource={flatOriginsWithoutPics}
                    columns={columns}
                    selectedRowKeys={selectedRowKeys}
                />) : (<ApproveMainTableView data={data}
                                             paths={paths}
                                             selectedPath={selectedPath}
                                             selectedModel={selectedModel}
                                             selectedPathId={selectedPathId}
                                             selectedModelId={selectedModelId}
                                             setSelectedPathId={setSelectedPathId}
                                             setSelectedModelId={setSelectedModelId}
                                             selectedRowKeys={selectedRowKeys}
                                             setSelectedRowKeys={setSelectedRowKeys}
                                             columns={columns}
                />)}
            </div>)}
        </Modal>

        {openedOriginData?.origin && (<OriginImageViewer
            origin={openedOriginData.origin.origin}
            images={openedOriginData.origin.pics}
            title={openedOriginData.origin.title}
            onClose={() => {
                setOpenedOriginId(null);
            }}
            onUploaded={({images}) => {
                patchOriginImages({
                    originId: openedOriginData.origin.origin, images
                });
            }}
        />)}
    </>);
};

export default UpdateHubApproveOrigins;