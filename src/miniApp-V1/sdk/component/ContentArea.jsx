import CapsuleTabsMenu from "./CapsuleTabsMenu.jsx";
import {useEffect, useState} from "react";
import {miniAppConfig} from "../../miniAppConf.jsx";
import {backEndFetch} from "../../api.js";


function ContentArea({theme, menuActiveTab}) {
    const [data, setData] = useState([]);


    useEffect(() => {
        async function fetchData() {

            const config = miniAppConfig[menuActiveTab];
            if (!config || !config.Content || !config.Content.endpointMenu) {
                setData([]);
                return;
            }

            try {
                const result = await backEndFetch(config.Content.endpointMenu);
                setData(result);
            } catch (err) {
                console.error("Ошибка загрузки данных для вкладки:", menuActiveTab, err);
                setData([]);
            }
        }

        void fetchData();
    }, [menuActiveTab]);


    return (
        <CapsuleTabsMenu theme={theme} data={data}/>
    )
}

export default ContentArea;