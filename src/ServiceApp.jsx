import React, { useState, useEffect } from "react";
import { Spin, Tabs } from "antd";
import "./ServiceApp.css";
import Spinner from "./Cifrotech-app/components/Spinner.jsx";

const CONCURRENCY_LIMIT = 2;

const loadServices = async () => {
    const modules = import.meta.glob("./Service-app/Services/*.jsx");
    const entries = Object.entries(modules);

    const results = [];
    let index = 0;

    const worker = async () => {
        while (index < entries.length) {
            const currentIndex = index++;
            const [path, importer] = entries[currentIndex];

            const module = await importer();
            const Component = module.default;

            const componentTitle =
                Component.componentTitle ||
                path.split("/").pop().replace(".jsx", "");
            const componentIcon = Component.componentIcon || null;

            results[currentIndex] = {
                label: (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {componentIcon && <span>{componentIcon}</span>}
                        <span>{componentTitle}</span>
                    </div>
                ),
                key: String(currentIndex + 1),
                children: (
                    <React.Suspense fallback={<Spin />}>
                        <Component />
                    </React.Suspense>
                ),
            };
        }
    };

    await Promise.all(
        Array.from({ length: CONCURRENCY_LIMIT }, () => worker())
    );

    return results;
};

const ServiceApp = () => {
    const [services, setServices] = useState([]);
    const [activeKey, setActiveKey] = useState(
        localStorage.getItem("activeTab") || "1"
    );

    useEffect(() => {
        loadServices().then(setServices);
    }, []);

    const handleTabChange = (key) => {
        setActiveKey(key);
        localStorage.setItem("activeTab", key);
    };

    return (
        <div className="service-app-container">
            {services.length ? (
                <Tabs
                    className="service-app-tabs"
                    tabPlacement="left"
                    items={services}
                    activeKey={activeKey}
                    onChange={handleTabChange}
                />
            ) : (
                <div style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000}}>
                    <Spinner/>
                </div>
            )}
        </div>
    );
};

export default ServiceApp;