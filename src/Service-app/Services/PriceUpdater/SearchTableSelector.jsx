import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Input, Select, Table, Tooltip} from "antd";
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
    const [defaultVSL, setDefaultVSL] = useState(null);

    useEffect(() => {
        const def = tableData.find(item => item.is_default);
        setDefaultVSL(def?.id || null);
    }, [tableData]);


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
            <div style={{display: 'flex', gap: '12px', marginBottom: 8, alignItems: 'center'}}>

                <div style={{width: '26.5%'}}>
                    <Input placeholder="Поиск по названию..."
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           allowClear
                    />
                </div>

                <div style={{display: 'flex', alignItems: 'center', width: '26.5%', gap: '8px'}}>

                    <Tooltip title="Сюда попадают несортированные товары" placement="top">
                <span style={{fontSize: '0.85em', color: '#555', whiteSpace: 'nowrap', cursor: 'pointer'}}>
                    ⚠️ Несортированные
                </span>
                    </Tooltip>

                    <Select placeholder="Выбрать"
                            value={defaultVSL}
                            onChange={async (value) => {
                                await axios.post(`/service/set_default_vsl/${value}`);
                                setDefaultVSL(value);
                                refreshTableData();
                            }}
                            style={{flexGrow: 1}}
                            options={tableData.map(item => ({
                                label: item.title,
                                value: item.id
                            }))}
                    />
                </div>

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
                showHeader={true}
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