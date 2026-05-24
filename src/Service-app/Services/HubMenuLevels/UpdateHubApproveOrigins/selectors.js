export function getSelectedPath(data, selectedPathId) {
    if (!Array.isArray(data) || !selectedPathId) return null;
    return data.find(p => p?.path_id === selectedPathId) || null;
}

export function getSelectedModel(selectedPath, selectedModelId) {
    if (!selectedPath || !Array.isArray(selectedPath.models) || !selectedModelId) return null;
    return selectedPath.models.find(m => m?.id === selectedModelId) || null;
}

export function getFlatOriginsWithoutPics(data, selectedRowKeys) {
    if (!Array.isArray(data) || !Array.isArray(selectedRowKeys)) return [];

    const result = [];

    data.forEach(path => {
        const models = Array.isArray(path?.models) ? path.models : [];

        models.forEach(model => {
            const origins = Array.isArray(model?.origins) ? model.origins : [];

            origins.forEach(origin => {
                const isSelected = selectedRowKeys.includes(origin?.origin);
                const noPics = !Array.isArray(origin?.pics) || origin.pics.length === 0;

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

export function getSelectedRowKeysFromVerdict(data) {
    if (!Array.isArray(data)) return [];

    return data.flatMap(path =>
        (Array.isArray(path?.models) ? path.models : []).flatMap(model =>
            (Array.isArray(model?.origins) ? model.origins : [])
                .filter(o => o?.analyze?.verdict === true)
                .map(o => o.origin)
        )
    );
}
