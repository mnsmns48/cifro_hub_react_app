import React, { useState, useEffect, Suspense } from "react";
import { Tabs } from "antd";
import "./ServiceApp.css";
import Spinner from "./Cifrotech-app/components/Spinner.jsx";
import { serviceRegistry } from "./Service-app/serviceRegistry.jsx";

const ServiceApp = () => {
    const [activeKey, setActiveKey] = useState(
        localStorage.getItem("activeTab") || serviceRegistry[0]?.key
    );
    const [loadedComponents, setLoadedComponents] = useState({});

    const loadComponent = (key) => {
        if (loadedComponents[key]) return; // уже загружен

        const registryItem = serviceRegistry.find((s) => s.key === key);
        if (!registryItem) return;

        const LazyComp = React.lazy(registryItem.loader);

        setLoadedComponents((prev) => ({
            ...prev,
            [key]: <LazyComp />
        }));
    };

    useEffect(() => {
        loadComponent(activeKey);
    }, [activeKey]);

    const handleTabChange = (key) => {
        setActiveKey(key);
        localStorage.setItem("activeTab", key);
    };

    const items = serviceRegistry.map((service) => ({
        key: service.key,
        label: (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {service.icon}
                <span>{service.title}</span>
            </div>
        ),
        children: loadedComponents[service.key] ? (
            <Suspense fallback={<Spinner />}>
                {loadedComponents[service.key]}
            </Suspense>
        ) : (
            <div style={{ padding: 20 }}>
                <Spinner />
            </div>
        )
    }));

    return (
        <div className="service-app-container">
            <Tabs
                className="service-app-tabs"
                tabPlacement="left"
                items={items}
                activeKey={activeKey}
                onChange={handleTabChange}
            />
        </div>
    );
};

export default ServiceApp;
