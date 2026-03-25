import {Table, Input, Button, Popconfirm} from "antd";
import {useState} from "react";
import {
    EditOutlined,
    DeleteOutlined,
    CloseOutlined,
    DashOutlined, AppstoreAddOutlined, HddOutlined, CheckOutlined
} from "@ant-design/icons";
import {fetchPostData} from "../SchemeAttributes/api.js";
import './FeaturesGlobal.css'

const InfoTable = ({featureId, info}) => {
    const [data, setData] = useState(info);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [editingInner, setEditingInner] = useState(null);


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

    const saveInnerRow = async () => {
        if (!editingInner) return;
        const {category, param, value} = editingInner;
        const trimmedParam = param.trim();
        const trimmedValue = value.trim();

        if (!trimmedParam || !trimmedValue) {
            console.warn("Param и Value должны быть заполнены");
            return;
        }

        const categoryBlock = data.find(block => Object.keys(block)[0] === category);
        const categoryData = categoryBlock ? categoryBlock[category] : {};
        const existingParams = Object.keys(categoryData);

        if (existingParams.includes(trimmedParam)) {
            console.warn("Такой param уже существует в этой категории");
            return;
        }

        const result = await fetchPostData(
            "service/features/add_new_inner_row",
            {
                id: featureId,
                category_title: category,
                new_param: trimmedParam,
                new_value: trimmedValue
            }
        );

        if (!result) {
            console.error("Ошибка при сохранении строки");
            return;
        }

        if (result.status === "created") {
            setData(result.info);
        }

        setEditingInner(null);
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
            {
                id: featureId,
                category_title: category,
                new_param: param,
                new_value: ""
            }
        );

        if (!result || result.status !== "deleted") {
            console.error("Ошибка при удалении параметра");
            return;
        }

        setData(result.info);
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
                    <Input
                        value={editingInner.param}
                        autoFocus
                        onChange={(e) =>
                            setEditingInner(prev => ({...prev, param: e.target.value}))
                        }
                        onPressEnter={saveInnerRow}
                    />
                ) : (
                    text
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

                            <CloseOutlined
                                onClick={cancelInnerEdit}
                                style={{color: "red", cursor: "pointer"}}
                            />
                        </div>

                    );
                }


                return (
                    <div style={{display: "flex", gap: 6, justifyContent: "center"}}>
                        <Popconfirm
                            title="Редактировать параметр?"
                            okText="Да"
                            cancelText="Нет"
                            // onConfirm={() => {
                            //     setEditingInner({
                            //         category: record.category,
                            //         key: rowIndex,
                            //         param: record.param,
                            //         value: record.value
                            //     });
                            // }}
                        >
                            <DashOutlined style={{cursor: "pointer"}}/>
                        </Popconfirm>

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
