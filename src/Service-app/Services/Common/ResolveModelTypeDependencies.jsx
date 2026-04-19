import SmartPhone from "../../../Cifrotech-app/components/products/smartPhone.jsx";
import {useEffect, useState} from "react";
import {fetchPostData} from "../SchemeAttributes/api.js";


const FeaturesDependenciesComponent = ({prosCons, brand, type, source, info}) => {
    if (!source || !info) {
        return (
            <div style={{padding: 10, color: "red"}}>
                Ошибка: отсутствуют данные для отображения
            </div>
        );
    }

    return <SmartPhone info={{info, source}}/>;
};


const ResolveModelTypeDependencies = ({
                                          origin = null,
                                          features_id = null,
                                          features_title = null,

                                          brand = null,
                                          type = null,
                                          info = null,
                                          source = null,
                                          pros_cons = null,
                                      }) => {

    const [data, setData] = useState(null);

    // 1. Если переданы готовые данные — используем их
    useEffect(() => {
        if (brand && type && info && source) {
            setData({
                brand,
                product_type: type,
                info,
                source,
                pros_cons,
            });
        }
    }, [brand, type, info, source, pros_cons]);

    useEffect(() => {
        if (data) return;

        const payload = {};
        if (origin !== null) payload.origin = origin;
        if (features_id !== null) payload.features_id = features_id;
        if (features_title !== null) payload.features_title = features_title;

        if (Object.keys(payload).length === 0) return;

        let isMounted = true;

        fetchPostData("service/features/fetch_product_information", payload)
            .then((res) => {
                if (isMounted) setData(res);
            });

        return () => {
            isMounted = false;
        };
    }, [origin, features_id, features_title, data]);

    if (!data) return null;

    return (
        <FeaturesDependenciesComponent
            brand={data.brand}
            type={data.product_type}
            source={data.source}
            info={data.info}
            prosCons={data.pros_cons}
        />
    );
};



export default ResolveModelTypeDependencies;
