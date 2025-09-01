import {useEffect, useState} from "react";
import {Table, Spin} from "antd";
import {consentData} from "./api.js";

const ConsentTable = ({path_ids}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConsent = async () => {
            try {
                const result = await consentData({ path_ids: path_ids });
                setData(result);
            } catch (e) {
                console.error("Ошибка загрузки данных сверки:", e);
            } finally {
                setLoading(false);
            }
        };

        if (Array.isArray(path_ids) && path_ids.length > 0) {
            fetchConsent();
        }
    }, [path_ids]);

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Название", dataIndex: "warranty", key: "warranty" },
        { title: "Цена", dataIndex: "output_price", key: "output_price" },
    ];

    return loading ? (
        <div style={{ textAlign: "center", padding: 24 }}>
            <Spin tip="Загрузка данных сверки..." />
        </div>
    ) : (
        <Table
            rowKey="id"
            dataSource={data}
            columns={columns}
        />
    );
};

export default ConsentTable;
