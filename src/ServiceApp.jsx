import React, {useState, useEffect, Suspense} from "react";
import {Tabs} from "antd";
import "./ServiceApp.css";
import Spinner from "./Cifrotech-app/components/Spinner.jsx";

const ServiceApp = () => {
    const [services, setServices] = useState([]);
    const [activeKey, setActiveKey] = useState(
        localStorage.getItem("activeTab")
    );

    useEffect(() => {
        requestIdleCallback(() => {
            const metaModules = import.meta.glob(
                "./Service-app/Services/*.jsx",
                {eager: true}
            );

            const lazyModules = import.meta.glob(
                "./Service-app/Services/*.jsx"
            );

            const items = Object.keys(metaModules).map((path) => {
                const serviceKey = path
                    .split("/")
                    .pop()
                    .replace(".jsx", "");

                const meta = metaModules[path].meta || {};
                const LazyComponent = React.lazy(lazyModules[path]);

                return {
                    key: serviceKey,
                    label: (
                        <div style={{display: "flex", alignItems: "center", gap: 8}}>
                            {meta.icon && <>{meta.icon}</>}
                            <span>{meta.title || serviceKey}</span>
                        </div>
                    ),
                    children: (
                        <Suspense fallback={<Spinner />}>
                            <LazyComponent key={activeKey} />
                        </Suspense>
                    )
                };
            });

            setServices(items);

            if (!activeKey && items.length) {
                setActiveKey(items[0].key);
            }
        });
    }, []);

    const handleTabChange = (key) => {
        setActiveKey(key);
        localStorage.setItem("activeTab", key);
    };

    return (
        <div className="service-app-container">
            {services.length && services.find(s => s.key === activeKey) ? (
                <Tabs
                    className="service-app-tabs"
                    tabPlacement="left"
                    items={services}
                    activeKey={activeKey}
                    onChange={handleTabChange}
                />
            ) : (
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1000,
                }}>
                    <Spinner/>
                </div>
            )}
        </div>
    );
};

export default ServiceApp;