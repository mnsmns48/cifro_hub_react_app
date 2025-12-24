import {Segmented} from 'antd';
import {useState} from "react";
import KeysTab from "./KeysTab.jsx";


const renderTabContent = (tab) => {
    switch (tab) {
        case "keys":
            return <KeysTab/>;
        case "attrs":
            return (<div> Здесь будут все атрибуты </div>);
        case "link_types":
            return (<div> Здесь будут зависимости атрибутов от типов продуктов </div>);
        case "links_model":
            return (<div> Здесь будут зависимости атрибутов от моделей </div>);
        default:
            return null;
    }
};

const TabAttributes = () => {
    const [tab, setTab] = useState(null);

    const options = [
        {label: "Ключи", value: "keys"},
        {label: "Атрибуты", value: "attrs"},
        {label: "Зависимости типов", value: "link_types"},
        {label: "Зависимости моделей", value: "links_model"},
    ]

    return (<div style={{padding: 16}}>
        <Segmented value={tab} onChange={setTab} options={options} style={{marginBottom: 24}}/>

        {renderTabContent(tab)}
    </div>);
};

export default TabAttributes;
