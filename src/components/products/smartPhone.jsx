import React, {Suspense} from "react";


function shortSmartPhoneSpecification(info, source) {
    const MyComponent  = React.lazy(() => import(`./description_sources/${source}.jsx`));
    return (
        <Suspense fallback={<div>Обновление...</div>}>
            <MyComponent features_array={info} />
        </Suspense>
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
