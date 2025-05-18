import {useState} from "react";
import axios from "axios";
import {Button, Input, Table} from "antd";
import {DeleteOutlined, EditOutlined, SaveOutlined} from "@ant-design/icons";
import MyModal from "../../../Ui/MyModal.jsx";


const SearchTableSelector = ({tableData, refreshTableData, setSelectedRow, selectedRowKeys, setSelectedRowKeys}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVSL, setSelectedVSL] = useState(null);
    const [editingKey, setEditingKey] = useState(null);
    const [editedValues, setEditedValues] = useState({});

    const handleRowSelection = (selectedKeys, selectedRows) => {
        setSelectedRowKeys(selectedKeys);
        setSelectedRow(selectedRows[0] || null);
    };

    const handleEdit = (record) => {
        setEditingKey(record.id);
        setEditedValues(record);
    };

    const handleSave = (id) => {
        axios.put(`/service/update_vsl/${id}`, editedValues)
            .then(() => {
                refreshTableData();
                setEditingKey(null);
            })
            .catch(error => console.error('Ошибка обновления:', error));
    };

    const showDeleteModal = (vendor) => {
        setSelectedVSL(vendor);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedVSL) {
            axios.delete(`/service/delete_vsl/${selectedVSL.id}`)
                .then(() => {
                    refreshTableData();
                })
                .catch(error => console.error('Ошибка удаления:', error))
                .finally(() => {
                    setIsModalOpen(false);
                    setSelectedVSL(null);
                });
        }
    };

    const columns = [
        ...Object.keys(tableData[0] || {}).filter(key => key !== "id" && key !== "vendor_id").map(key => ({
            title: key,
            dataIndex: key,
            key,
            render: (text, record) =>
                editingKey === record.id ? (
                    <Input
                        value={editedValues[key] || ''}
                        onChange={(e) => setEditedValues(prev => ({...prev, [key]: e.target.value}))}
                    />
                ) : text
        })),
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => {
                let actionButton;
                if (editingKey === record.id) {
                    actionButton = <Button icon={<SaveOutlined/>} type="link" onClick={() => handleSave(record.id)}/>
                } else {
                    actionButton = <Button icon={<EditOutlined/>} type="link" onClick={() => handleEdit(record)}/>
                }
                return (
                    <div className='search_table_action_buttons'>
                        {actionButton}
                        <Button icon={<DeleteOutlined/>} type="link" danger onClick={() => showDeleteModal(record)}/>
                    </div>)
            }
        }
    ];

    return (
        <div>
            <Table rowSelection={{
                type: 'radio',
                onChange: handleRowSelection,
                selectedRowKeys: selectedRowKeys
            }}
                   onRow={(record) => ({
                       onClick: () => {
                           if (selectedRowKeys.includes(record.id)) {
                               setSelectedRowKeys([]);
                               setSelectedRow(null);
                           } else {
                               setSelectedRowKeys([record.id]);
                               setSelectedRow(record);
                           }
                       }
                   })}
                   columns={columns}
                   dataSource={tableData}
                   rowKey="id"/>
            <MyModal
                isOpen={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                content={`Удаляем ?`}
                danger={true}
                footer={<>
                    <Button type="primary" danger onClick={handleDeleteConfirm}>Удалить</Button>
                    <Button onClick={() => setIsModalOpen(false)}>Отмена</Button>
                </>}
            />
        </div>
    );
};

export default SearchTableSelector;