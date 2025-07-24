import {Input, Popconfirm} from "antd";
import { buildTreeData } from "./utils.js";
import {ArrowDownOutlined, ArrowUpOutlined, CloseOutlined, PlusOutlined} from "@ant-design/icons";
import "./Css/Tree.css";

const renderTreeTitle = (
    node,
    editingKey,
    tempLabel,
    setEditingKey,
    setTempLabel,
    handleSubmitLabel,
    onDelete,
    onAddLevel,
    onToggleStock,
    activeStockPath
) => {
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
                onConfirm={() => onDelete(node.id)}
            >
                <CloseOutlined className="treeIcon" />
            </Popconfirm>
        )}

          <PlusOutlined
              className="treeIcon"
              onClick={() => onAddLevel(node)}
          />

          {isOpen ? (
              <ArrowUpOutlined
                  className="treeIcon"
                  onClick={() => onToggleStock(node)}
              />
          ) : (
              <ArrowDownOutlined
                  className="treeIcon"
                  onClick={() => onToggleStock(node)}
              />
          )}
      </span>
    </span>
    );
};

const TreeRender = (
    menuData,
    editingKey,
    tempLabel,
    setEditingKey,
    setTempLabel,
    handleSubmitLabel,
    handleDeleteNode,
    handleAddLevelUI,
    handleToggleStock,
    activeStockPath
) => {
    const rawTree = buildTreeData(menuData);

    const recurse = nodes =>
        nodes.map(node => ({
            ...node,
            title: renderTreeTitle(
                node,
                editingKey,
                tempLabel,
                setEditingKey,
                setTempLabel,
                handleSubmitLabel,
                handleDeleteNode,
                handleAddLevelUI,
                handleToggleStock,
                activeStockPath
            ),
            disableDrag: node.isRoot,
            disableDrop: node.isRoot,
            children: node.children ? recurse(node.children) : []
        }));

    return recurse(rawTree);
};

export default TreeRender;
