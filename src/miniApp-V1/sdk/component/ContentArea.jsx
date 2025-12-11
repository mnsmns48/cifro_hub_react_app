import CapsuleTabsMenu from "./CapsuleTabsMenu.jsx";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { miniAppConfig } from "../../miniAppConf.jsx";
import { getFetch } from "../../api.js";
import CategoryNavigator from "./CategoryNavigator.jsx";
import baseStyles from "../css/base.module.css";
import BreadCrumbs from "./Breadcrumbs.jsx";
import CollectionView from "./CollectionView.jsx";
import InfoInMain from "./InfoInMain.jsx";
import { AppEnvironmentContext } from "../context.js";
import { useTelegramBackButton } from "../hook/useTelegramBackButton.js";
import ProductRoundGrade from "./ProductRoundGrade.jsx";

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

function ContentArea({ barTab }) {
    const [menuItems, setMenuItems] = useState([]);
    const [capsuleChoice, setCapsuleChoice] = useState(null);
    const [stack, setStack] = useState([]);
    const [duration, setDuration] = useState(0);
    const [productItems, setProductItems] = useState([]);
    const [featuresVisible, setFeaturesVisible] = useState(false);
    const [modelDisplayed, setModelDisplayed] = useState("ALL");

    const config = miniAppConfig[barTab];
    const { tg } = useContext(AppEnvironmentContext);

    // Фетчим меню
    async function fetchMenuItems() {
        if (!config?.Content?.endpointMenu) {
            setMenuItems([]);
            return;
        }
        const result = await getFetch(config.Content.endpointMenu);
        setMenuItems(Array.isArray(result) ? result : []);
    }

    // Фетчим продукты по переданному stack
    async function fetchProductItemsForStack(currentStack) {
        if (!config?.Content?.endpointProducts || !currentStack.length) {
            setProductItems([]);
            setDuration(0);
            return;
        }

        const lastId = currentStack.at(-1)?.id;
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

        const result = await getFetch(config.Content.endpointProducts, { ids: pathIds });
        setProductItems(result?.products || []);
        setDuration(result?.duration_ms || 0);
    }

    useTelegramBackButton(tg, capsuleChoice, stack, setStack, setCapsuleChoice, featuresVisible);

    useEffect(() => {
        setModelDisplayed("ALL");
    }, [capsuleChoice, stack]);

    useEffect(() => {
        setStack([]);
    }, [capsuleChoice]);

    useEffect(() => {
        void fetchMenuItems();
    }, [barTab]);

    useEffect(() => {
        void fetchProductItemsForStack(stack);
    }, [barTab, menuItems, stack, config]);

    const handleSelect = item => {
        setStack(prev => [...prev, { id: String(item.id), label: item.label }]);
    };

    const handleBreadcrumbSelect = useCallback(index => {
        setStack(prev => {
            if (index === 0) return [];
            return prev.slice(0, index);
        });
    }, []);


    const isLeafSelected = useMemo(() => {
        if (!stack.length) return false;
        const lastId = Number(stack.at(-1)?.id);
        const lastItem = menuItems.find(item => item.id === lastId);
        if (!lastItem) return false;
        const hasChildren = menuItems.some(item => item.parent_id === lastId);
        return !hasChildren;
    }, [stack, menuItems]);


    const uniqueModels = useMemo(() => {
        return Array.from(new Set(productItems.map(p => p.model)));
    }, [productItems]);


    const showProductRoundGrade = isLeafSelected && uniqueModels.length > 1;


    const filteredItems = useMemo(() => {
        if (!showProductRoundGrade) return productItems;
        if (modelDisplayed === "ALL") return productItems;
        if (modelDisplayed === "NO_MODEL") return productItems.filter(p => !p.model);
        return productItems.filter(p => p.model === modelDisplayed);
    }, [modelDisplayed, productItems, showProductRoundGrade]);


    return (
        <>
            <CapsuleTabsMenu
                data={(menuItems || []).filter(item => item.depth === 0)}
                onTabChange={setCapsuleChoice}
            />

            {capsuleChoice && (
                <div className={baseStyles.centeredContainer}>
                    <BreadCrumbs
                        stack={[{ label: capsuleChoice.label }, ...stack]}
                        onSelect={handleBreadcrumbSelect}
                    />
                </div>
            )}

            {!capsuleChoice && <InfoInMain />}

            <CategoryNavigator
                data={menuItems}
                parent={capsuleChoice}
                stack={stack}
                onSelect={handleSelect}
            />

            {showProductRoundGrade && (
                <ProductRoundGrade
                    productItems={productItems}
                    selectedModel={modelDisplayed}
                    setSelectedModel={setModelDisplayed}
                />
            )}

            <CollectionView
                items={filteredItems}
                featuresVisible={featuresVisible}
                setFeaturesVisible={setFeaturesVisible}
            />
        </>
    );
}

export default ContentArea;
