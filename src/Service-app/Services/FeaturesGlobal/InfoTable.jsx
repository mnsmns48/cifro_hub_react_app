import {Table, Input, Button, Popconfirm} from "antd";
import {useState} from "react";
import {
    EditOutlined,
    DeleteOutlined,
    CloseOutlined,
    DashOutlined, AppstoreAddOutlined, HddOutlined, CheckOutlined, UndoOutlined
} from "@ant-design/icons";
import {fetchPostData} from "../SchemeAttributes/api.js";
import './FeaturesGlobal.css'

const InfoTable = ({featureId, info}) => {
    const [data, setData] = useState(info);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [editingInner, setEditingInner] = useState(null);


    const fadeStyle = {
        transition: "all 0.5s ease",
        opacity: editingInner ? 1 : 0.9,
    };


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
            value: v,
            category
        }));

        return {
            key: index,
            category,
            details: innerData
        };
    });

    const addInnerRow = (categoryTitle) => {
        setData(prevData => {
            return prevData.map(block => {
                const key = Object.keys(block)[0];

                if (key !== categoryTitle) return block;

                const updated = {
                    ...block[key],
                    "": ""
                };

                const newKey = Object.keys(updated).length - 1;

                setEditingInner({
                    category: categoryTitle,
                    key: newKey,
                    param: "",
                    value: ""
                });

                return {[key]: updated};
            });
        });
    };

    const cancelInnerEdit = () => {
        if (!editingInner) return;

        const {category, key, param, value} = editingInner;
        const isNewRow = param.trim() === "" && value.trim() === "";

        if (isNewRow) {
            setData(prevData =>
                prevData.map(block => {
                    const blockKey = Object.keys(block)[0];
                    if (blockKey !== category) return block;

                    const entries = Object.entries(block[blockKey]);
                    const updatedEntries = entries.filter((_, idx) => idx !== key);
                    const updatedObj = Object.fromEntries(updatedEntries);
                    return {[blockKey]: updatedObj};
                })
            );
        }

        setEditingInner(null);
    };


    const deleteInnerRow = async (category, param) => {
        const result = await fetchPostData(
            "service/features/delete_inner_row",
            {id: featureId, category_title: category, new_param: param, new_value: ""}
        );

        if (!result || result.status !== "deleted") {
            console.error("Ошибка при удалении параметра");
            return;
        }

        setData(result.info);
    };


    const saveInnerRow = async () => {
        if (!editingInner) return;

        const {category, param, value, oldParam, oldValue} = editingInner;

        const trimmedParam = param.trim();
        const trimmedValue = value.trim();

        const isNewRow = oldParam === undefined;

        if (isNewRow) {
            const result = await fetchPostData("service/features/add_new_inner_row", {
                id: featureId,
                category_title: category,
                new_param: trimmedParam,
                new_value: trimmedValue
            });

            if (result?.status === "created") setData(result.info);
        } else {
            const result = await fetchPostData("service/features/update_inner_row", {
                id: featureId,
                category_title: category,
                old_param: oldParam,
                old_value: oldValue,
                new_param: trimmedParam,
                new_value: trimmedValue
            });

            if (result?.status === "updated") setData(result.info);
        }

        setEditingInner(null);
    };


    const innerColumns = [
        {
            dataIndex: "param",
            key: "param",
            width: "40%",
            render: (text, record, rowIndex) => {
                const isEditing =
                    editingInner &&
                    editingInner.category === record.category &&
                    editingInner.key === rowIndex;

                return isEditing ? (
                    <div style={fadeStyle}>
                        <Input
                            value={editingInner.param}
                            autoFocus
                            onChange={(e) =>
                                setEditingInner(prev => ({...prev, param: e.target.value}))
                            }
                            onPressEnter={saveInnerRow}
                        />
                    </div>
                ) : (
                    <div style={fadeStyle}>{text}</div>
                );

            }
        },
        {
            dataIndex: "value",
            key: "value",
            render: (text, record, rowIndex) => {
                const isEditing =
                    editingInner &&
                    editingInner.category === record.category &&
                    editingInner.key === rowIndex;

                return isEditing ? (
                    <Input
                        value={editingInner.value}
                        onChange={(e) =>
                            setEditingInner(prev => ({...prev, value: e.target.value}))
                        }
                        onPressEnter={saveInnerRow}
                    />
                ) : (
                    text
                );
            }
        }
        ,
        {
            key: "actions",
            width: 50,
            align: "center",
            render: (_, record, rowIndex) => {
                const isEditing =
                    editingInner &&
                    editingInner.category === record.category &&
                    editingInner.key === rowIndex;

                if (isEditing) {
                    return (
                        <div style={{display: "flex", gap: 8, justifyContent: "center"}}>
                            <CheckOutlined
                                onClick={saveInnerRow}
                                style={{color: "green", cursor: "pointer"}}
                            />

                            <UndoOutlined
                                onClick={cancelInnerEdit}
                                style={{color: "orange", cursor: "pointer"}}
                            />
                        </div>

                    );
                }


                return (
                    <div style={{display: "flex", gap: 6, justifyContent: "center"}}>
                        <DashOutlined
                            style={{cursor: "pointer"}}
                            onClick={() => {
                                setEditingInner({
                                    category: record.category,
                                    key: rowIndex,
                                    param: record.param,
                                    value: record.value,
                                    oldParam: record.param,
                                    oldValue: record.value
                                });
                            }}
                        />

                        <Popconfirm
                            title="Удалить параметр?"
                            okText="Удалить"
                            cancelText="Отмена"
                            onConfirm={() => deleteInnerRow(record.category, record.param)}
                        >
                            <CloseOutlined style={{cursor: "pointer", color: "red"}}/>
                        </Popconfirm>
                    </div>
                );
            }
        }

    ];


    const mainColumns = [
        {
            dataIndex: "category",
            key: "category",
            width: 250,
            render: (text, record) => {
                const index = record.key;

                return (
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 8}}>

                        <div style={fadeStyle}>
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
                        </div>

                        <EditOutlined
                            style={{cursor: "pointer", color: "blue"}}
                            onClick={() => startEdit(index, text)}
                        />

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

                        <AppstoreAddOutlined
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                cursor: "pointer",
                                color: "#00804BEA"
                            }}
                            onClick={() => addInnerRow(record.category)}
                        />
                    </div>

                );
            }
        },
        {
            dataIndex: "details",
            key: "details",
            className: "gray-table-background",
            render: (details) => (
                <Table
                    className="compact-table"
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
                showHeader={false}
                dataSource={tableData}
                columns={mainColumns}
                pagination={false}
                size="small"
                bordered
            />
            <Button
                icon={<HddOutlined/>}
                className="add-category-button"
                onClick={addCategory}
            >
                Добавить категорию
            </Button>
        </div>
    );
};

export default InfoTable;
