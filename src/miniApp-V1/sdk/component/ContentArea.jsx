import CapsuleTabsMenu from "./CapsuleTabsMenu.jsx";
import {useCallback, useContext, useEffect, useState} from "react";
import {miniAppConfig} from "../../miniAppConf.jsx";
import {getFetch} from "../../api.js";
import CategoryNavigator from "./CategoryNavigator.jsx";
import baseStyles from "../css/base.module.css";
import BreadCrumbs from "./Breadcrumbs.jsx";
import CollectionView from "./CollectionView.jsx";
import InfoInMain from "./InfoInMain.jsx";
import {AppEnvironmentContext} from "../context.js";
import {useTelegramBackButton} from "../hook/useTelegramBackButton.js";


function getAllIds(menuItems, parentId) {
    const ids = [];

    function recurse(id) {
        ids.push(id);
        menuItems
            .filter(item => item.parent_id === id)
            .forEach(child => recurse(child.id));
    }

    recurse(parentId);
    return ids;
}

function ContentArea({barTab}) {
    const [menuItems, setMenuItems] = useState([]);
    const [capsuleChoice, setCapsuleChoice] = useState(null);
    const [stack, setStack] = useState([]);
    const [duration, setDuration] = useState(0);
    const [productItems, setProductItems] = useState([]);
    const [featuresVisible, setFeaturesVisible] = useState(false);

    const config = miniAppConfig[barTab];
    const {tg} = useContext(AppEnvironmentContext)

    async function fetchMenuItems() {
        if (!config?.Content?.endpointMenu) {
            setMenuItems([]);
            return;
        }
        const result = await getFetch(config.Content.endpointMenu);
        setMenuItems(result);
    }

    async function fetchProductItems() {
        if (!config?.Content?.endpointProducts || !stack.length) {
            setProductItems([]);
            setDuration(0);
            return;
        }

        const lastId = stack.at(-1)?.id;
        if (lastId == null) {
            setProductItems([]);
            setDuration(0);
            return;
        }

        const pathIds = getAllIds(menuItems, Number(lastId)) || [];
        if (!Array.isArray(pathIds) || pathIds.length === 0) {
            setProductItems([]);
            setDuration(0);
            return;
        }

        const result = await getFetch(config.Content.endpointProducts, {ids: pathIds});
        setProductItems(result?.products || []);
        setDuration(result?.duration_ms || 0);

    }

    useTelegramBackButton(tg, capsuleChoice, stack, setStack, setCapsuleChoice, featuresVisible);

    useEffect(() => {
        setStack([]);
    }, [capsuleChoice]);

    useEffect(() => {
        void fetchMenuItems();
    }, [barTab]);

    useEffect(() => {
        void fetchProductItems();
    }, [barTab, menuItems, stack, config]);

    const handleSelect = item => {
        setStack(prev => [...prev, {id: String(item.id), label: item.label}]);
    };

    const handleBreadcrumbSelect = useCallback(index => {
        if (index === 0) {
            setStack([]);
        } else {
            setStack(prev => prev.slice(0, index));
        }
    }, []);

    return (
        <>
            <CapsuleTabsMenu data={menuItems.filter(item => item.depth === 0)}
                             onTabChange={setCapsuleChoice}/>

            {capsuleChoice && (
                <div className={baseStyles.centeredContainer}>
                    <BreadCrumbs
                        stack={[{label: capsuleChoice.label}, ...stack]}
                        onSelect={handleBreadcrumbSelect}
                    />
                </div>
            )}

            {!capsuleChoice && <InfoInMain/>}

            <CategoryNavigator data={menuItems}
                               parent={capsuleChoice}
                               stack={stack}
                               onSelect={handleSelect}/>
            <CollectionView items={productItems}
                            featuresVisible={featuresVisible} setFeaturesVisible={setFeaturesVisible}/>

        </>
    );
}

export default ContentArea;