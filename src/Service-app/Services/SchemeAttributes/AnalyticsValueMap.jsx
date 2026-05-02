import {useEffect, useState} from "react";
import {
    Button,
    Modal,
    Table,
    InputNumber
} from "antd";
import {
    AppstoreAddOutlined,
    ReloadOutlined,
    SaveOutlined,
    EditOutlined,
    DeleteOutlined
} from "@ant-design/icons";

import EmptyState from "../../../Ui/Empty.jsx";
import {fetchGetData, fetchPostData} from "../Common/api.js";
import {getAnalyticsValueMapColumns} from "./AnalyticsValueMapColumns.jsx";

const AnalyticsValueMap = ({open, onClose, record, onUpdated}) => {
    const [isCreatingValueMapLine, setIsCreatingValueMapLine] = useState(false);

    const [newValueMap, setNewValueMap] = useState({});
    const [valueMapsData, setValueMapsData] = useState([]);
    const [attributeValues, setAttributeValues] = useState([]);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [isBulkUpdateModal, setIsBulkUpdateModal] = useState(false);
    const [bulkMultiplier, setBulkMultiplier] = useState(null);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
        getCheckboxProps: (record) => ({
            disabled: !record.id
        })
    };

    const loadValueMaps = async () => {
        if (!record?.id) return;
        const response = await fetchGetData(`/service/analytics/fetch_value_map/${record.id}`);
        setValueMapsData(response || []);
    };

    useEffect(() => {
        if (open) {
            void loadValueMaps();
        }
    }, [open]);

    const loadAttributeValues = async () => {
        const excludeIds = Array.isArray(valueMapsData)
            ? valueMapsData.map(v => v?.attr_value?.id).filter(Boolean)
            : [];

        const res = await fetchPostData(
            `/service/attributes/get_attribute_values_by_key_and_excludes`,
            {
                key_id: record?.attr_key?.id,
                exclude_value_id_list: excludeIds
            }
        );

        setAttributeValues(res || []);
    };

    // 🔥 Главный фикс: новая строка теперь имеет стабильный id
    const dataSource = isCreatingValueMapLine
        ? [{id: "__new_value_map"}, ...valueMapsData]
        : valueMapsData;

    const handleCreateValueMap = async () => {
        setIsCreatingValueMapLine(true);
        await loadAttributeValues();
        setNewValueMap({attr_value_ids: [], multiplier: null});
    };

    const handleClose = () => {
        setIsCreatingValueMapLine(false);
        setNewValueMap({});
        setAttributeValues([]);
        setValueMapsData([]);
        setSelectedRowKeys([]);
        onClose();
    };

    const saveValueMapCondition =
        isCreatingValueMapLine &&
        Array.isArray(newValueMap.attr_value_ids) &&
        newValueMap.attr_value_ids.length > 0 &&
        newValueMap.multiplier !== null;

    const handleSaveValueMap = async () => {
        const payload = {
            rule_id: record.id,
            attr_value_ids: newValueMap.attr_value_ids,
            multiplier: newValueMap.multiplier
        };

        await fetchPostData("/service/analytics/create_value_map_bulk", payload);
        await loadValueMaps();

        setIsCreatingValueMapLine(false);
        setNewValueMap({});
        onUpdated?.();
    };

    const handleBulkUpdate = async () => {
        const payload = {
            id: selectedRowKeys,
            multiplier: bulkMultiplier
        };

        await fetchPostData("/service/analytics/update_value_map_bulk", payload);
        await loadValueMaps();

        setIsBulkUpdateModal(false);
        setBulkMultiplier(null);
        setSelectedRowKeys([]);
        onUpdated?.();
    };

    const handleBulkDelete = async () => {
        const payload = {ids: selectedRowKeys};
        await fetchPostData("/service/analytics/delete_value_map_bulk", payload);
        await loadValueMaps();
        setSelectedRowKeys([]);
        onUpdated?.();
    };

    const columns = getAnalyticsValueMapColumns({
        isCreatingValueMapLine,
        attributeValues,
        newValueMap,
        setNewValueMap
    });

    return (
        <Modal open={open} onCancel={handleClose} footer={null} width={600}>
            <div style={{fontWeight: 600, marginBottom: 12, lineHeight: 1.4}}>
                <span>Тип: <strong>{record?.product_type?.type}</strong></span><br/>
                <span>Ключ: <strong>{record?.attr_key?.key}</strong></span><br/>
                <span>Вес: <strong>{record?.weight}</strong></span>
            </div>

            <div style={{display: "flex", gap: 8, marginBottom: 12}}>
                <Button icon={<AppstoreAddOutlined/>} onClick={handleCreateValueMap}/>
                <Button icon={<ReloadOutlined/>} onClick={loadValueMaps}/>

                {saveValueMapCondition && (
                    <Button
                        icon={<SaveOutlined/>}
                        color="cyan"
                        variant="solid"
                        onClick={handleSaveValueMap}
                    />
                )}

                {selectedRowKeys.length > 0 && !isCreatingValueMapLine && (
                    <>
                        <Button
                            color="cyan"
                            variant="solid"
                            icon={<EditOutlined/>}
                            onClick={() => setIsBulkUpdateModal(true)}
                        />

                        <Button
                            color="red"
                            variant="solid"
                            icon={<DeleteOutlined/>}
                            onClick={handleBulkDelete}
                        />
                    </>
                )}
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                size="small"
                rowSelection={rowSelection}
                locale={{emptyText: <EmptyState/>}}
            />

            {isBulkUpdateModal && (
                <Modal
                    open={true}
                    title="Bulk Update Multiplier"
                    onCancel={() => setIsBulkUpdateModal(false)}
                    onOk={handleBulkUpdate}
                    okText="Save"
                    cancelText="Cancel"
                >
                    <InputNumber
                        style={{width: "100%"}}
                        value={bulkMultiplier}
                        onChange={setBulkMultiplier}
                        min={0}
                        step={0.1}
                        placeholder="Enter new multiplier"
                    />
                </Modal>
            )}
        </Modal>
    );
};

export default AnalyticsValueMap;
