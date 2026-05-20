import {Input, Popconfirm} from "antd";
import {CloseOutlined, PlusOutlined} from "@ant-design/icons";
import {buildTreeData} from "./utils.js";
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
    } = ctx;

    const isEditing = node.id === editingKey;

    if (isEditing) {
        return (
            <Input
                value={tempLabel}
                autoFocus
                size="large"
                onChange={e => setTempLabel(e.target.value)}
                onBlur={() => handleSubmitLabel(node.id, tempLabel)}
                onKeyDown={e => {
                    if (e.key === "Escape") setEditingKey(null);
                    if (e.key === "Enter") handleSubmitLabel(node.id, tempLabel);
                }}
                style={{width: "100%"}}
            />
        );
    }

    const formatDateParts = (dateString) => {
        const EMPTY = {date: "", time: "", color: "#999"};
        if (!dateString) return EMPTY;
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return EMPTY;
        const pad = (n) => (n < 10 ? "0" + n : n);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const targetDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const diffDays = Math.floor((today - targetDay) / (1000 * 60 * 60 * 24));

        const color =
            diffDays === 0 ? "#3e9514" :
                diffDays === 1 ? "#bc800a" :
                    "#999";
        return {
            date: `${pad(d.getDate())}.${pad(d.getMonth() + 1)}`,
            time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
            color
        };
    };


    return (
        <div className="treeNodeRow">
            <div className="treeNodeLeft">
            <span className={node.isRoot ? "treeNodeLabel root" : "treeNodeLabel"}
                  onDoubleClick={() => {
                      if (!node.isRoot) {
                          setEditingKey(node.id);
                          setTempLabel(node.label);
                      }
                  }}
            >
                {node.label}
            </span>
                {node.updated_at && (() => {
                    const {date, time, color} = formatDateParts(node.updated_at);
                    return (
                        <span className="treeNodeDate"
                              style={{color}}>
                            <span>{date}</span>
                            <span>{time}</span>
                        </span>
                    );
                })()}
            </div>
            <span className="treeNodeActions">
            <PlusOutlined className="treeIcon"
                          onClick={() => handleAddLevelUI(node)}/>
                {!node.isRoot && (
                    <Popconfirm title="Вы уверены, что хотите удалить уровень?"
                                okText="Да"
                                cancelText="Нет"
                                onConfirm={() => handleDeleteNode(node.id)}
                    >
                        <CloseOutlined className="treeIcon"/>
                    </Popconfirm>
                )}
        </span>
        </div>
    );
};

const TreeDataRender = ({menuData, treeContext}) => {
    if (!treeContext) return [];

    const rawTree = buildTreeData(menuData);

    const buildNodes = nodes => {
        if (!Array.isArray(nodes)) return [];

        return nodes.map(node => ({
            ...node,
            key: node.id.toString(),
            title: renderTreeTitle(node, treeContext),
            updated_at: node.updated_at,
            disableDrag: node.isRoot,
            disableDrop: node.isRoot,
            children: Array.isArray(node.children)
                ? buildNodes(node.children)
                : []
        }));
    };

    return buildNodes(rawTree);
};

export default TreeDataRender;
