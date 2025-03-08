import {monthsMap} from "../../../../utils.js";

const nanoreviewReleaseDate = (features_array) => {
    let releaseDate;
    for (const item of features_array) {
        switch (true) {
            case !!item['Другое']?.['Дата выхода']:
                releaseDate = item['Другое']['Дата выхода'];
                break;
            case !!item['Other']?.['Release date']:
                releaseDate = item['Other']['Release date'];
                break;
        }
    }
    const regex = /(?:([а-яА-Я]+)\s(\d{4})|([a-zA-Z]+)\s(\d{4}))/;
    const match = releaseDate.match(regex);
    if (match) {
        const russianMonth = match[1];
        const year = match[2] || match[4];
        const normalizedMonth = russianMonth ? monthsMap[russianMonth] : monthsMap[match[3]];
        return releaseDate ? {month: normalizedMonth, year: year} : null;
    }
}


export default function nanoreview({features_array}) {
    const releaseDateObj = nanoreviewReleaseDate(features_array)
    console.log(JSON.stringify(features_array))
    return (
        <>
            {releaseDateObj['month'] && releaseDateObj['year'] && (
                <div>
                    Дата выхода: {releaseDateObj['month']} {releaseDateObj['year']}
                </div>)}
        </>

    )
}
