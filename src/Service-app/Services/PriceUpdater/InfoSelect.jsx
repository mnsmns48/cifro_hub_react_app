import {useEffect, useState} from "react";
import {Button, Typography, Input} from "antd";
import {DeleteRowOutlined, SelectOutlined} from "@ant-design/icons";
import MyModal from "../../../Ui/MyModal.jsx";
import {fetchDependencyDetails, fetchItemDependencies, postDependencyUpdate} from "./api.js";
import DependencyModal from "./DetailDependencyModal.jsx";
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";

const {Text} = Typography;
const {Search} = Input;

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
        if (autoOpen) {
            openModal();
        }
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
            if (
                !item || typeof item.title !== "string" || typeof item.brand !== "string" || typeof item.product_type !== "string"
            ) {
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

            await postDependencyUpdate(payload);

            setRows(prev =>
                prev.map(row =>
                    originList.includes(row.origin)
                        ? {...row, features_title: [item.title]}
                        : row
                )
            );

            closeModal();
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    const modalContent = loading ? (
        <Spinner/>
    ) : error ? (
        <Text type="danger">{error}</Text>
    ) : (
        <>
            <div style={{justifyContent: "end", display: "flex", paddingBottom: '10px'}}>
                <Button icon={<DeleteRowOutlined/>}/>
            </div>
            <Search
                placeholder="Поиск по названию"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{marginBottom: 12}}
                allowClear
            />
            {filtered?.length ? (
                filtered.map((item, i) => (
                    <Button key={i} block type="default" size="small" style={{marginBottom: 8}}
                            onClick={() => handleChoose(item)}>
                        {typeof item === "string" ? item : item.title || "Без названия"}
                    </Button>
                ))
            ) : (
                <Text type="secondary">Ничего не найдено</Text>
            )}
        </>
    );

    const openDependencyDescription = async (title) => {
        const result = await fetchDependencyDetails(title);
        setDependencyResult(result);
        setIsDependencyModalOpen(true);
    };

    const closeDependencyModal = () => {
        setIsDependencyModalOpen(false);
        setDependencyResult(null);
    };

    const isMultiTitle = Array.isArray(titles) && titles.length > 1;


    return (
        <>
            {!autoOpen && (
                <span style={{display: "flex", alignItems: "center", gap: 6}}>
                    <Button icon={<SelectOutlined/>} size="small" type="text" onClick={openModal}/>
                    {titles?.length ? (
                        <Button onClick={() => openDependencyDescription(titles[0])} size="small"
                                style={{
                                    borderColor: "#999", color: "#333", fontWeight: 300, padding: "2px 8px",
                                    borderRadius: 6, background: "transparent", height: "auto", lineHeight: 1.4
                                }}>
                            {isMultiTitle ? (
                                titles.map((t, i) => <Text key={i}>{t}</Text>)
                            ) : (
                                <Text>{Array.isArray(titles) ? titles[0] : record?.title ?? "неизвестно"}</Text>
                            )}

                        </Button>
                    ) : (
                        <Text type="danger" strong>??</Text>
                    )}
                </span>
            )}

            <MyModal isOpen={isOpen}
                     onConfirm={closeModal}
                     onCancel={closeModal}
                     title={
                         <div style={{textAlign: "center"}}>
                             {titles.length > 1 ? (
                                 <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                                     {titles.map((t, i) => (
                                         <Text key={i} style={{fontSize: 14}}>{t}</Text>
                                     ))}
                                 </div>
                             ) : (
                                 <Text>{titles?.[0] ?? record?.title ?? "неизвестно"}</Text>
                             )}
                         </div>
                     }
                     content={modalContent}
                     footer={null}/>

            <DependencyModal open={isDependencyModalOpen} onClose={closeDependencyModal} data={dependencyResult}/>
        </>
    );
};

export default InfoSelect;
