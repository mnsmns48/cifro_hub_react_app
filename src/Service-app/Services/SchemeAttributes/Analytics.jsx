import {useEffect, useState} from "react";
import {Button, Card, message, Table, Tooltip} from "antd";
import {fetchGetData, fetchPostData} from "../Common/api.js";
import EmptyState from "../../../Ui/Empty.jsx";
import {getAnalyticsColumns} from "./AnalyticsColumns.jsx";
import {AppstoreAddOutlined, ReloadOutlined} from "@ant-design/icons";
import AnalyticsValueMap from "./AnalyticsValueMap.jsx";

const Analytics = () => {
    const [isCreatingRuleLine, setIsCreatingRuleLine] = useState(false);
    const [isEditingRuleId, setIsEditingRuleId] = useState(null);

    const [newRule, setNewRule] = useState({});
    const [editRule, setEditRule] = useState({});


    const [productTypes, setProductTypes] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [data, setData] = useState([]);

    const [valueMapModalOpen, setValueMapModalOpen] = useState(false);
    const [valueMapRecord, setValueMapRecord] = useState(null);


    useEffect(() => {
        void loadRuleLines();
    }, []);

    const loadRuleLines = () => {
        fetchGetData("/service/analytics/")
            .then((res) => setData(res))
            .catch(() => setData([]));
    };

    const loadProductTypes = async () => {
        const res = await fetchGetData("/service/product/fetch_product_type_list");
        setProductTypes(res);
    };

    const loadAttrKeys = async () => {
        const res = await fetchGetData("/service/attributes/get_attr_keys");
        setAttributes(res);
    };

    const handleUndo = () => {
        setIsCreatingRuleLine(false);
        setIsEditingRuleId(null);
        setNewRule({});
        setEditRule({});
    };


    const handleCreateNewRule = () => {
        void loadProductTypes();
        void loadAttrKeys();
        setNewRule({});
        setIsCreatingRuleLine(true);
    };

    const handleEditStart = async (record) => {
        await loadProductTypes();
        await loadAttrKeys();

        setIsEditingRuleId(record.id);

        setEditRule({
            product_type_id: record.product_type?.id ?? record.product_type_id,
            attr_key_id: record.attr_key?.id ?? record.attr_key_id,
            weight: record.weight,
            description: record.description,
            is_enabled: record.is_enabled
        });
    };


    const handleUpdateRuleLine = async (record) => {
        const payload = {
            id: isEditingRuleId,
            product_type_id: record.product_type_id,
            attr_key_id: record.attr_key_id,
            weight: record.weight,
            description: record.description,
            is_enabled: record.is_enabled
        };

        try {
            const updated = await fetchPostData("/service/analytics/update_rule_line", payload);

            if (updated) {
                setData(prev =>
                    prev.map(r => r.id === updated.id ? updated : r)
                );
            }

            handleUndo();
        } catch (e) {
            message.error(e);
        }
    };


    const handleDeleteRule = async (id) => {
        try {
            await fetchPostData("/service/analytics/delete_rule_line", {id});
            setData(prev => prev.filter(r => r.id !== id));
        } catch (e) {
            message.error(e);
        }
    };


    const handleSaveRuleLine = async (record) => {
        const payload = {
            product_type_id: record.product_type_id,
            attr_key_id: record.attr_key_id,
            weight: record.weight,
            description: record.description,
            is_enabled: record.is_enabled ?? true
        };

        try {
            const created = await fetchPostData("/service/analytics/add_rule_line", payload);
            if (created) {
                setData(prev => [created, ...prev]);
            }
            setIsCreatingRuleLine(false);
        } catch (e) {
            console.error(e);
        }
    };


    const handleToggleSwitch = async (id, value) => {
        const updated = await fetchPostData("/service/analytics/toggle_switch", {
            id,
            is_enabled: value
        });

        setData(prev => prev.map(r => r.id === updated.id ? updated : r));
    };

    const handleOpenValueMapModal = (record) => {
        setValueMapRecord(record);
        setValueMapModalOpen(true);
    };


    return (
        <>
            <Card
                title={
                    <div style={{display: "flex", gap: 8}}>
                        <Tooltip title="Создать правило">
                            <Button icon={<AppstoreAddOutlined/>} onClick={handleCreateNewRule}/>
                        </Tooltip>
                        <Tooltip title="Перезагрузить страницу">
                            <Button icon={<ReloadOutlined/>} onClick={loadRuleLines}/>
                        </Tooltip>
                    </div>
                }
            >
                <Table locale={{emptyText: <EmptyState/>}}
                       rowKey="id"
                       columns={getAnalyticsColumns({
                           isCreatingRuleLine,
                           isEditingRuleId,
                           productTypes,
                           attributes,
                           newRule,
                           setNewRule,
                           editRule,
                           setEditRule,
                           handleEditStart,
                           handleDeleteRule,
                           handleUpdateRuleLine,
                           handleSaveRuleLine,
                           handleUndo,
                           handleToggleSwitch,
                           handleOpenValueMapModal
                       })}
                       dataSource={isCreatingRuleLine ? [{ id: "__new_rule_line" }, ...data] : data}
                       pagination={false}
                />
            </Card>
            <AnalyticsValueMap
                open={valueMapModalOpen}
                onClose={() => setValueMapModalOpen(false)}
                record={valueMapRecord}
                onUpdated={loadRuleLines}
            />
        </>
    );
};

export default Analytics;
