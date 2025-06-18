import {useState} from "react";
import {Button, Typography, Spin, Input} from "antd";
import {SelectOutlined} from "@ant-design/icons";
import MyModal from "../../../Ui/MyModal.jsx";
import {fetchItemDependencies} from "./api.js";

const {Text} = Typography;
const {Search} = Input;

const InfoSelect = ({titles, origin, record}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [fetched, setFetched] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

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

    const modalContent = loading ? (
        <Spin />
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
                    <Button key={i} block type="default" size="small"
                            style={{marginBottom: 8}} onClick={() => console.log("Выбрано:", item)}>
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
      <span style={{display: "flex", alignItems: "center", gap: 6}}>
        <Button icon={<SelectOutlined />} size="small" type="text" onClick={openModal} />
          {titles?.length ? (
              <Text>{titles.length === 1 ? titles[0] : "Выбор доступен"}</Text>
          ) : (
              <Text type="danger" strong>??</Text>
          )}
      </span>

            <MyModal
                isOpen={isOpen}
                onConfirm={closeModal}
                onCancel={closeModal}
                title={
                    <div style={{textAlign: "center"}}>
                        {record?.title ?? "неизвестно"}
                    </div>
                }
                content={modalContent}
                footer={null}
            />
        </>
    );
};

export default InfoSelect;
