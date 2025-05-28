import {useEffect, useState} from "react";
import {fetchRangeRewardLines} from "./api.js";
import {Switch, Table} from "antd";

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
        {title: "От", dataIndex: "line_from", key: "line_from", width: 250},
        {title: "До", dataIndex: "line_to", key: "line_to", width: 250},
        {
            title: "Процент?", dataIndex: "is_percent", key: "is_percent", width: 250,
            render: (val) => <Switch checked={val} disabled />,
        },
        {title: "Вознаграждение / Процент", dataIndex: "reward", key: "reward", width: 250},
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