import React, {useState, useEffect} from "react";
import {Spin, Tabs} from "antd";
import './ServiceApp.css'

const loadServices = async () => {
    const modules = import.meta.glob("./Service-app/Services/*.jsx");

    return Promise.all(
        Object.entries(modules).map(async ([path, importer], index) => {
            const module = await importer();
            const Component = module.default;
            const componentTitle = Component.componentTitle || path.split("/").pop().replace(".jsx", "");
            const componentIcon = Component.componentIcon || null;

            return {
                label: (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {componentIcon && <span>{componentIcon}</span>}
                        <span>{componentTitle}</span>
                    </div>
                ),
                key: String(index + 1),
                children: (
                    <React.Suspense fallback={<Spin/>}>
                        <Component/>
                    </React.Suspense>
                )
            };
        })
    );
};

const ServiceApp = () => {
    const [services, setServices] = useState([]);
    const [activeKey, setActiveKey] = useState(localStorage.getItem("activeTab") || "1");

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
                <Tabs className="service-app-tabs"
                      tabPosition="left" items={services} activeKey={activeKey} onChange={handleTabChange}/>
            ) : (
                <Spin/>
            )}
        </div>
    );
};

export default ServiceApp;
