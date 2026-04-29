import {useEffect, useState} from "react";
import {Table, Descriptions} from "antd";
import {fetchGetData} from "../Common/api.js";
import EmptyState from "../../../Ui/Empty.jsx";

const Analytics = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchGetData("/service/analytics/")
            .then((res) => setData(res))
            .catch(() => setData([]));
    }, []);

    const columns = [
        {
            title: "Тип товара",
            dataIndex: ["product_type", "type"],
            key: "product_type",
        },
        {
            title: "Атрибут",
            dataIndex: ["attr_key", "key"],
            key: "attr_key",
        },
        {
            title: "Вес",
            dataIndex: "weight",
            key: "weight",
        },
        {
            title: "Value Map",
            dataIndex: "value_map",
            key: "value_map",
            render: (value) => {
                if (!value) return "—";

                const entries = Object.entries(value);

                return (
                    <Descriptions
                        size="small"
                        column={1}
                        bordered={false}
                        style={{margin: 0}}
                    >
                        {entries.map(([k, v]) => (
                            <Descriptions.Item key={k} label={k}>
                                {v}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                );
            }
        },
        {
            title: "Описание",
            dataIndex: "description",
            key: "description",
        }
    ];

    return (
        <>
            <Table
                locale={{ emptyText: <EmptyState /> }}
                rowKey="id"
                columns={columns}
                dataSource={data}
                pagination={false}
            />
        </>
    );
};

export default Analytics;
