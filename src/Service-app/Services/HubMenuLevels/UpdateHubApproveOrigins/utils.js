export const buildReadonlyRowSelection = ({
                                              selectedRowKeys
                                          }) => {

    return {
        selectedRowKeys,
        preserveSelectedRowKeys: true,
        columnWidth: "2%",
        onChange: () => {
        },
        renderCell: () => null
    };
};


export const getOriginRowClassName = (record, selectedRowKeys) => {

    const isSelected =
        selectedRowKeys.includes(record.origin);

    const hasPics =
        Array.isArray(record.pics)
        && record.pics.length > 0;

    if (isSelected && !hasPics) {
        return "row-selected-no-pics";
    }

    if (isSelected) {
        return "row-selected";
    }

    return "";
};

export const buildInteractiveRowSelection = ({selectedRowKeys, setSelectedRowKeys}) => {

    return {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
        preserveSelectedRowKeys: true,
        columnWidth: "2%"
    };
};

export const getSelectedPath = (data, pathId) => {
    return data.find(p => p.path_id === pathId) || null;
};


export const getSelectedModel = (path, modelId) => {
    return path?.models.find(m => m.id === modelId) || null;
};


export const getOriginById = (data, originId) => {
    for (const path of data) {
        for (const model of path.models) {

            const origin = model.origins.find(
                o => o.origin === originId
            );

            if (origin) {
                return {
                    origin,
                    model,
                    path
                };
            }
        }
    }

    return null;
};


export const computeSelectedRowKeys = (data) => {
    const keys = [];

    data.forEach(path => {
        path.models.forEach(model => {
            model.origins.forEach(origin => {

                if (origin.analyze?.verdict === true) {
                    keys.push(origin.origin);
                }

            });
        });
    });

    return keys;
};


export const getOriginsWithoutPics = ({data, selectedRowKeys}) => {

    const result = [];

    data.forEach(path => {
        path.models.forEach(model => {
            model.origins.forEach(origin => {

                const noPics =
                    !origin.pics
                    || origin.pics.length === 0;

                const selected =
                    selectedRowKeys.includes(origin.origin);

                if (selected && noPics) {

                    result.push({
                        ...origin,
                        path_id: path.path_id,
                        model_id: model.id,
                        model_title: model.title,
                        route: path.route
                    });

                }

            });
        });
    });

    return result;
};


export const buildHubStockPayload = ({data, selectedRowKeys}) => {

    const items = [];

    data.forEach(path => {

        path.models.forEach(model => {

            model.origins
                .filter(o => {
                    return selectedRowKeys.includes(o.origin);
                })
                .forEach(origin => {

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

                });

        });

    });

    return items;
};