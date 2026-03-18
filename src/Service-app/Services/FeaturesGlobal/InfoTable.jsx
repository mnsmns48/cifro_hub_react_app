import { Table } from "antd";

const InfoTable = ({ info }) => {
    const data = info.map((block, index) => {
        const key = Object.keys(block)[0];
        const values = block[key];

        const innerData = Object.entries(values).map(([k, v], i) => (
            {key: i, param: k, value: v}));

        return {key: index, category: key, details: innerData};
    });

    const innerColumns = [
        { dataIndex: "param", key: "param", width: "40%" },
        { dataIndex: "value", key: "value" }
    ];

    const columns = [
        {
            dataIndex: "category",
            key: "category",
            width: 200,
            align: "center"
        },
        {
            dataIndex: "details",
            key: "details",
            render: (details) => (
                <Table
                    dataSource={details}
                    columns={innerColumns}
                    showHeader={false}
                    pagination={false}
                    size="small"
                />
            )
        }
    ];

    return (
        <Table
            showHeader={false}
            dataSource={data}
            columns={columns}
            pagination={false}
            size="small"
            bordered
        />
    );
};

export default InfoTable;
