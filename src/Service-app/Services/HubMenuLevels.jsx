import {useEffect, useState} from "react";
import {Tree, Spin, Input, message} from "antd";
import {fetchHubLevels, renameHubLevel, updateHubItemPosition} from "./HubMenuLevels/api.js";

function buildTree(
    data,
    parentId = 0,
    editingKey,
    tempLabel,
    setEditingKey,
    setTempLabel,
    handleRename
) {
    return data
        .filter(item => item.parentId === parentId)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(item => {
            const isRoot = item.id === 1;
            const isEditing = editingKey === item.id && !isRoot;

            return {
                key: item.id.toString(),
                title: isEditing ? (
                    <Input
                        value={tempLabel}
                        size="small"
                        autoFocus
                        onChange={e => setTempLabel(e.target.value)}
                        onBlur={() => handleRename(item.id, tempLabel)}
                        onKeyDown={e => {
                            if (e.key === "Escape") {
                                setEditingKey(null);
                            } else if (e.key === "Enter") {
                                handleRename(item.id, tempLabel);
                            }
                        }}
                        style={{ width: "100%" }}
                    />
                ) : (
                    <span
                        onDoubleClick={!isRoot
                            ? () => {
                                setEditingKey(item.id);
                                setTempLabel(item.label);
                            }
                            : undefined
                        }
                        style={{ cursor: isRoot ? "default" : "text" }}
                    >
            {item.label}
          </span>
                ),
                children: buildTree(
                    data,
                    item.id,
                    editingKey,
                    tempLabel,
                    setEditingKey,
                    setTempLabel,
                    handleRename
                ),
                disableDrag: isRoot,
                disableDrop: isRoot
            };
        });
}

const HubMenuLevels = () => {
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingKey, setEditingKey] = useState(null);
    const [tempLabel, setTempLabel] = useState("");

    useEffect(() => {
        fetchHubLevels().then(data => {
            const normalized = data.map(item => ({
                ...item,
                parentId: item.parent_id ?? 0
            }));
            setMenuData(normalized);
            setLoading(false);
        });
    }, []);

    const handleRename = async (id, newLabel) => {
        if (id === 1) return;
        setEditingKey(null);
        if (!newLabel.trim()) return;

        const response = await renameHubLevel(id, newLabel.trim());
        if (response.status === "renamed") {
            setMenuData(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, label: response.new_label } : item
                )
            );
            message.success("Название обновлено");
        }
    };

    const onDrop = async info => {
        const dragId = parseInt(info.dragNode.key, 10);
        const dropId = parseInt(info.node.key, 10);
        const dropPos = info.dropPosition;

        // 1) Запрет вложения на сам узел (dropToGap=false & dropPos=0)
        if (!info.dropToGap && dropPos === 0) {
            message.warning("Вложение запрещено");
            return;
        }

        // 2) Находим исходный dragNode
        const dragNode = menuData.find(n => n.id === dragId);
        if (!dragNode) {
            message.error("Перемещаемый узел не найден");
            return;
        }

        // 3) Всегда сохраняем родительский уровень dragNode (чтобы не менять уровень)
        const newParentId = dragNode.parentId;

        // 4) Собираем всех соседей этого уровня
        const sameLevel = menuData
            .filter(n => n.parentId === newParentId)
            .sort((a, b) => a.sort_order - b.sort_order);

        // 5) Убираем dragNode из списка
        const filtered = sameLevel.filter(n => n.id !== dragId);

        // 6) Ищем индекс узла, относительно которого падаем
        //    Если dropId не найден (drop над первым элементом), baseIndex = 0
        const baseIndex = Math.max(
            filtered.findIndex(n => n.id === dropId),
            0
        );

        // 7) Решаем, вставляем ли перед (dropPos<0) или после (dropPos>0)
        const insertionIndex = dropPos < 0
            ? baseIndex      // перед
            : baseIndex + 1; // после

        // 8) Формируем новый порядок
        const reordered = [...filtered];
        reordered.splice(insertionIndex, 0, dragNode);

        // 9) Вычисляем afterId: узел слева от dragNode, или null если он первый
        const dragIndex = reordered.findIndex(n => n.id === dragId);
        const afterId = dragIndex > 0 ? reordered[dragIndex - 1].id : null;

        // 10) Отправляем на бэкенд
        const response = await updateHubItemPosition(dragId, newParentId, afterId);

        if (response.status === "updated") {
            message.success("Позиция обновлена");

            // 11) Перезапрашиваем дерево для корректных sort_order
            const fresh = await fetchHubLevels();
            setMenuData(
                fresh.map(item => ({
                    ...item,
                    parentId: item.parent_id ?? 0
                }))
            );
        } else {
            message.error("Ошибка при обновлении позиции");
        }
    };


    return loading ? (
        <div style={{ padding: 24, textAlign: "center" }}>
            <Spin tip="Загрузка уровней" size="large" />
        </div>
    ) : (
        <Tree
            draggable
            blockNode
            treeData={buildTree(menuData, 0, editingKey, tempLabel, setEditingKey, setTempLabel, handleRename)}
            onDrop={onDrop}
        />
    );
};

HubMenuLevels.componentTitle = "Структура Хаба";
HubMenuLevels.componentIcon = <img src="/ui/levels.png" alt="icon" width="30" height="30" />;
export default HubMenuLevels;
