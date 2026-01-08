import {useEffect, useState} from "react";
import {fetchGetData, fetchDeleteData} from "./api.js";
import {Table, Button, Space, Popconfirm, Card} from "antd";
import FormulaExpression from "./FormulaExpression.jsx";
import {
    AppstoreAddOutlined,
    CheckOutlined,
    DeleteOutlined,
    EditOutlined,
    PoweroffOutlined
} from "@ant-design/icons";

const FormulaList = () => {
    const [formulas, setFormulas] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        void loadFormulas();
    }, []);

    const loadFormulas = async () => {
        const data = await fetchGetData("/service/formula-expression/");
        setFormulas(Array.isArray(data) ? data : []);
    };

    const deleteFormula = async (id) => {
        await fetchDeleteData(`/service/formula-expression/${id}`);
        void loadFormulas();
    };

    const handleSaved = () => {
        void loadFormulas();
        setEditingId(null);
    };

    const columns = [
        {title: "ID", dataIndex: "id", width: 60},
        {title: "Название", dataIndex: "name"},
        {title: "Тип", dataIndex: "entity_type"},
        {title: "is_default", align: "center", dataIndex: "is_default", render: (v) => v ? (<CheckOutlined/>) : (null)},
        {
            title: "Активна?",
            align: "center",
            dataIndex: "is_active",
            render: (v) => (<PoweroffOutlined style={{color: v ? "green" : "#e3e3e3"}}/>)
        },
        {
            title: "Действия",
            align: "center",
            render: (_, record) => (<Space size="small">
                <EditOutlined style={{color: "#1677ff", cursor: "default", fontSize: 18}}
                              onClick={() => setEditingId(record.id)}/>
                <Popconfirm title="Удалить формулу?" onConfirm={() => deleteFormula(record.id)}>
                    <DeleteOutlined style={{color: "red", cursor: "default", fontSize: 18}}/>
                </Popconfirm>
            </Space>)
        }
    ];

    if (editingId !== null) {
        return (
            <FormulaExpression
                formulaId={editingId === "new" ? null : editingId}
                onSaved={handleSaved}
                onCancel={() => setEditingId(null)}
            />
        );
    }


    return (
        <Card extra={<Button primary icon={<AppstoreAddOutlined/>} onClick={() => setEditingId("new")}/>}>
            <Table rowKey="id"
                   dataSource={formulas}
                   columns={columns}
                   pagination={false}
                   size={"small"}
            />
        </Card>
    );
};

export default FormulaList;
