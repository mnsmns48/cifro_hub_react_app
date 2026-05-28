export function findOrigin(data, originId) {
    for (const path of data) {
        for (const model of path.models) {
            const found = model.origins.find(o => o.origin === originId);
            if (found) {
                return {
                    origin: found,
                    model,
                    path
                };
            }
        }
    }
    return null;
}

export function updatePathInData(data, updatedPath) {
    return data.map(path =>
        path.path_id === updatedPath.path_id
            ? updatedPath
            : path
    );
}


export function updateOriginInData(data, originId, newPics) {
    return data.map(path => ({
        ...path,
        models: path.models.map(model => ({
            ...model,
            origins: model.origins.map(origin =>
                origin.origin === originId
                    ? {...origin, pics: newPics}
                    : origin
            )
        }))
    }));
}

export function buildHubStockPayload(data, selectedRowKeys) {
    const items = [];
    const paths = Array.isArray(data) ? data : Object.values(data);

    paths.forEach(path => {
        path.models.forEach(model => {
            model.origins.forEach(origin => {
                if (selectedRowKeys.includes(origin.origin)) {
                    items.push({
                        path_id: path.path_id,
                        hub_item: {
                            origin: origin.origin,
                            vsl_id: origin.vsl_id,
                            title: origin.title,
                            warranty: origin.warranty,
                            input_price: origin.input_price,
                            output_price: origin.output_price,
                            dt_parsed: origin.dt_parsed,
                            model_title: model.title,
                            profit_range: origin.profit_range
                        }
                    });
                }
            });
        });
    });

    return items;
}
