import CapsuleTabsMenu from "./CapsuleTabsMenu.jsx";
import {useCallback, useEffect, useState} from "react";
import {miniAppConfig} from "../../miniAppConf.jsx";
import {backEndFetch} from "../../api.js";
import CategoryNavigator from "./CategoryNavigator.jsx";
import baseStyles from "../css/base.module.css";
import BreadCrumbs from "./Breadcrumbs.jsx";
import {Dropdown} from "antd-mobile";


function ContentArea({barTab}) {
    const [data, setData] = useState([]);
    const [capsuleChoice, setCapsuleChoice] = useState(null);
    const [stack, setStack] = useState([]);

    useEffect(() => {
        setStack([]);
    }, [capsuleChoice]);

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

    const handleSelect = (item) => {
        setStack((p) => [...p, {id: String(item.id), label: item.label}]);
    };

    const handleBreadcrumbSelect = useCallback((index) => {
        if (index === 0) {
            setStack([]);
        } else {
            setStack((prev) => prev.slice(0, index));
        }
    }, []);

    return (
        <>
            <CapsuleTabsMenu data={data.filter(item => item.depth === 0)} onTabChange={setCapsuleChoice}/>

            {capsuleChoice && (
                <div className={baseStyles.centeredContainer}>
                    <BreadCrumbs stack={[{label: capsuleChoice.label}, ...stack]}
                                 onSelect={handleBreadcrumbSelect}
                    />
                </div>
            )}

            <CategoryNavigator data={data} parent={capsuleChoice} stack={stack} onSelect={handleSelect}/>

        </>
    )
}

export default ContentArea;