import {useState} from "react";
import {Button, Typography, Spin, Input} from "antd";
import {SelectOutlined} from "@ant-design/icons";
import MyModal from "../../../Ui/MyModal.jsx";
import {fetchDependencyDetails, fetchItemDependencies, postDependencyUpdate} from "./api.js";
import DependencyModal from "./DetailDependencyModal.jsx";

const {Text} = Typography;
const {Search} = Input;

const InfoSelect = ({titles, origin, record, setRows}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [fetched, setFetched] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [dependencyResult, setDependencyResult] = useState(null);
    const [isDependencyModalOpen, setIsDependencyModalOpen] = useState(false);

    const openModal = async () => {
        setIsOpen(true);
        setLoading(true);
        setError(null);
        try {
            const data = await fetchItemDependencies(origin);
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
    };

    const filtered = fetched?.filter(item => {
        const text = typeof item === "string" ? item : item.title ?? "";
        return text.toLowerCase().includes(searchQuery.toLowerCase());
    });


    const isChooseModalContent = async (item) => {
        try {
            if (
                !item || typeof item.title !== "string" || typeof item.brand !== "string" || typeof item.product_type !== "string"
            ) {
                throw new Error("Отсутствуют обязательные данные продукта.");
            }
            if (!origin || typeof origin !== "number") {
                throw new Error("Некорректное значение origin.");
            }
            let info = item.info;
            if (typeof info === "string") {
                try {
                    info = JSON.parse(info);
                } catch (e) {
                    info = [];
                }
            }
            let pros_cons = item.pros_cons;
            if (typeof pros_cons === "string") {
                try {
                    pros_cons = JSON.parse(pros_cons);
                } catch (e) {
                    pros_cons = {};
                }
            } else if (pros_cons === null) {
                pros_cons = {};
            }
            const data = {
                origin, title: item.title, brand: item.brand, product_type: item.product_type,
                info, pros_cons
            };
            await postDependencyUpdate(data);

            setRows((prevRows) =>
                prevRows.map((row) =>
                    row.origin === origin
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
        <Spin/>
    ) : error ? (
        <Text type="danger">{error}</Text>
    ) : (
        <>
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
                            onClick={() => isChooseModalContent(item)}>
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
        console.log(result);
        setDependencyResult(result);
        setIsDependencyModalOpen(true);
    };

    const closeDependencyModal = () => {
        setIsDependencyModalOpen(false);
        setDependencyResult(null);
    };

    return (
        <>
      <span style={{display: "flex", alignItems: "center", gap: 6}}>
        <Button icon={<SelectOutlined/>} size="small" type="text" onClick={openModal}/>
          {titles?.length ? (
              <Button onClick={() => openDependencyDescription(titles[0])} size="small"
                      style={{
                          borderColor: "#999", color: "#333", fontWeight: 300, padding: "2px 8px",
                          borderRadius: 6, background: "transparent", height: "auto", lineHeight: 1.4
                      }}>
                  {titles.length === 1 ? titles[0] : "Ошибка"}
              </Button>
          ) : (
              <Text type="danger" strong>??</Text>
          )}
      </span>

            <MyModal isOpen={isOpen} onConfirm={closeModal} onCancel={closeModal}
                     title={<div style={{textAlign: "center"}}>
                         {record?.title ?? "неизвестно"}
                     </div>} content={modalContent} footer={null}/>

            <DependencyModal open={isDependencyModalOpen} onClose={closeDependencyModal} data={dependencyResult}
            />
        </>
    );
};

export default InfoSelect;
