import CapsuleTabsMenu from "./CapsuleTabsMenu.jsx";
import {useEffect, useState} from "react";
import {miniAppConfig} from "../../miniAppConf.jsx";
import {backEndFetch} from "../../api.js";
import CategoryNavigator from "./CategoryNavigator.jsx";


function ContentArea({barTab}) {
    const [data, setData] = useState([]);
    const [capsuleChoice, setCapsuleChoice] = useState(null);


    useEffect(() => {
        async function fetchData() {

            const config = miniAppConfig[barTab];
            if (!config || !config.Content || !config.Content.endpointMenu) {
                setData([]);
                return;
            }
            const result = await backEndFetch(config.Content.endpointMenu);
            setData(result);
        }

        void fetchData();
    }, [barTab]);


    return (
        <>
            <CapsuleTabsMenu data={data.filter(item => item.depth === 0)} onTabChange={setCapsuleChoice}/>
            <CategoryNavigator data={data} parent={capsuleChoice} />
        </>
    )
}

export default ContentArea;