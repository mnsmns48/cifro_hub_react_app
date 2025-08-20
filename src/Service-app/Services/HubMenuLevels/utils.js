import ComparisonProgress from "./ComparisonProgress.jsx";

export function buildTreeData(data, parentId = 0) {
    return data
        .filter(item => item.parentId === parentId)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(item => ({
            key: item.id.toString(),
            label: item.label,
            id: item.id,
            parentId: item.parentId,
            sort_order: item.sort_order,
            isRoot: item.id === 1,
            children: buildTreeData(data, item.id)
        }));
}
