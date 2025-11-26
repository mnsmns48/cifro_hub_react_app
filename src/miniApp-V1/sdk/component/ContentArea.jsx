import CapsuleTabsMenu from "./CapsuleTabsMenu.jsx";
import {useCallback, useEffect, useState} from "react";
import {miniAppConfig} from "../../miniAppConf.jsx";
import {getFetch} from "../../api.js";
import CategoryNavigator from "./CategoryNavigator.jsx";
import baseStyles from "../css/base.module.css";
import BreadCrumbs from "./Breadcrumbs.jsx";
import CollectionView from "./CollectionView.jsx";
import {Space, Image} from "antd";
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";
import {useCurrentTheme} from "../theme/useTheme.js";
import InfoInMain from "./InfoInMain.jsx";


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


function ContentArea({barTab, serviceImages, safeInsets}) {
    const [menuItems, setMenuItems] = useState([]);
    const [capsuleChoice, setCapsuleChoice] = useState(null);
    const [stack, setStack] = useState([]);
    const [duration, setDuration] = useState(0);
    const [productItems, setProductItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const config = miniAppConfig[barTab];
    const theme = useCurrentTheme()

    useEffect(() => {
        setStack([]);
    }, [capsuleChoice]);

    useEffect(() => {
        async function fetchMenuItems() {
            if (!config?.Content?.endpointMenu) {
                setMenuItems([]);
                return;
            }
            const result = await getFetch(config.Content.endpointMenu);
            setMenuItems(result);
        }

        void fetchMenuItems();
    }, [barTab]);

    useEffect(() => {
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

            setLoading(true);
            try {
                const result = await getFetch(config.Content.endpointProducts, {ids: pathIds});
                setProductItems(result?.products || []);
                setDuration(result?.duration_ms || 0);
            } finally {
                setLoading(false);
            }
        }

        void fetchProductItems();
    }, [barTab, menuItems, stack, config]);

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
            <CapsuleTabsMenu theme={theme}
                             data={menuItems.filter(item => item.depth === 0)}
                             onTabChange={setCapsuleChoice}
            />

            {capsuleChoice && (
                <div className={baseStyles.centeredContainer}>
                    <BreadCrumbs theme={theme}
                                 stack={[{label: capsuleChoice.label}, ...stack]}
                                 onSelect={handleBreadcrumbSelect}
                    />
                </div>
            )}

            {!capsuleChoice && (
                <InfoInMain serviceImages={serviceImages} safeInsets={safeInsets}/>
            )}

            <CategoryNavigator
                theme={theme}
                data={menuItems}
                parent={capsuleChoice}
                stack={stack}
                onSelect={handleSelect}
            />

            {loading ? (
                <div>
                    <Spinner/>
                </div>
            ) : (
                <CollectionView
                    theme={theme}
                    items={productItems}
                    noImg={serviceImages?.no_img}
                    safeInsets={safeInsets}
                    onSelect={(item) => console.log(item)}
                />
            )}
        </>
    );
}

export default ContentArea;
