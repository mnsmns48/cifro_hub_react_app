import {Display, ReleaseDate} from "./smartPhoneFeature.js";

const shortSpecifications = (features_array, source) => {

    const releaseDateObj = ReleaseDate(features_array)
    const displayObj = Display(features_array)
    return (
        <>
            <p>{releaseDateObj}</p>
            <p>{displayObj}</p>
            <p>{source}</p>
        </>
    )
}

export default function smartPhone({info}) {
    let features_array = [];
    try {
        features_array = JSON.parse(info.info || '[]');
    } catch (error) {
        console.error("Ошибка при парсинге JSON:", error);
        features_array = [];
    }
    return (
        <>
            {shortSpecifications(features_array, info.source)}
        </>
    )
}
