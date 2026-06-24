import {useState} from "react";
import axios from "axios";
import {Button, Input, Table} from "antd";
import MyModal from "../../../Ui/MyModal.jsx";
import {UrlSelectionTableColumns} from "./UrlSelectionTable.jsx";

const SearchTableSelector = ({
                                 tableData,
                                 refreshTableData,
                                 setSelectedRow,
                                 selectedRowKeys,
                                 setSelectedRowKeys,
                                 isSyncFeatures,
                                 handleAction
                             }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVSL, setSelectedVSL] = useState(null);
    const [editingKey, setEditingKey] = useState(null);
    const [editedValues, setEditedValues] = useState({});
    const [search, setSearch] = useState("");


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

    const handleDeleteConfirm = async () => {
        if (!selectedVSL) return;
        try {
            const response = await axios.delete(`/service/delete_vsl/${selectedVSL.id}`);
            if (response.status !== 200) {
                alert(`Удаление не удалось: статус ${response.status}`);
                return;
            }
            refreshTableData();
        } catch (error) {
            console.error('Ошибка удаления:', error);
            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.response?.statusText ||
                error.message ||
                'Неизвестная ошибка';
            alert(`Ошибка удаления: ${message}`);
        } finally {
            setIsModalOpen(false);
            setSelectedVSL(null);
        }
    };

    const filteredData = search.trim()
        ? tableData.filter(item =>
            item.title?.toLowerCase().includes(search.toLowerCase())
        )
        : tableData;

    return (
        <div>
            <div style={{width:'26.5%'}}>
                <Input
                    placeholder="Поиск по названию..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{marginBottom: 8}}
                    allowClear
                />
            </div>
            <Table
                onRow={(record) => ({
                    onClick: () => {
                        if (Array.isArray(selectedRowKeys) && selectedRowKeys.includes(record.id)) {
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
                    handleAction,
                    isSyncFeatures,
                    showDeleteModal
                })}
                showHeader={false}
                dataSource={filteredData}
                rowKey="id"
                size="small"
                pagination={false}
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