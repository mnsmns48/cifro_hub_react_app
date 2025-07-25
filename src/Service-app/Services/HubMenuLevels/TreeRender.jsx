import { Input, Popconfirm } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { buildTreeData } from "./utils.js";
import "./Css/Tree.css";

const renderTreeTitle = (node, ctx = {}) => {
    const {
        editingKey,
        tempLabel,
        setEditingKey,
        setTempLabel,
        handleSubmitLabel,
        handleDeleteNode,
        handleAddLevelUI,
        handleToggleStockTable,
        activeStockPath
    } = ctx;

    const isEditing = node.id === editingKey;
    const isOpen = activeStockPath === node.id;

    if (isEditing) {
        return (
            <Input
                value={tempLabel}
                autoFocus
                size="small"
                onChange={e => setTempLabel(e.target.value)}
                onBlur={() => handleSubmitLabel(node.id, tempLabel)}
                onKeyDown={e => {
                    if (e.key === "Escape") setEditingKey(null);
                    if (e.key === "Enter") handleSubmitLabel(node.id, tempLabel);
                }}
                style={{ width: "100%" }}
            />
        );
    }

    return (
        <span className="treeNodeRow">
            <span
                className={node.isRoot ? "treeNodeLabel root" : "treeNodeLabel"}
                onDoubleClick={() => {
                    if (!node.isRoot) {
                        setEditingKey(node.id);
                        setTempLabel(node.label);
                    }
                }}
            >
                {node.label}
            </span>

            <span className="treeIcons">
                {!node.isRoot && (
                    <Popconfirm
                        title="Вы уверены, что хотите удалить уровень?"
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={() => handleDeleteNode(node.id)}
                    >
                        <CloseOutlined className="treeIcon" />
                    </Popconfirm>
                )}
                <PlusOutlined className="treeIcon" onClick={() => handleAddLevelUI(node)} />
                {isOpen ? (
                    <ArrowUpOutlined className="treeIcon" onClick={() => handleToggleStockTable(node)} />
                ) : (
                    <ArrowDownOutlined className="treeIcon" onClick={() => handleToggleStockTable(node)} />
                )}
            </span>
        </span>
    );
};

const TreeRender = ({ menuData, treeContext }) => {
    if (!treeContext) return [];

    const rawTree = buildTreeData(menuData);

    const buildNodes = nodes => {
        if (!Array.isArray(nodes)) return [];

        return nodes.map(node => ({
            ...node,
            key: node.id.toString(),
            title: renderTreeTitle(node, treeContext),
            disableDrag: node.isRoot,
            disableDrop: node.isRoot,
            children: Array.isArray(node.children)
                ? buildNodes(node.children)
                : []
        }));
    };

    return buildNodes(rawTree);
};

export default TreeRender;
