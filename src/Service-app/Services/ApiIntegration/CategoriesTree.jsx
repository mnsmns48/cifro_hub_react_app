import { useEffect, useState } from "react";
import { Tree } from "antd";
import { fetchGetData } from "../Common/api.js";

const CategoriesTree = ({ vendorId, vendorFunction, onSelectCategory }) => {
    const [treeData, setTreeData] = useState([]);

    const mapCategory = (cat) => ({
        title: cat.name,
        key: String(cat.categoryId),
        categoryId: cat.categoryId,
        isLeaf: false,
    });

    const updateTreeData = (list, key, children) => {
        return list.map(node => {
            if (node.key === key) {
                return {
                    ...node,
                    children,
                    isLeaf: children.length === 0,
                };
            }

            if (node.children) {
                return {
                    ...node,
                    children: updateTreeData(node.children, key, children),
                };
            }

            return node;
        });
    };

    const loadRoot = async () => {
        const data = await fetchGetData(
            `/service/${vendorFunction}/vendors/${vendorId}/categories`
        );

        if (data.status === "ok") {
            setTreeData(data.categories.map(mapCategory));
        }
    };

    const loadChildren = async (node) => {
        const data = await fetchGetData(
            `/service/${vendorFunction}/vendors/${vendorId}/categories?parentId=${node.key}`
        );

        if (data.status !== "ok") return;

        const children = data.categories.map(mapCategory);

        setTreeData(prev =>
            updateTreeData(prev, node.key, children)
        );
    };

    useEffect(() => {
        if (vendorId && vendorFunction) void loadRoot();
    }, [vendorId, vendorFunction]);

    return (
        <Tree
            treeData={treeData}
            loadData={loadChildren}
            onSelect={(keys, info) => {
                if (info.node.isLeaf) {
                    onSelectCategory(info.node.categoryId);
                }
            }}


        />
    );
};


export default CategoriesTree;