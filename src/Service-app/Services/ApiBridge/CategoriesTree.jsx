import { useEffect, useState } from "react";
import { Tree } from "antd";
import { fetchGetData } from "../Common/api.js";

const CategoriesTree = ({
                            vendorId,
                            vendorFunction,
                            onSelectCategory,
                            onStartLoading
                        }) => {
    const [treeData, setTreeData] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [loadingNodes, setLoadingNodes] = useState(new Set());

    const mapCategory = (cat) => ({
        title: cat.name,
        key: String(cat.categoryId),
        categoryId: cat.categoryId,
        isLeaf: false,
        children: null
    });

    const updateTreeData = (nodes, targetKey, children) => {
        return nodes.map((node) => {
            if (node.key === targetKey) {
                return {
                    ...node,
                    children,
                    isLeaf: children.length === 0
                };
            }

            if (node.children) {
                return {
                    ...node,
                    children: updateTreeData(
                        node.children,
                        targetKey,
                        children
                    )
                };
            }

            return node;
        });
    };

    const findPath = (nodes, targetKey, path = []) => {
        for (const node of nodes) {
            const currentPath = [...path, node.key];

            if (node.key === targetKey) {
                return currentPath;
            }

            if (node.children?.length) {
                const result = findPath(
                    node.children,
                    targetKey,
                    currentPath
                );

                if (result) {
                    return result;
                }
            }
        }

        return null;
    };

    const loadRoot = async () => {
        const data = await fetchGetData(
            `/service/${vendorFunction}/vendors/${vendorId}/categories`
        );

        if (data.status === "ok") {
            setTreeData(data.categories.map(mapCategory));
            setExpandedKeys([]);
        }
    };

    const loadChildren = async (node) => {
        if (loadingNodes.has(node.key)) {
            return [];
        }

        setLoadingNodes((prev) => {
            const next = new Set(prev);
            next.add(node.key);
            return next;
        });

        try {
            const data = await fetchGetData(
                `/service/${vendorFunction}/vendors/${vendorId}/categories?parentId=${node.key}`
            );

            const children =
                data.status === "ok"
                    ? data.categories.map(mapCategory)
                    : [];

            setTreeData((prev) =>
                updateTreeData(prev, node.key, children)
            );

            return children;
        } finally {
            setLoadingNodes((prev) => {
                const next = new Set(prev);
                next.delete(node.key);
                return next;
            });
        }
    };

    useEffect(() => {
        if (vendorId && vendorFunction) {
            void loadRoot();
        }
    }, [vendorId, vendorFunction]);

    const handleSelect = async (_, info) => {
        const node = info.node;

        // путь от корня до выбранного узла
        let path = findPath(treeData, node.key) || [node.key];

        // дети ещё не загружены
        if (node.children === null) {
            const children = await loadChildren(node);

            path = findPath(treeData, node.key) || path;

            // раскрываем только текущую цепочку
            setExpandedKeys(path);

            // лист → грузим товары
            if (children.length === 0) {
                onStartLoading?.();
                onSelectCategory?.(node.categoryId);
            }

            return;
        }

        // лист → грузим товары
        if (node.isLeaf) {
            onStartLoading?.();
            onSelectCategory?.(node.categoryId);
            return;
        }

        // не лист → оставляем открытой только текущую цепочку
        setExpandedKeys(path);
    };

    return (
        <Tree
            treeData={treeData}
            expandedKeys={expandedKeys}
            selectedKeys={[]}
            onSelect={handleSelect}
            showIcon={false}
            switcherIcon={null}
            selectable
        />
    );
};

export default CategoriesTree;