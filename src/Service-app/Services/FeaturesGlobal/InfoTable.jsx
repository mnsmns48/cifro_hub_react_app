import {Table, Input, Button, Popconfirm} from "antd";
import {useState} from "react";
import {EditOutlined, DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {fetchPostData} from "../SchemeAttributes/api.js";
import './FeaturesGlobal.css'

const InfoTable = ({featureId, info}) => {
    const [data, setData] = useState(info);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editValue, setEditValue] = useState("");


    const startEdit = (index, currentName) => {
        setEditingCategory(index);
        setEditValue(currentName);
    };


    const saveEditCategory = async (index) => {
        const newName = editValue.trim();
        if (!newName) {
            setData(prev => prev.filter((_, i) => i !== index));
            setEditingCategory(null);
            return;
        }

        const oldKey = Object.keys(data[index])[0];

        if (oldKey === "") {
            const result = await fetchPostData(
                "service/features/create_new_info_category",
                {
                    id: featureId,
                    category_title: newName
                }
            );

            if (result?.status === "created") {
                setData(result.info);
            }

            setEditingCategory(null);
            return;
        }

        if (oldKey === newName) {
            setEditingCategory(null);
            return;
        }
        const result = await fetchPostData(
            "service/features/Update_info_category",
            {
                id: featureId,
                old_category_title: oldKey,
                new_category_title: newName
            }
        );

        if (result?.status === "updated") {
            setData(result.info);
        }

        setEditingCategory(null);
    };


    const addCategory = () => {
        const newIndex = data.length;
        const newData = [
            ...data,
            {"": {}}
        ];

        setData(newData);
        setEditingCategory(newIndex);
        setEditValue("");
    };


    const deleteCategory = async (categoryTitle) => {
        const result = await fetchPostData(
            "service/features/delete_info_category",
            {
                id: featureId,
                category_title: categoryTitle
            }
        );

        if (!result) return;

        if (result.status === "deleted") {
            setData(result.info);
        }
    };


    const tableData = data.map((block, index) => {
        const category = Object.keys(block)[0];
        const values = block[category];

        const innerData = Object.entries(values).map(([k, v], i) => ({
            key: i,
            param: k,
            value: v
        }));

        return {
            key: index,
            category,
            details: innerData
        };
    });

    const innerColumns = [
        {dataIndex: "param", key: "param", width: "40%"},
        {dataIndex: "value", key: "value"}
    ];

    const columns = [
        {
            dataIndex: "category",
            key: "category",
            width: 250,
            render: (text, record) => {
                const index = record.key;

                return (
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 8}}>

                        {editingCategory === index ? (
                            <Input
                                value={editValue}
                                autoFocus
                                onChange={(e) => setEditValue(e.target.value)}
                                onPressEnter={() => saveEditCategory(index)}
                                onBlur={() => saveEditCategory(index)}
                                style={{width: "100%"}}
                            />
                        ) : (
                            <span>{text}</span>
                        )}

                        <Popconfirm
                            title="Редактировать категорию? Это небезопасно"
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => startEdit(index, text)}
                        >
                            <EditOutlined
                                style={{cursor: "pointer", color: "blue"}}
                            />
                        </Popconfirm>

                        <Popconfirm
                            title="Удалить категорию? Это небезопасно"
                            description="Это действие необратимо"
                            okText="Удалить"
                            cancelText="Отмена"
                            onConfirm={() => deleteCategory(text)}
                        >
                            <DeleteOutlined
                                style={{cursor: "pointer", color: "red"}}
                            />
                        </Popconfirm>

                    </div>
                );
            }
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
        <div>
            <Table
                className="compact-table"
                showHeader={false}
                dataSource={tableData}
                columns={columns}
                pagination={false}
                size="small"
                bordered
            />
            <Button
                icon={<PlusOutlined/>}
                style={{marginTop: 10}}
                onClick={addCategory}
            >
                Добавить категорию
            </Button>
        </div>
    );
};

export default InfoTable;
