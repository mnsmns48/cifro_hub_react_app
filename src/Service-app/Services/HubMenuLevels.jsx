import {useEffect, useState, useCallback, useMemo} from "react";
import {Tree, Spin, Button, Row, Col} from "antd";
import {
    addHubLevel, deleteHubLevel, fetchHubLevels, renameHubLevel, updateHubItemPosition
} from "./HubMenuLevels/api.js";
import StockHubItemsTable from "./HubMenuLevels/StockHubItemsTable.jsx";
import TreeDataRender from "./HubMenuLevels/TreeRender.jsx";
import {
    DownOutlined,
    FolderOpenOutlined,
    FolderOutlined,
    ReloadOutlined,
    UpOutlined,
} from "@ant-design/icons";
import VslUpdateComponent from "./HubMenuLevels/VslUpdateComponent.jsx";
import {fetchRangeRewardsProfiles} from "./RewardRangeSettings/api.js";
import "./HubMenuLevels/Css/VslUpdate.css";
import StockHubSimplified from "./HubMenuLevels/StockHubSimplified.jsx";
import {fetchPostData} from "./Common/api.js";
import RawOriginsComponent from "./HubMenuLevels/RawOriginsComponent.jsx";


const HubMenuLevels = ({
                           onSelectPath = () => {
                           }, inHubOption = false, compareElements = []
                       }) => {

    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingKey, setEditingKey] = useState(null);
    const [tempLabel, setTempLabel] = useState("");
    const [activePathId, setActivePathId] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [vslUpdateModalVisible, setVslUpdateModalVisible] = useState(false);
    const [priceSyncList, setPriceSyncList] = useState([]);
    const [ProfitRangesProfiles, setProfitRangesProfiles] = useState([]);
    const [rawOriginsVisible, setRawOriginsVisible] = useState(false);


    const loadLevels = useCallback(async () => {
        const data = await fetchHubLevels();
        const profiles = await fetchRangeRewardsProfiles();
        setProfitRangesProfiles(profiles)
        setMenuData(data.map(item => ({
            ...item,
            parentId: item.parent_id ?? 0
        })));
        setLoading(false);
    }, []);

    useEffect(() => {
        void loadLevels();
    }, [loadLevels]);


    const handleSelect = useCallback((selectedKeys) => {
        const key = selectedKeys.length ? parseInt(selectedKeys[0], 10) : null;
        setActivePathId(key);
        setSelectedItems([]);
        onSelectPath(key);

    }, [onSelectPath]);

    const handleSubmitLabel = async (key, newLabel) => {
        setEditingKey(null);
        const trimmed = newLabel.trim();
        if (!trimmed) {
            setMenuData(prev => prev.filter(item => item.id !== key));
            return;
        }

        const placeholder = menuData.find(item => item.id === key && item.isNew);
        if (placeholder) {
            const {status} = await addHubLevel(placeholder.parentId, trimmed);
            if (status === true) await loadLevels();
        } else {
            if (key === 1) return;
            const {status, new_label} = await renameHubLevel(key, trimmed);
            if (status === true) {
                setMenuData(prev =>
                    prev.map(item =>
                        item.id === key ? {...item, label: new_label} : item
                    )
                );
            }
        }
    };

    const handleAddLevelUI = (node) => {
        const nextIndex = menuData.filter(n => n.parentId === node.id).length + 1;
        const newKey = `new-${node.id}-${Date.now()}`;
        setMenuData(prev => [
            ...prev,
            {
                id: newKey,
                parentId: node.id,
                label: "",
                sort_order: nextIndex,
                isNew: true
            }
        ]);
        setTempLabel("");
        setEditingKey(newKey);
    };

    const handleDeleteNode = async (id) => {
        const {status} = await deleteHubLevel(id);
        if (status === true) await loadLevels();
    };

    const onDrop = async (info) => {
        const dragId = parseInt(info.dragNode.key, 10);
        const dropId = parseInt(info.node.key, 10);
        const dropPos = info.dropPosition;

        if (!info.dropToGap && dropPos === 0) return;

        const dragNode = menuData.find(n => n.id === dragId);
        if (!dragNode) return;

        const sameLevel = menuData
            .filter(n => n.parentId === dragNode.parentId)
            .filter(n => n.id !== dragId)
            .sort((a, b) => a.sort_order - b.sort_order);

        const baseIndex = Math.max(sameLevel.findIndex(n => n.id === dropId), 0);
        const insertionIndex = dropPos < 0 ? baseIndex : baseIndex + 1;

        const reordered = [...sameLevel];
        reordered.splice(insertionIndex, 0, dragNode);

        const dragIndex = reordered.findIndex(n => n.id === dragId);
        const afterId = dragIndex > 0 ? reordered[dragIndex - 1].id : null;

        const response = await updateHubItemPosition(dragId, dragNode.parentId, afterId);
        if (response.status === true) await loadLevels();
    };

    const treeContext = {
        editingKey,
        tempLabel,
        setEditingKey,
        setTempLabel,
        handleSubmitLabel,
        handleDeleteNode,
        handleAddLevelUI,
    };

    const treeData = useMemo(() => TreeDataRender({menuData, treeContext}), [menuData, treeContext]);

    const renderTitle = (node) => {
        const isActive = node.key === activePathId;

        return (
            <div style={{
                padding: "4px 8px",
                borderRadius: 6,
                background: isActive ? "#e6f7ff" : "transparent",
                color: isActive ? "#1677ff" : "inherit",
                fontWeight: isActive ? 600 : 400,
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                width: "100%"
            }}
            >
                {node.children?.length > 0 ? (
                    <FolderOpenOutlined style={{color: "#1677ff"}}/>
                ) : (
                    <FolderOutlined style={{color: "#999"}}/>
                )}
                {node.title}
            </div>
        );
    };


    const switcherIcon = (props) => {
        const {expanded, data} = props;

        if (!data.children || data.children.length === 0) {
            return <DownOutlined style={{fontSize: 12}}/>;
        }

        return expanded ? (
            <UpOutlined style={{fontSize: 12}}/>
        ) : (
            <DownOutlined style={{fontSize: 12}}/>
        );
    };


    const handleUpdateDataBtn = async () => {
        if (!activePathId) return;
        const origins = selectedItems.map(item => item.origin);
        try {
            const payload = {path_id: activePathId, origins: origins};
            const result = await fetchPostData("/service/start_price_sync_process", payload);
            setPriceSyncList(result);
            setVslUpdateModalVisible(true);
        } catch (error) {
            setPriceSyncList(error.message);
            setVslUpdateModalVisible(true);
        }
    };


    return loading ? (
        <div style={{padding: 24, textAlign: "center"}}>
            <Spin size="small"/>
        </div>
    ) : (
        <>
            <div
                style={{
                    marginBottom: "10px",
                    visibility: activePathId && inHubOption === false ? "visible" : "hidden",
                    pointerEvents: activePathId && inHubOption === false ? "auto" : "none"
                }}
            >
                <Button
                    type="primary"
                    icon={<ReloadOutlined/>}
                    onClick={handleUpdateDataBtn}
                    className="comparison-button"
                    disabled={activePathId == null}
                >
                    Обновить данные
                </Button>
            </div>

            <Row gutter={16}>
                <Col span={8}>
                    <Tree
                        draggable
                        blockNode
                        defaultExpandAll
                        treeData={treeData}
                        onSelect={handleSelect}
                        onDrop={onDrop}
                        showLine={false}
                        switcherIcon={switcherIcon}
                        titleRender={renderTitle}
                    />
                </Col>

                <Col span={16}
                     style={{
                         maxHeight: "calc(100vh - 20px)",
                         overflowY: "auto",
                         position: "relative",
                         paddingRight: 10
                     }}
                >
                    {activePathId != null && (
                        inHubOption === true ? (
                            <StockHubSimplified pathId={activePathId} existingItems={compareElements}/>
                        ) : (
                            <StockHubItemsTable pathId={activePathId}
                                                selectedRowKeys={[]}
                                                onSelectedOrigins={setSelectedItems}
                                                profit_profiles={ProfitRangesProfiles}/>
                        )
                    )}
                </Col>
            </Row>


            {priceSyncList.length > 0 && !inHubOption && (
                <VslUpdateComponent
                    isOpen={vslUpdateModalVisible}
                    onClose={() => setVslUpdateModalVisible(false)}
                    priceSyncList={priceSyncList}
                    onStepbystep={() => {
                        setVslUpdateModalVisible(false);
                        setRawOriginsVisible(true);
                    }}
                />
            )
            }
            {priceSyncList.length > 0 && rawOriginsVisible && (
                <RawOriginsComponent priceSyncList={priceSyncList} isOpen={rawOriginsVisible}
                                     onClose={() => setRawOriginsVisible(false)}
                />
            )
            }
        </>
    )
        ;
};
export default HubMenuLevels;
