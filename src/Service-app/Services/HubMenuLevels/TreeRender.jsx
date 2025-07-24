import { Input } from "antd";
import { buildTreeData } from "./utils.js";
import { ArrowDownOutlined, CloseOutlined } from "@ant-design/icons";
import "./Css/Tree.css";

const renderTreeTitle = (
    node,
    editingKey,
    tempLabel,
    setEditingKey,
    setTempLabel,
    handleSubmitLabel,
    onDelete,
    onAddLevel
) => {
    const isEditing = node.id === editingKey;

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
            <CloseOutlined
                className="treeIcon"
                onClick={() => onDelete(node.id)}
            />
        )}

          <ArrowDownOutlined
              className="treeIcon"
              onClick={() => onAddLevel(node)}
          />
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
    handleAddLevelUI
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
                handleAddLevelUI
            ),
            disableDrag: node.isRoot,
            disableDrop: node.isRoot,
            children: node.children ? recurse(node.children) : []
        }));

    return recurse(rawTree);
};

export default TreeRender;
