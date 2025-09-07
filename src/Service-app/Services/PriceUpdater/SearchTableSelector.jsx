import {useState} from "react";
import axios from "axios";
import {Button, Table} from "antd";
import MyModal from "../../../Ui/MyModal.jsx";
import {UrlSelectionTableColumns} from "./UrlSelectionTable.jsx";


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
                   columns={UrlSelectionTableColumns({
                       editingKey,
                       editedValues: {
                           title: editedValues.title,
                           url: editedValues.url,
                           set: setEditedValues
                       },
                       handleEdit,
                       handleSave,
                       showDeleteModal
                   })}
                   dataSource={tableData}
                   rowKey="id"
                   rowClassName={() => 'compact-row'}/>
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