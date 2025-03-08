import {monthsMap} from "../../../../utils.js";


const gsmarenaReleaseDate = (features_array) => {
    const getReleaseDate = (item) => {
        const releaseDate = item['Launch']?.['Status'] || null;
        return releaseDate ? extractReleaseDate(releaseDate) : null;
    };
    const extractReleaseDate = (dateStr) => {
        const match = dateStr.match(/Released (\d+), (\w+)/);
        if (match) {
            const year = match[1];
            const month = monthsMap[match[2]];
            return {month, year};
        }
        return null;
    };
    let releaseDate;
    for (const item of features_array) {
        if (!releaseDate) {
            releaseDate = getReleaseDate(item);
        }
        if (releaseDate) {
            break;
        }
    }
    return releaseDate ? {...releaseDate} : null;
}


export default function gsmarena({features_array}) {
    const releaseDateObj = gsmarenaReleaseDate(features_array)
    return (
        <>
            {releaseDateObj?.month && releaseDateObj?.year && (
                <div>
                    Дата выхода: {releaseDateObj.month} {releaseDateObj.year}
                </div>
            )}
        </>

    )
}
