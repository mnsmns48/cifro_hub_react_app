import {useEffect, useMemo, useRef, useState} from "react";
import {Segmented, Table, Button, Modal, Col, Row, Slider, Tooltip, message} from "antd";
import {CloseOutlined, CloudUploadOutlined} from "@ant-design/icons";
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


const UpdateHubApproveOrigins = ({objForUpdate, onCloseParent, onCloseApproveOrigins}) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [selectedPathId, setSelectedPathId] = useState(null);
    const [selectedModelId, setSelectedModelId] = useState(null);
    const [openedImageModalView, setOpenedImageModalView] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [marketScale, setMarketScale] = useState(0);
    const [marketExponent, setMarketExponent] = useState(0);

    const paths = useMemo(
        () => objForUpdate.sortOrderPathId.map(id => objForUpdate[id]),
        [objForUpdate]
    );

    const debounceRef = useRef(null);

    const debounceUpdate = (callback, delay = 400) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(callback, delay);
    };


    useEffect(() => {
        void (async () => {
            try {
                setLoading(true);
                const res = await fetchPostData("/service/approve_origins_for_update", paths);
                if (Array.isArray(res)) {
                    setData(res);
                }
                console.log("res", res)
            } catch (e) {
                console.error("approveOriginsRequest error:", e);
            } finally {
                setLoading(false);
            }
        })();
    }, [objForUpdate]);


    useEffect(() => {
        if (loading || data.length === 0) return;
        setSelectedRowKeys(computeSelectedRowKeys(data));
        setSelectedPathId(prevSelectedPathId => {
            const existingPath = data.find(p => p.path_id === prevSelectedPathId);
            if (existingPath) {
                return prevSelectedPathId;
            }
            return data[0].path_id;
        });

        setSelectedModelId(prevSelectedModelId => {
            const modelExists = data.some(path =>
                path.models.some(model => model.id === prevSelectedModelId)
            );
            if (modelExists) {
                return prevSelectedModelId;
            }
            return data[0]?.models?.[0]?.id ?? null;
        });

    }, [loading, data]);


    useEffect(() => {
        if (selectedPath?.market) {
            setMarketScale(selectedPath.market.market_variance_scale ?? 0);
            setMarketExponent(selectedPath.market.market_variance_exponent ?? 0);
        }
    }, [selectedPathId]);


    const selectedPath = data.find(p => p.path_id === selectedPathId);
    const selectedModel = selectedPath?.models.find(m => m.id === selectedModelId);

    const computeSelectedRowKeys = (data) => {
        const keys = [];

        data.forEach(path =>
            path.models.forEach(model =>
                model.origins.forEach(origin => {
                    if (origin.analyze?.verdict === true) {
                        keys.push(origin.origin);
                    }
                })
            )
        );
        return keys;
    };


    const handleImagesUpdated = ({images}, origin) => {
        setOpenedImageModalView(prev =>
            prev && prev.origin === origin
                ? {...prev, images}
                : prev
        );
        setData(prev =>
            prev.map(path =>
                path.path_id === selectedPathId
                    ? {
                        ...path,
                        models: path.models.map(model =>
                            model.id === selectedModelId
                                ? {
                                    ...model,
                                    origins: model.origins.map(o =>
                                        o.origin === origin
                                            ? {...o, pics: images}
                                            : o
                                    )
                                }
                                : model
                        )
                    }
                    : path
            )
        );
    };


    const updateMarketParam = (path_id, scale, exponent) => {
        debounceUpdate(async () => {
            try {
                const res = await fetchPostData("/service/update_market_param", {
                    path_id,
                    route: selectedPath.route,
                    models: selectedPath.models,
                    ...(scale !== null ? {market_variance_scale: scale} : {}),
                    ...(exponent !== null ? {market_variance_exponent: exponent} : {})
                });

                if (Array.isArray(res) && res.length > 0) {
                    const updatedPath = res[0];

                    setData(prev =>
                        prev.map(p =>
                            p.path_id === updatedPath.path_id
                                ? {
                                    ...p,
                                    market: updatedPath.market,
                                    models: updatedPath.models
                                }
                                : p
                        )
                    );
                }
            } catch (e) {
                console.error("update_market_param error:", e);
            }
        });
    };

    const handleScaleChange = (value) => {
        setMarketScale(value);
        updateMarketParam(selectedPathId, value, null);
    };

    const handleExponentChange = (value) => {
        setMarketExponent(value);
        updateMarketParam(selectedPathId, null, value);
    };


    const columns = buildApproveOriginsColumns({
        setOpenedImageModalView,
        selectedModel
    });

    const hasSelectedWithoutPics = selectedModel?.origins?.some(
        o => selectedRowKeys.includes(o.origin) && (!o.pics || o.pics.length === 0)
    );


    const updateOriginsInHubstock = async () => {
        try {
            await fetchPostData("/service/update_origins_in_hubstock", {
                path_id: selectedPath.path_id,
                route: selectedPath.route,
                vsl_id: selectedPath.vsl_id,
                models: selectedPath.models
            });

            message.success("HubStock обновлён");
        } catch (e) {
            console.error("update_origins_in_hubstock error:", e);
            message.error("Ошибка при обновлении HubStock");
        }
    };


    return (
        <>
            <Modal open closable={false} footer={null} width={1450} onCancel={onCloseApproveOrigins}>
                {loading ? (<Spinner/>) : (
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
                                <Button color="purple"
                                        variant="solid"
                                        icon={<CloudUploadOutlined/>}
                                        disabled={hasSelectedWithoutPics}
                                        onClick={updateOriginsInHubstock}>
                                    Выгрузить
                                </Button>
                            </div>
                            {selectedPath?.market && (
                                <div style={{
                                    display: "flex",
                                    gap: 32,
                                    alignItems: "center",
                                    flexGrow: 1,
                                    justifyContent: "center"
                                }}>
                                    <div style={{width: 260}}>
                                        <Tooltip title={scaleTooltip} placement="bottom">
                                            <div style={{fontSize: 12, marginBottom: 4}}>
                                                Мягкость рынка
                                                (scale): {marketScale.toFixed(2)}
                                            </div>
                                        </Tooltip>
                                        <Slider min={0} max={10} step={0.1}
                                                value={marketScale}
                                                onChange={handleScaleChange}
                                        />

                                    </div>
                                    <div style={{width: 260}}>
                                        <Tooltip title={exponentTooltip} placement="bottom">
                                            <div style={{fontSize: 12, marginBottom: 4}}>
                                                Степень влияния цены
                                                (exponent): {marketExponent.toFixed(2)}
                                            </div>
                                        </Tooltip>
                                        <Slider min={0}
                                                max={3}
                                                step={0.05}
                                                value={marketExponent}
                                                onChange={handleExponentChange}
                                        />
                                    </div>
                                </div>
                            )}
                            <div style={{width: 80}}></div>
                        </div>

                        <Row gutter={16} wrap>

                            <Col xs={24} sm={24} md={8} lg={6} xl={6} xxl={6}>
                                <Segmented vertical
                                           size="small"
                                           value={selectedPathId}
                                           onChange={(val) => {
                                               setSelectedPathId(val);
                                               const backendPath = data.find(p => p.path_id === val);
                                               if (backendPath && backendPath.models.length > 0) {
                                                   setSelectedModelId(backendPath.models[0].id);
                                               }
                                           }}
                                           options={paths
                                               .filter(entry => {
                                                   const backendPath = data.find(p => p.path_id === entry.path_id);
                                                   return backendPath && backendPath.models.length > 0;
                                               })
                                               .map(entry => ({
                                                   value: entry.path_id,
                                                   label: entry.route.map(r => r.label).join(" - "),
                                                   icon: entry.route.at(-1)?.icon && (
                                                       <img src={entry.route.at(-1).icon} width={18}/>
                                                   )
                                               }))}
                                           styles={{
                                               item: {justifyContent: "flex-start"},
                                               label: {textAlign: "left"},
                                           }}
                                />
                            </Col>

                            <Col xs={24} sm={24} md={16} lg={18} xl={18} xxl={18}>
                                <div style={{marginBottom: 12}}>
                                    <Segmented vertical
                                               size="small"
                                               value={selectedModelId}
                                               onChange={setSelectedModelId}
                                               options={(selectedPath?.models || [])
                                                   .map(m => ({label: m.title, value: m.id}))}
                                               styles={{
                                                   item: {justifyContent: "flex-start"},
                                                   label: {textAlign: "left"},
                                               }}/>
                                </div>

                                {selectedModel && (
                                    <Table rowKey="origin"
                                           dataSource={selectedModel.origins}
                                           columns={columns}
                                           pagination={false}
                                           size="small"
                                           className="approve-origins-table"
                                           rowSelection={{
                                               selectedRowKeys,
                                               onChange: setSelectedRowKeys,
                                               preserveSelectedRowKeys: true,
                                               columnWidth: "2%"
                                           }}
                                           rowClassName={(record) => {
                                               const isSelected = selectedRowKeys.includes(record.origin);
                                               const hasPics = Array.isArray(record.pics) && record.pics.length > 0;
                                               if (isSelected && !hasPics) {
                                                   return "row-selected-no-pics";
                                               }
                                               if (isSelected) {
                                                   return "row-selected";
                                               }
                                               return "";
                                           }}

                                    />
                                )}
                            </Col>

                        </Row>
                    </div>
                )
                }
            </Modal>
            {openedImageModalView && openedImageModalView.origin && (
                <OriginImageViewer origin={openedImageModalView.origin}
                                   images={openedImageModalView.images}
                                   title={openedImageModalView.title}
                                   onClose={() => setOpenedImageModalView(null)}
                                   onUploaded={handleImagesUpdated}
                />
            )}
        </>

    );
};


export default UpdateHubApproveOrigins;