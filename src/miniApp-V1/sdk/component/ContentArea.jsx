import CapsuleTabsMenu from "./CapsuleTabsMenu.jsx";
import {useCallback, useEffect, useState} from "react";
import {miniAppConfig} from "../../miniAppConf.jsx";
import {getFetch} from "../../api.js";
import CategoryNavigator from "./CategoryNavigator.jsx";
import baseStyles from "../css/base.module.css";
import BreadCrumbs from "./Breadcrumbs.jsx";
import CollectionView from "./CollectionView.jsx";

function getAllDescendantIds(menuItems, parentId) {
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

    const config = miniAppConfig[barTab];

    useEffect(() => {
        setStack([]);
    }, [capsuleChoice]);

    useEffect(() => {
        async function fetchMenuItems() {

            if (!config || !config.Content || !config.Content.endpointMenu) {
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
            // 1. Проверка конфига
            if (!config?.Content?.endpointProducts) {
                setProductItems([]);
                setDuration(0);
                return;
            }

            // 2. Проверка стека
            if (!stack.length) {
                setProductItems([]);
                setDuration(0);
                return;
            }

            // 3. Last ID
            const lastId = stack.at(-1)?.id;
            if (lastId == null) {
                setProductItems([]);
                setDuration(0);
                return;
            }

            // 4. Получаем все id пути
            const pathIds = getAllDescendantIds(menuItems, Number(lastId)) || [];

            // 5. Проверка pathIds — обязательная
            if (!Array.isArray(pathIds) || pathIds.length === 0) {
                setProductItems([]);
                setDuration(0);
                return;
            }

            // 6. Делаем запрос
            const result = await getFetch(
                config.Content.endpointProducts,
                { ids: pathIds }
            );

            // 7. Устанавливаем результат
            setProductItems(result?.products || []);
            setDuration(result?.duration_ms || 0);
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
            <CapsuleTabsMenu data={menuItems.filter(item => item.depth === 0)} onTabChange={setCapsuleChoice}/>

            <span style={{fontSize: "2rem", color: "blue", display: "block", textAlign: "center"}}>{duration}</span>

            {capsuleChoice && (
                <div className={baseStyles.centeredContainer}>


                    <BreadCrumbs stack={[{label: capsuleChoice.label}, ...stack]}
                                 onSelect={handleBreadcrumbSelect}
                    />
                </div>
            )}

            <CategoryNavigator data={menuItems} parent={capsuleChoice} stack={stack} onSelect={handleSelect}/>
            <CollectionView items={productItems} onSelect={(item) => console.log(item)}/>
        </>
    )
}

export default ContentArea;