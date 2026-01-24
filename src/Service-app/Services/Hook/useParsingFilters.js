import {useMemo} from "react";

const NO_FEATURE_MARK = "---??---";

export const useParsingFilters = ({
                                      rows,
                                      searchText,
                                      activeFilter,
                                      featureFilter
                                  }) => {
    const filteredData = useMemo(() => {
        const q = searchText.toLowerCase().trim();

        return rows.filter(row => {
            const hasFeatures =
                Array.isArray(row.features_title) &&
                row.features_title.length > 0;

            const hasAttributes =
                row.attributes &&
                Array.isArray(row.attributes.attr_value_ids) &&
                row.attributes.attr_value_ids.length > 0;

            if (activeFilter === "NoAttributes" && hasAttributes) {
                return false;
            }

            if (activeFilter === "noPreview" && row.preview) {
                return false;
            }

            if (activeFilter === "noFeatures" && hasFeatures) {
                return false;
            }

            if (featureFilter.length > 0) {
                const isNoFeatureSelected = featureFilter.includes(NO_FEATURE_MARK);

                if (isNoFeatureSelected && hasFeatures) {
                    return false;
                }

                if (
                    !isNoFeatureSelected &&
                    (
                        !hasFeatures ||
                        !featureFilter.some(f =>
                            row.features_title.includes(f)
                        )
                    )
                ) {
                    return false;
                }
            }

            const titleMatch =
                (row.title ?? "").toLowerCase().includes(q);

            const originMatch =
                String(row.origin).includes(q);

            return titleMatch || originMatch;
        });
    }, [rows, searchText, activeFilter, featureFilter]);

    return {filteredData};
};