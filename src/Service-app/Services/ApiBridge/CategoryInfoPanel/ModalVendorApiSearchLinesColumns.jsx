import {Checkbox, Input, Select, Button, Space, Popconfirm} from "antd";
import {DeleteOutlined, EditOutlined, SaveOutlined, UndoOutlined} from "@ant-design/icons";

export function getModalVendorApiSearchLinesColumns(isLinked,
                                                    toggleLink,
                                                    newRow,
                                                    updateNewRow,
                                                    handleSaveNew,
                                                    handleUndo,
                                                    handleDelete,
                                                    handleEdit,
                                                    handleSaveEdit,
                                                    updateEditRow,
                                                    handleUndoEdit,
                                                    brandsList) {
    return [
        {
            dataIndex: "id",
            width: 40,
            render: (id, record) =>
                record?.__isNew ? null : <Checkbox checked={isLinked(id)} onChange={() => toggleLink(id)}/>
        },
        {
            title: "Название",
            dataIndex: "title",
            width: 260,
            ellipsis: true,
            render: (text, record) =>
                record?.__isNew || record?.__isEdit ? (
                    <Input
                        value={record.title}
                        onChange={(e) =>
                            record.__isNew
                                ? updateNewRow("title", e.target.value)
                                : updateEditRow("title", e.target.value)
                        }
                    />
                ) : (
                    <div style={{fontWeight: 600}}>{text}</div>
                )

        },
        {
            title: "Бренды",
            dataIndex: "brands",
            width: 180,
            ellipsis: true,
            render: (brands, record) => {
                if (record?.__isNew || record?.__isEdit) {
                    return (
                        <Select
                            mode="multiple"
                            style={{width: "100%"}}
                            value={record.brands}
                            onChange={(value) =>
                                record.__isNew
                                    ? updateNewRow("brands", value)
                                    : updateEditRow("brands", value)
                            }
                            options={brandsList.map(b => ({
                                value: b.id,
                                label: b.brand
                            }))}
                        />
                    );
                }
                if (!brands) return "";

                const arr = [];
                for (let i = 0; i < brands.length; i++) {
                    arr.push(brands[i].brand);
                }
                return arr.join(", ");
            }
        },
        {
            title: "Дата",
            dataIndex: "dt_parsed",
            width: 160,
            render: (dt) =>
                dt ? new Date(dt).toLocaleString("ru-RU") : ""
        },
        {
            title: "URL",
            dataIndex: "url",
            width: 160,
            ellipsis: true,
            render: (url, record) =>
                record?.__isNew || record?.__isEdit ? (
                    <Input value={record.url}
                           onChange={(e) =>
                               record.__isNew
                                   ? updateNewRow("url", e.target.value)
                                   : updateEditRow("url", e.target.value)
                           }
                    />
                ) : (
                    <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                )
        },
        {
            key: "actions",
            width: 60,
            align: "center",
            render: (_, record) => {

                if (record?.__isNew) {
                    return (
                        <Space>
                            <Button size="small" icon={<SaveOutlined/>} onClick={handleSaveNew}/>
                            <Button size="small" icon={<UndoOutlined/>} onClick={handleUndo}/>
                        </Space>
                    );
                }

                if (record?.__isEdit) {
                    return (
                        <Space size="small">
                            <Button size="small" icon={<SaveOutlined/>} onClick={handleSaveEdit}/>
                            <Button size="small" icon={<UndoOutlined/>} onClick={handleUndoEdit}/>
                        </Space>
                    );
                }

                return (
                    <Space size="small">
                        <Button size="small"
                                icon={<EditOutlined/>}
                                onClick={() => handleEdit(record)}/>

                        <Popconfirm
                            title="Удалить строку?"
                            okText="Удалить"
                            cancelText="Отмена"
                            onConfirm={() => handleDelete(record.id)}
                        >
                            <Button size="small" danger icon={<DeleteOutlined/>}/>
                        </Popconfirm>
                    </Space>
                );
            }
        }
    ];
}
