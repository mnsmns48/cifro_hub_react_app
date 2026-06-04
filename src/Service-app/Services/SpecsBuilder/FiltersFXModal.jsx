import {Modal, Table, Tooltip, Typography, Tag} from "antd";
import {useEffect, useState} from "react";
import {fetchGetData} from "../Common/api.js";

const {Text} = Typography;

const FiltersFXModal = ({open, onClose}) => {
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(null);

    useEffect(() => {
        if (!open) return;

        const load = async () => {
            setLoading(true);
            const data = await fetchGetData("/service/formula-expression/filter-docs");
            setFilters(data);
            setLoading(false);
        };

        void load();
    }, [open]);

    const columns = [
        {dataIndex: "name", width: 100, render: (v) => <Tag color="blue">{v}</Tag>},
        {dataIndex: "example", width: 300},
        {
            dataIndex: "args", width: 200, ellipsis: true,
            render: (args) => {
                return (
                    <Tooltip title={args.join(", ")}>
                        <div style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 180
                        }}>{args.map((a, i) => (<Tag key={i} color="geekblue">{a}</Tag>))}
                        </div>
                    </Tooltip>
                );
            }
        },
        {dataIndex: "description", width: 500, render: (v) => <Text>{v}</Text>}
    ];

    const dataSource = filters
        ? Object.entries(filters).map(([name, info]) => ({
            key: name,
            name,
            ...info
        }))
        : [];

    return (
        <Modal open={open} onCancel={onClose} footer={null} width={1280} title="Документация по фильтрам"
               closable={false}>
            <Table loading={loading} dataSource={dataSource} columns={columns} pagination={false} size="small"/>
        </Modal>
    );
};

export default FiltersFXModal;
