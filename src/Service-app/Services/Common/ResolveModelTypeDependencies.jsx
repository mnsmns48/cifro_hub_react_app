import SmartPhone from "../../../Cifrotech-app/components/products/smartPhone.jsx";
import {useEffect, useState} from "react";
import {fetchPostData} from "../SchemeAttributes/api.js";


const FeaturesDependenciesComponent = ({prosCons, brand, type, source, info}) => {
    if (!info) {
        return (
            <div style={{padding: 10, color: "red"}}>
                Ошибка: отсутствуют данные для отображения
            </div>
        );
    }

    return (
        <>
            <div style={{textAlign: "center", marginBottom: 10}}>
                <div style={{color: "#7FFF00"}}>
                    {source}
                </div>
            </div>
            <SmartPhone info={{info, source}}/>
        </>)
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

    useEffect(() => {
        if (info && source) {
            setData({
                brand,
                product_type: type,
                info,
                source,
                pros_cons,
            });
            return;
        }

        const payload = {};
        if (origin !== null) payload.origin = origin;
        if (features_id !== null) payload.features_id = features_id;
        if (features_title !== null) payload.features_title = features_title;

        if (Object.keys(payload).length === 0) return;


        fetchPostData("service/features/fetch_product_information", payload)
            .then((res) => {
                setData(res);
            });


    }, [
        brand, type, info, source, pros_cons,
        origin, features_id, features_title
    ]);

    if (!data) return null;

    return (
        <FeaturesDependenciesComponent brand={data.brand}
                                       type={data.product_type}
                                       source={data.source}
                                       info={data.info}
                                       prosCons={data.pros_cons}
        />
    );
};


export default ResolveModelTypeDependencies;
