import CapsuleTabsMenu from "./CapsuleTabsMenu.jsx";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { miniAppConfig } from "../../miniAppConf.jsx";
import { getFetch } from "../../api.js";
import CategoryNavigator from "./CategoryNavigator.jsx";
import baseStyles from "../css/base.module.css";
import contentAreaStyles from "../css/contentarea.module.css";
import BreadCrumbs from "./Breadcrumbs.jsx";
import CollectionView from "./CollectionView.jsx";
import InfoInMain from "./InfoInMain.jsx";
import {AppEnvironmentContext, ThemeContext} from "../context.js";
import { useTelegramBackButton } from "../hook/useTelegramBackButton.js";
import ProductFilterSidebar from "./ProductFilterSidebar.jsx";
import { UnorderedListOutlined } from "@ant-design/icons";
import { Button } from "antd";

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
    const [featuresVisible, setFeaturesVisible] = useState(false);

    const [productState, setProductState] = useState({
        items: [],
        selectedModel: "ALL",
        sidebarOpen: false,
        loadedForStack: false
    });

    const config = miniAppConfig[barTab];
    const { tg } = useContext(AppEnvironmentContext);
    const theme = useContext(ThemeContext);

    async function fetchMenuItems() {
        if (!config?.Content?.endpointMenu) {
            setMenuItems([]);
            return;
        }
        const result = await getFetch(config.Content.endpointMenu);
        setMenuItems(Array.isArray(result) ? result : []);
    }


    async function fetchProductItemsForStack(currentStack) {
        setProductState(prev => ({ ...prev, loadedForStack: false, selectedModel: "ALL" }));

        if (!config?.Content?.endpointProducts || !currentStack.length) {
            setProductState(prev => ({ ...prev, items: [], loadedForStack: true }));
            return;
        }

        const lastId = currentStack.at(-1)?.id;
        if (!lastId) {
            setProductState(prev => ({ ...prev, items: [], loadedForStack: true }));
            return;
        }

        const pathIds = getAllIds(menuItems, Number(lastId));
        if (!pathIds.length) {
            setProductState(prev => ({ ...prev, items: [], loadedForStack: true }));
            return;
        }

        const result = await getFetch(config.Content.endpointProducts, { ids: pathIds });
        setProductState(prev => ({
            ...prev,
            items: result?.products || [],
            loadedForStack: true,
            selectedModel: "ALL"
        }));
    }

    useTelegramBackButton(tg, capsuleChoice, stack, setStack, setCapsuleChoice, featuresVisible);


    useEffect(() => {
        setProductState(prev => ({ ...prev, selectedModel: "ALL" }));
    }, [capsuleChoice, stack]);

    useEffect(() => setStack([]), [capsuleChoice]);
    useEffect(() => { void fetchMenuItems(); }, [barTab]);
    useEffect(() => { void fetchProductItemsForStack(stack); }, [barTab, menuItems, stack, config]);

    const handleSelect = item => setStack(prev => [...prev, { id: String(item.id), label: item.label }]);
    const handleBreadcrumbSelect = useCallback(index => {
        setStack(prev => (index === 0 ? [] : prev.slice(0, index)));
    }, []);

    const isLeafSelected = useMemo(() => {
        if (!stack.length) return false;
        const lastId = Number(stack.at(-1)?.id);
        const lastItem = menuItems.find(item => item.id === lastId);
        if (!lastItem) return false;
        return !menuItems.some(item => item.parent_id === lastId);
    }, [stack, menuItems]);

    const uniqueModels = useMemo(() => {
        return Array.from(new Set(productState.items.map(p => p.model).filter(Boolean)));
    }, [productState.items]);

    const showProductGradeFilter = useMemo(() => {
        return isLeafSelected && productState.loadedForStack && uniqueModels.length > 1;
    }, [isLeafSelected, productState.loadedForStack, uniqueModels]);

    const filteredItems = useMemo(() => {
        if (!showProductGradeFilter) return productState.items;
        if (productState.selectedModel === "ALL") return productState.items;
        if (productState.selectedModel === "NO_MODEL")
            return productState.items.filter(p => !p.model);
        return productState.items.filter(p => p.model === productState.selectedModel);
    }, [productState.items, productState.selectedModel, showProductGradeFilter]);

    return (
        <>
            <CapsuleTabsMenu
                data={(menuItems || []).filter(item => item.depth === 0)}
                onTabChange={setCapsuleChoice}
            />

            {capsuleChoice && (
                <div className={baseStyles.breadcrumbRow}>
                    <BreadCrumbs
                        stack={[{ label: capsuleChoice.label }, ...stack]}
                        onSelect={handleBreadcrumbSelect}
                    />
                    <Button
                        onClick={() =>
                            setProductState(prev => ({ ...prev, sidebarOpen: true }))
                        }
                        className={contentAreaStyles.ProductGradeFilterBtn}
                        disabled={!showProductGradeFilter}
                        style={{ opacity: showProductGradeFilter ? 1 : 0,
                            background: theme.colorCard,
                            color: theme.colorText,
                        }}
                    >
                        <UnorderedListOutlined />
                    </Button>
                </div>
            )}

            {!capsuleChoice && <InfoInMain />}

            <CategoryNavigator
                data={menuItems}
                parent={capsuleChoice}
                stack={stack}
                onSelect={handleSelect}
            />

            {showProductGradeFilter && (
                <ProductFilterSidebar
                    productItems={productState.items}
                    selectedModel={productState.selectedModel}
                    setSelectedModel={model =>
                        setProductState(prev => ({ ...prev, selectedModel: model }))
                    }
                    open={productState.sidebarOpen}
                    setOpen={open =>
                        setProductState(prev => ({ ...prev, sidebarOpen: open }))
                    }
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
