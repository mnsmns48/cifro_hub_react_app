import {useEffect, useMemo, useRef, useState} from "react";
import {Segmented, Table, Button, Modal, Col, Row, Slider, Tooltip, message, Popconfirm} from "antd";
import {CloseOutlined, CloudUploadOutlined, FileExcelOutlined} from "@ant-design/icons";
import {fetchPostData} from "../Common/api.js";
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";
import "./Css/UpdateHubApproveOrigins.css"
import OriginImageViewer from "../Common/OriginImageViewer.jsx";
import {buildApproveOriginsColumns} from "./UpdateHubApproveOriginsColumns.jsx";
import {PriceSyncFlow} from "./PriceSyncFlow.jsx";

const TooltipCard = ({title, color, blocks, examples}) => (
    <div style={{
        maxWidth: 480,
        lineHeight: "1.55em",
        fontSize: 11,
        background: "#000",
        padding: 4
    }}>
        <div style={{
            fontWeight: 700,
            marginBottom: 10,
            color,
            fontSize: 14
        }}>
            {title}
        </div>

        {blocks.map((block, i) => (
            <div key={i} style={{
                padding: "10px 12px",
                border: `1px solid ${block.border}`,
                borderRadius: 6,
                marginBottom: 14
            }}>
                <div style={{
                    fontWeight: 600,
                    marginBottom: 6,
                    color: block.color
                }}>
                    {block.header}
                </div>

                <div dangerouslySetInnerHTML={{__html: block.content}}/>
            </div>
        ))}

        <div style={{
            padding: "10px 12px",
            border: "1px solid #adc6ff",
            borderRadius: 6
        }}>
            <div style={{
                fontWeight: 600,
                marginBottom: 6,
                color: "#2f54eb"
            }}>
                Пример поведения
            </div>

            <ul style={{margin: "0 0 0 18px"}}>
                {examples.map((ex, i) => (
                    <li key={i} dangerouslySetInnerHTML={{__html: ex}}/>
                ))}
            </ul>
        </div>
    </div>
);

const scaleTooltip = (
    <TooltipCard
        title="Коэффициент мягкости рынка (scale)"
        color="#1677ff"
        blocks={[
            {
                header: "Почему это важно",
                color: "#1677ff",
                border: "#91caff",
                content: `
                    На реальном рынке разброс цен зависит от категории:
                    <ul style="margin: 6px 0 0 18px">
                        <li>в дешёвых товарах цены обычно плотные</li>
                        <li>в дорогих категориях разброс может быть огромным</li>
                    </ul>
                    Scale позволяет analyzer учитывать это поведение.
                `
            },
            {
                header: "Если УМЕНЬШАТЬ значение",
                color: "#cf1322",
                border: "#ffa39e",
                content: `
                    Рынок становится «жёстким»:
                    <ul style="margin: 6px 0 0 18px">
                        <li>tolerance уменьшается</li>
                        <li>даже небольшой разброс цен считается подозрительным</li>
                        <li>больше товаров попадают в зону риска</li>
                    </ul>
                    Подходит для:
                    <ul style="margin: 6px 0 0 18px">
                        <li>категорий с низкой ценой</li>
                        <li>товаров с фиксированной наценкой</li>
                        <li>рынков с плотной конкуренцией</li>
                    </ul>
                `
            },
            {
                header: "Если УВЕЛИЧИВАТЬ значение",
                color: "#389e0d",
                border: "#b7eb8f",
                content: `
                    Рынок становится «мягким»:
                    <ul style="margin: 6px 0 0 18px">
                        <li>tolerance растёт</li>
                        <li>допускается больший разброс цен</li>
                        <li>меньше товаров помечаются как дорогие</li>
                    </ul>
                    Подходит для:
                    <ul style="margin: 6px 0 0 18px">
                        <li>премиальных категорий</li>
                        <li>дорогой электроники</li>
                        <li>товаров с высокой волатильностью цен</li>
                    </ul>
                `
            }
        ]}
        examples={[
            "<b>scale = 2</b> — рынок жёсткий, разброс минимален",
            "<b>scale = 5</b> — сбалансированное поведение",
            "<b>scale = 10</b> — рынок мягкий, допускается большой разброс цен"
        ]}
    />
);
const exponentTooltip = (
    <TooltipCard
        title="Степень влияния цены (exponent)"
        color="#1677ff"
        blocks={[
            {
                header: "Почему это важно",
                color: "#1677ff",
                border: "#d3adf7",
                content: `
                    Переплата <b>+3000 ₽</b>:
                    <ul style="margin: 6px 0 0 18px">
                        <li>для телефона за <b>15 000 ₽</b> — огромная разница</li>
                        <li>для флагмана за <b>180 000 ₽</b> — почти незаметно</li>
                    </ul>
                    Exponent нужен, чтобы analyzer понимал эту разницу.
                `
            },
            {
                header: "Если УМЕНЬШАТЬ значение",
                color: "#cf1322",
                border: "#ffa39e",
                content: `
                    Analyzer начинает относиться к дешёвым и дорогим товарам одинаково.
                    <ul style="margin: 6px 0 0 18px">
                        <li>15 000 ₽ → +3000 ₽ → <b>suspicious</b></li>
                        <li>180 000 ₽ → +3000 ₽ → <b>тоже suspicious</b></li>
                    </ul>
                    Подходит для:
                    <ul style="margin: 6px 0 0 18px">
                        <li>жёсткой логики</li>
                        <li>фиксированной наценки</li>
                        <li>дешёвых категорий</li>
                    </ul>
                `
            },
            {
                header: "Если УВЕЛИЧИВАТЬ значение",
                color: "#389e0d",
                border: "#b7eb8f",
                content: `
                    Analyzer становится мягче к дорогим товарам.
                    <ul style="margin: 6px 0 0 18px">
                        <li>15 000 ₽ → +3000 ₽ → <b>verdict=False</b></li>
                        <li>180 000 ₽ → +3000 ₽ → <b>verdict=True</b></li>
                    </ul>
                    Подходит для:
                    <ul style="margin: 6px 0 0 18px">
                        <li>premium сегмента</li>
                        <li>Apple / Samsung Ultra</li>
                        <li>видеокарт</li>
                        <li>дорогой электроники</li>
                    </ul>
                `
            }
        ]}
        examples={[
            "<b>exponent = 0.3</b> — почти одинаковая логика для всех цен",
            "<b>exponent = 1.1</b> — сбалансированный режим",
            "<b>exponent = 2.0</b> — дорогим товарам разрешается большой разброс цен"
        ]}
    />
);


const getSelectedPath = (data, pathId) => {
    return data.find(p => p.path_id === pathId) || null;
};


const getSelectedModel = (path, modelId) => {
    return path?.models.find(m => m.id === modelId) || null;
};


const getOriginById = (data, originId) => {
    for (const path of data) {
        for (const model of path.models) {

            const origin = model.origins.find(
                o => o.origin === originId
            );

            if (origin) {
                return {
                    origin,
                    model,
                    path
                };
            }
        }
    }

    return null;
};


const computeSelectedRowKeys = (data) => {
    const keys = [];

    data.forEach(path => {
        path.models.forEach(model => {
            model.origins.forEach(origin => {

                if (origin.analyze?.verdict === true) {
                    keys.push(origin.origin);
                }

            });
        });
    });

    return keys;
};


const getOriginsWithoutPics = ({
                                   data,
                                   selectedRowKeys
                               }) => {

    const result = [];

    data.forEach(path => {
        path.models.forEach(model => {
            model.origins.forEach(origin => {

                const noPics =
                    !origin.pics
                    || origin.pics.length === 0;

                const selected =
                    selectedRowKeys.includes(origin.origin);

                if (selected && noPics) {

                    result.push({
                        ...origin,
                        path_id: path.path_id,
                        model_id: model.id,
                        model_title: model.title,
                        route: path.route
                    });

                }

            });
        });
    });

    return result;
};


const buildHubStockPayload = ({
                                  data,
                                  selectedRowKeys
                              }) => {

    const items = [];

    data.forEach(path => {

        path.models.forEach(model => {

            model.origins
                .filter(o => {
                    return selectedRowKeys.includes(o.origin);
                })
                .forEach(origin => {

                    items.push({
                        path_id: path.path_id,
                        hub_item: {
                            origin: origin.origin,
                            vsl_id: origin.vsl_id,
                            title: origin.title,
                            warranty: origin.warranty,
                            input_price: origin.input_price,
                            output_price: origin.output_price,
                            dt_parsed: origin.dt_parsed,
                            model_title: model.title,
                            profit_range: origin.profit_range
                        }
                    });

                });

        });

    });

    return items;
};


/* =========================================
   SHARED TABLE POLICIES
========================================= */

export const getOriginRowClassName = (
    record,
    selectedRowKeys
) => {

    const isSelected =
        selectedRowKeys.includes(record.origin);

    const hasPics =
        Array.isArray(record.pics)
        && record.pics.length > 0;

    if (isSelected && !hasPics) {
        return "row-selected-no-pics";
    }

    if (isSelected) {
        return "row-selected";
    }

    return "";
};


export const buildInteractiveRowSelection = ({
                                                 selectedRowKeys,
                                                 setSelectedRowKeys
                                             }) => {

    return {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
        preserveSelectedRowKeys: true,
        columnWidth: "2%"
    };
};


export const buildReadonlyRowSelection = ({
                                              selectedRowKeys
                                          }) => {

    return {
        selectedRowKeys,
        preserveSelectedRowKeys: true,
        columnWidth: "2%",
        onChange: () => {
        },
        renderCell: () => null
    };
};


/* =========================================
   COMPONENT
========================================= */

const UpdateHubApproveOrigins = ({
                                     objForUpdate,
                                     onCloseParent,
                                     onCloseApproveOrigins
                                 }) => {

    /* =========================================
       STATE
    ========================================= */

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState([]);

    const [selectedPathId, setSelectedPathId] = useState(null);

    const [selectedModelId, setSelectedModelId] = useState(null);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [showWithoutPics, setShowWithoutPics] = useState(false);

    const [openedOriginId, setOpenedOriginId] = useState(null);


    /* =========================================
       REFS
    ========================================= */

    const debounceRef = useRef(null);


    /* =========================================
       DERIVED
    ========================================= */

    const paths = useMemo(() => {

        return objForUpdate.sortOrderPathId.map(
            id => objForUpdate[id]
        );

    }, [objForUpdate]);


    const selectedPath = useMemo(() => {

        return getSelectedPath(
            data,
            selectedPathId
        );

    }, [data, selectedPathId]);


    const selectedModel = useMemo(() => {

        return getSelectedModel(
            selectedPath,
            selectedModelId
        );

    }, [selectedPath, selectedModelId]);


    const openedOriginData = useMemo(() => {

        if (!openedOriginId) {
            return null;
        }

        return getOriginById(
            data,
            openedOriginId
        );

    }, [data, openedOriginId]);


    const flatOriginsWithoutPics = useMemo(() => {

        if (!showWithoutPics) {
            return [];
        }

        return getOriginsWithoutPics({
            data,
            selectedRowKeys
        });

    }, [
        showWithoutPics,
        data,
        selectedRowKeys
    ]);


    const hasSelectedWithoutPics = useMemo(() => {

        return flatOriginsWithoutPics.length > 0;

    }, [flatOriginsWithoutPics]);


    /* =========================================
       FETCH
    ========================================= */

    useEffect(() => {

        void (async () => {

            try {

                setLoading(true);

                const res = await fetchPostData(
                    "/service/approve_origins_for_update",
                    paths
                );

                if (Array.isArray(res)) {

                    setData(res);

                    setSelectedRowKeys(
                        computeSelectedRowKeys(res)
                    );

                }

            } catch (e) {

                console.error(
                    "approveOriginsRequest error:",
                    e
                );

            } finally {

                setLoading(false);

            }

        })();

    }, [paths]);


    /* =========================================
       NAVIGATION INIT
    ========================================= */

    useEffect(() => {

        if (loading || data.length === 0) {
            return;
        }

        setSelectedPathId(prev => {

            const exists = data.some(
                p => p.path_id === prev
            );

            return exists
                ? prev
                : data[0].path_id;

        });

    }, [loading, data]);


    useEffect(() => {

        if (!selectedPath) {
            return;
        }

        setSelectedModelId(prev => {

            const exists =
                selectedPath.models.some(
                    m => m.id === prev
                );

            return exists
                ? prev
                : selectedPath.models?.[0]?.id ?? null;

        });

    }, [selectedPath]);


    /* =========================================
       MUTATIONS
    ========================================= */

    const debounceUpdate = (
        callback,
        delay = 400
    ) => {

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(
            callback,
            delay
        );
    };


    const patchPathMarket = (updatedPath) => {

        setData(prev => {

            return prev.map(path => {

                if (
                    path.path_id !== updatedPath.path_id
                ) {
                    return path;
                }

                return {
                    ...path,
                    market: updatedPath.market,
                    models: updatedPath.models
                };

            });

        });

    };


    const patchOriginImages = ({
                                   originId,
                                   images
                               }) => {

        setData(prev => {

            return prev.map(path => {

                return {
                    ...path,
                    models: path.models.map(model => {

                        return {
                            ...model,
                            origins: model.origins.map(origin => {

                                if (
                                    origin.origin !== originId
                                ) {
                                    return origin;
                                }

                                return {
                                    ...origin,
                                    pics: images
                                };

                            })
                        };

                    })
                };

            });

        });

    };


    const updateMarketParam = (
        path_id,
        scale,
        exponent
    ) => {

        debounceUpdate(async () => {

            try {

                const res = await fetchPostData(
                    "/service/update_market_param",
                    {
                        path_id,
                        route: selectedPath.route,
                        models: selectedPath.models,

                        ...(scale !== null
                                ? {
                                    market_variance_scale: scale
                                }
                                : {}
                        ),

                        ...(exponent !== null
                                ? {
                                    market_variance_exponent: exponent
                                }
                                : {}
                        )
                    }
                );

                if (
                    Array.isArray(res)
                    && res.length > 0
                ) {
                    patchPathMarket(res[0]);
                }

            } catch (e) {

                console.error(
                    "update_market_param error:",
                    e
                );

            }

        });
    };


    const updateOriginsInHubstock = async () => {

        try {

            const payload = buildHubStockPayload({
                data,
                selectedRowKeys
            });

            if (payload.length === 0) {

                message.warning(
                    "Нет выбранных origins"
                );

                return;
            }

            const res = await fetchPostData(
                "/service/update_origins_in_hubstock",
                payload
            );

            if (res !== false) {

                message.success(
                    "HubStock обновлён"
                );

                onCloseParent(true);

            } else {

                message.error(
                    "Ошибка при обновлении HubStock"
                );

            }

        } catch (e) {

            message.error(
                "Ошибка при обновлении HubStock"
            );

        }
    };


    /* =========================================
       TABLE COLUMNS
    ========================================= */

    const columns = buildApproveOriginsColumns({
        selectedModel,
        setOpenedImageModalView: (
            originData
        ) => {
            setOpenedOriginId(
                originData.origin
            );
        }
    });


    /* =========================================
       RENDER
    ========================================= */

    return (
        <>
            <Modal
                open
                closable={false}
                footer={null}
                width={1450}
                onCancel={onCloseApproveOrigins}
            >

                {loading ? (
                    <Spinner/>
                ) : (

                    <div style={{padding: 16}}>

                        <PriceSyncFlow step={4}/>

                        <div
                            style={{
                                marginBottom: 12,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12
                                }}
                            >

                                <Button
                                    icon={<CloseOutlined/>}
                                    type="primary"
                                    onClick={onCloseApproveOrigins}
                                >
                                    Закрыть
                                </Button>


                                <Button
                                    icon={<FileExcelOutlined/>}
                                    type={
                                        showWithoutPics
                                            ? "primary"
                                            : "default"
                                    }
                                    onClick={() => {
                                        setShowWithoutPics(
                                            prev => !prev
                                        );
                                    }}
                                >
                                    {
                                        showWithoutPics
                                            ? "Показать все"
                                            : "Показать без картинок"
                                    }
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


                            {
                                selectedPath?.market && (

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

                                            <Tooltip
                                                title={scaleTooltip}
                                                placement="bottom"
                                            >

                                                <div
                                                    style={{
                                                        fontSize: 12,
                                                        marginBottom: 4
                                                    }}
                                                >
                                                    Мягкость рынка (scale): {

                                                    (
                                                        selectedPath.market
                                                            ?.market_variance_scale
                                                        ?? 0
                                                    ).toFixed(2)

                                                }
                                                </div>

                                            </Tooltip>


                                            <Slider
                                                min={0}
                                                max={10}
                                                step={0.1}
                                                value={
                                                    selectedPath.market
                                                        ?.market_variance_scale
                                                    ?? 0
                                                }
                                                onChange={(value) => {

                                                    updateMarketParam(
                                                        selectedPath.path_id,
                                                        value,
                                                        null
                                                    );

                                                }}
                                            />
                                        </div>


                                        <div style={{width: 260}}>

                                            <Tooltip
                                                title={exponentTooltip}
                                                placement="bottom"
                                            >

                                                <div
                                                    style={{
                                                        fontSize: 12,
                                                        marginBottom: 4
                                                    }}
                                                >
                                                    Степень влияния цены (exponent): {

                                                    (
                                                        selectedPath.market
                                                            ?.market_variance_exponent
                                                        ?? 0
                                                    ).toFixed(2)

                                                }
                                                </div>
                                            </Tooltip>


                                            <Slider
                                                min={0}
                                                max={3}
                                                step={0.05}
                                                value={
                                                    selectedPath.market
                                                        ?.market_variance_exponent
                                                    ?? 0
                                                }
                                                onChange={(value) => {

                                                    updateMarketParam(
                                                        selectedPath.path_id,
                                                        null,
                                                        value
                                                    );

                                                }}
                                            />
                                        </div>
                                    </div>
                                )
                            }

                            <div style={{width: 80}}/>
                        </div>


                        {showWithoutPics ? (

                            <ApproveOriginsWithoutPicsView
                                dataSource={flatOriginsWithoutPics}
                                columns={columns}
                                selectedRowKeys={selectedRowKeys}
                            />

                        ) : (

                            <ApproveOriginsMainTableView
                                data={data}
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
                            />

                        )}

                    </div>
                )}
            </Modal>


            {openedOriginData?.origin && (

                <OriginImageViewer
                    origin={openedOriginData.origin.origin}
                    images={openedOriginData.origin.pics}
                    title={openedOriginData.origin.title}
                    onClose={() => {
                        setOpenedOriginId(null);
                    }}
                    onUploaded={({images}) => {

                        patchOriginImages({
                            originId:
                            openedOriginData.origin.origin,
                            images
                        });

                    }}
                />
            )}
        </>
    );
};

export default UpdateHubApproveOrigins;