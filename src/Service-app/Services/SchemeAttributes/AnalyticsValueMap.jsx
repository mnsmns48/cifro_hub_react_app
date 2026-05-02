import {Button, Modal, Table} from "antd";
import {useEffect, useState} from "react";
import {getAnalyticsValueMapColumns} from "./AnalyticsValueMapColumns.jsx";
import {fetchGetData, fetchPostData} from "../Common/api.js";
import {AppstoreAddOutlined, ReloadOutlined} from "@ant-design/icons";

const AnalyticsValueMap = ({open, onClose, record}) => {
    const [isCreatingValueMapLine, setIsCreatingValueMapLine] = useState(false);
    const [isEditingValueMapId, setIsEditingValueMapId] = useState(null);

    const [newValueMap, setNewValueMap] = useState({});
    const [editValueMap, setEditValueMap] = useState({});

    const [valueMapsData, setValueMapsData] = useState([]);

    const [attributeValues, setAttributeValues] = useState([]);


    const loadValueMaps = async () => {
        if (!record?.id) return;
        const response = await fetchGetData(`/service/analytics/fetch_value_map/${record.id}`);
        setValueMapsData(response || []);
    }

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
                exclude_value_id_list: excludeIds.length > 0 ? excludeIds : []
            }
        );

        setAttributeValues(res || []);
    };


    const columns = getAnalyticsValueMapColumns({
        isCreatingValueMapLine,
        attributeValues,
        newValueMap,
        setNewValueMap
    });

    const dataSource = isCreatingValueMapLine
        ? [{}, ...valueMapsData]
        : valueMapsData;

    const handleCreateValueMap = async () => {
        setIsCreatingValueMapLine(true);
        await loadAttributeValues();
        setNewValueMap({attr_value_ids: [], multiplier: null});
    };


    const handleClose = () => {
        setIsCreatingValueMapLine(false);
        setIsEditingValueMapId(null);

        setNewValueMap({});
        setEditValueMap({});

        setAttributeValues([]);
        setValueMapsData([]);

        onClose();
    };


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
            </div>
            <Table rowKey="id" columns={columns} dataSource={dataSource} pagination={false} size="small"/>
        </Modal>
    );
};

export default AnalyticsValueMap;