import {useEffect, useState} from "react";
import {fetchRangeRewardLines} from "./api.js";
import {Button, Space, Switch, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

const RewardRangeTable = ({selectedProfile}) => {
    const [rangeData, setRangeData] = useState([]);

    useEffect(() => {
        fetchRangeRewardLines(selectedProfile.id).then(rewards => {
            setRangeData(rewards);
        }).catch(error => {
            console.error("Ошибка загрузки строк таблицы:", error);
        });
    }, [selectedProfile]);


    const columns = [
        {title: "От", dataIndex: "line_from", key: "line_from", width: 180},
        {title: "До", dataIndex: "line_to", key: "line_to", width: 180},
        {
            title: "Процент?", dataIndex: "is_percent", key: "is_percent", width: 180,
            render: (val) => <Switch checked={val} disabled />,
        },
        {title: "Вознаграждение / Процент", dataIndex: "reward", key: "reward", width: 180},
        {
            title: "Действия",
            key: "actions",
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button type="text" icon={<EditOutlined />} />
                    <Button type="text" icon={<DeleteOutlined />}/>
                </Space>
            ),
        },
    ];

    return (
        <Table
            dataSource={rangeData}
            columns={columns}
            rowKey="id"
        />
    )
}

export default RewardRangeTable;