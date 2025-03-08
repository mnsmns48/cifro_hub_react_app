import * as gsmarena from './description_sources/gsmarena';
import * as nanoreview from './description_sources/nanoreview';

const module_sources = {
    gsmarena,
    nanoreview,
};

function shortSmartPhoneSpecification(info, source) {
    const renderShortSmartPhoneSpecification = module_sources[source]?.renderShortSmartPhoneSpecification;
    if (!renderShortSmartPhoneSpecification) {
        return <div>Module not found for source: {source}</div>;
    }
    return (
        <>
            renderShortSmartPhoneSpecification()
        </>
    );
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
            {shortSmartPhoneSpecification(features_array, info.source)}
        </>
    )
}
