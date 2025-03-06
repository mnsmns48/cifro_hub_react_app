import {getMonthAndYear} from "../../../utils.js";


export const ReleaseDate = (features_array) => {
    if (!Array.isArray(features_array) || features_array.length === 0) {
        return "features_array не является массивом или он пуст.";
    }
    let release_date = null;
    for (const item of features_array) {
        switch (true) {
            case !!item['Другое']?.['Дата выхода']:
                release_date = item['Другое']['Дата выхода'];
                break;
            case !!item['Other']?.['Release date']:
                release_date = item['Other']['Release date'];
                break;
            case !!item['Launch']?.['Status']:
                release_date = item['Launch']['Status'];
                break;
        }
        if (release_date) break;
    }
    return release_date ? `Дата выхода: ${getMonthAndYear(release_date)}` : "";
};

export const Display = (features_array) => {
    if (!Array.isArray(features_array) || features_array.length === 0) {
        return "features_array не является массивом или он пуст.";
    }
    let displayProps = null;
    for (const item of features_array) {
        switch (true) {
            case !!item['Display']?.['Type']:
                displayProps = item['Display']['Type'];
                break;
        }
        if (displayProps) break;
    }
    return displayProps ? `Дисплей: ${displayProps}` : "";
};
