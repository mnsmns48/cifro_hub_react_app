export function getSelectedPath(data, selectedPathId) {
    if (!Array.isArray(data) || !selectedPathId) return null;
    return data.find(p => p.path_id === selectedPathId) || null;
}

export function getSelectedModel(selectedPath, selectedModelId) {
    if (!selectedPath || !selectedPath.models || !selectedModelId) return null;
    return selectedPath.models.find(m => m.id === selectedModelId) || null;
}

export function getFlatOriginsWithoutPics(data, selectedRowKeys) {
    if (!Array.isArray(data) || !Array.isArray(selectedRowKeys)) return [];

    const result = [];

    data.forEach(path => {
        path.models.forEach(model => {
            model.origins.forEach(origin => {
                const isSelected = selectedRowKeys.includes(origin.origin);
                const noPics = !origin.pics || origin.pics.length === 0;

                if (isSelected && noPics) {
                    result.push({
                        originRef: origin,
                        modelRef: model,
                        pathRef: path
                    });
                }
            });
        });
    });

    return result;
}

// ---------------------------------------------
// 4. Первичная инициализация selectedRowKeys
//    по analyze.verdict === true
// ---------------------------------------------
export function getSelectedRowKeysFromVerdict(data) {
    if (!Array.isArray(data)) return [];

    return data.flatMap(path =>
        path.models.flatMap(model =>
            model.origins
                .filter(o => o.analyze?.verdict === true)
                .map(o => o.origin)
        )
    );
}
