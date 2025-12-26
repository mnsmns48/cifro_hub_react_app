import {Segmented} from 'antd';
import {useState} from "react";
import TabKeys from "./TabKeys.jsx";
import TabAttributeValues from "./TabAttributeValues.jsx";


const renderTabContent = (tab) => {
    switch (tab) {
        case "keys":
            return <TabKeys/>;
        case "attrs":
            return <TabAttributeValues/>;
        case "link_types":
            return (<div> Здесь будут зависимости атрибутов от типов продуктов </div>);
        case "links_model":
            return (<div> Здесь будут зависимости атрибутов от моделей </div>);
        default:
            return null;
    }
};

const AttributesMain = () => {
    const [tab, setTab] = useState(null);

    const options = [
        {label: "Ключи", value: "keys"},
        {label: "Атрибуты", value: "attrs"},
        {label: "Зависимости типов", value: "link_types"},
        {label: "Зависимости моделей", value: "links_model"},
    ]

    return (<div style={{padding: 16}}>
        <Segmented value={tab} onChange={setTab} options={options} style={{marginBottom: 12}}/>

        {renderTabContent(tab)}
    </div>);
};

export default AttributesMain;
