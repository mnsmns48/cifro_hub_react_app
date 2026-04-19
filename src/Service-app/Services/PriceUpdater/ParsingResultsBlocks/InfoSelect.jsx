import {useEffect, useState} from "react";
import {Button, Typography, Input} from "antd";
import {ScissorOutlined, SelectOutlined} from "@ant-design/icons";
import MyModal from "../../../../Ui/MyModal.jsx";
import {deleteDependencies, fetchDependencyDetails, fetchItemDependencies, postDependencyUpdate} from "../api.js";
import ResolveModelTypeDependencies from "../../Common/ResolveModelTypeDependencies.jsx";
import Spinner from "../../../../Cifrotech-app/components/Spinner.jsx";

const {Search} = Input;
const {Text} = Typography;

const InfoSelect = ({titles, origin, record, setRows, onClose, autoOpen = false}) => {
    const originList = Array.isArray(origin) ? origin : [origin];

    const [isOpen, setIsOpen] = useState(autoOpen);
    const [fetched, setFetched] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [dependencyResult, setDependencyResult] = useState(null);
    const [isDependencyModalOpen, setIsDependencyModalOpen] = useState(false);

    useEffect(() => {
        if (autoOpen) void openModal();
    }, [autoOpen]);

    const openModal = async () => {
        setIsOpen(true);
        setLoading(true);
        setError(null);

        try {
            const data = await fetchItemDependencies(originList[0]);
            setFetched(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        setFetched(null);
        setError(null);
        setSearchQuery("");
        onClose?.();
    };

    const filtered = fetched?.filter(item => {
        const text = typeof item === "string" ? item : item.title ?? "";
        return text.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const normalizeJson = (value, fallback) => {
        if (typeof value === "string") {
            try {
                return JSON.parse(value);
            } catch {
                return fallback;
            }
        }
        return value ?? fallback;
    };

    const handleChoose = async (item) => {
        try {
            if (!item || !item.title || !item.brand || !item.product_type) {
                throw new Error("Отсутствуют обязательные данные продукта.");
            }

            const info = normalizeJson(item.info, []);
            const pros_cons = normalizeJson(item.pros_cons, {});

            const payload = originList.map(origin => ({
                origin,
                title: item.title,
                brand: item.brand,
                product_type: item.product_type,
                source: item.source,
                info,
                pros_cons
            }));

            const result = await postDependencyUpdate(payload);
            const modelId = result.find(r => r.origin === originList[0])?.model_id;

            setRows(prev =>
                prev.map(row =>
                    originList.includes(row.origin)
                        ? {
                            ...row,
                            features_title: [item.title],
                            brand: {brand: item.brand},
                            type_: {type: item.product_type},
                            model_title: item.title,
                            model_id: modelId
                        }
                        : row
                )
            );

            closeModal();
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            const result = await deleteDependencies(originList);

            setRows(prev =>
                prev.map(row =>
                    result.deleted.includes(row.origin)
                        ? {
                            ...row,
                            features_title: [],
                            model_title: null,
                            model_id: null
                        }
                        : row
                )
            );

            closeModal();
        } catch (err) {
            alert(`Ошибка удаления: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const openDependencyDescription = async (title) => {
        try {
            const result = await fetchDependencyDetails(title);
            if (!result) return;

            setDependencyResult({
                info: result.info,
                source: result.source
            });

            setIsDependencyModalOpen(true);
        } catch (e) {
            alert(`Проблема с получением данных: ${e}`);
        }
    };

    const closeDependencyModal = () => {
        setIsDependencyModalOpen(false);
        setDependencyResult(null);
    };

    const isMultiTitle = Array.isArray(titles) && titles.length > 1;

    const modalContent = loading ? (
        <Spinner/>
    ) : error ? (
        <Text type="danger">{error}</Text>
    ) : (
        <>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12}}>
                <Search
                    placeholder="Поиск по названию"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    allowClear
                    style={{flex: 1, marginRight: 8}}
                />

                <Button
                    icon={<ScissorOutlined/>}
                    onClick={handleDelete}
                    type="default"
                    danger
                >
                    Отвязать
                </Button>
            </div>

            {filtered?.length ? (
                filtered.map((item, i) => (
                    <Button
                        key={i}
                        block
                        type="default"
                        size="small"
                        style={{marginBottom: 8}}
                        onClick={() => handleChoose(item)}
                    >
                        {typeof item === "string" ? item : item.title || "Без названия"}
                    </Button>
                ))
            ) : (
                <Text type="secondary">Ничего не найдено</Text>
            )}
        </>
    );

    return (
        <>
            {!autoOpen && (
                <span style={{display: "flex", alignItems: "center", gap: 6}}>
                    <Button icon={<SelectOutlined/>} size="small" type="text" onClick={openModal}/>
                    {titles?.length ? (
                        <Button
                            onClick={() => openDependencyDescription(titles[0])}
                            size="small"
                            style={{
                                borderColor: "#999",
                                color: "#333",
                                fontWeight: 300,
                                padding: "2px 8px",
                                borderRadius: 6,
                                background: "transparent",
                                height: "auto",
                                lineHeight: 1.4
                            }}
                        >
                            {isMultiTitle
                                ? titles.map((t, i) => <Text key={i}>{t}</Text>)
                                : <Text>{titles[0]}</Text>}
                        </Button>
                    ) : (
                        <Text type="danger" strong>??</Text>
                    )}
                </span>
            )}


            <MyModal
                isOpen={isOpen}
                onConfirm={closeModal}
                onCancel={closeModal}
                title={
                    <div style={{textAlign: "center"}}>
                        {isMultiTitle
                            ? titles.map((t, i) => <Text key={i}>{t}</Text>)
                            : <Text>{titles?.[0] ?? record?.title ?? "неизвестно"}</Text>}
                    </div>
                }
                content={modalContent}
                footer={null}
            />

            <MyModal
                isOpen={isDependencyModalOpen}
                onConfirm={closeDependencyModal}
                onCancel={closeDependencyModal}
                title={null}
                content={
                    dependencyResult ? (
                        <ResolveModelTypeDependencies
                            source={dependencyResult.source}
                            info={dependencyResult.info}
                        />
                    ) : null
                }
                footer={null}
            />

        </>
    );
};

export default InfoSelect;
