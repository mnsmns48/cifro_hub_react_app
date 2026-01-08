import {Segmented} from 'antd';
import {useState} from "react";
import TabKeys from "./TabKeys.jsx";
import TabAttributeValues from "./TabAttributeValues.jsx";
import TabTypesDependencies from "./TabTypesDependencies.jsx";
import TabModelsDependencies from "./TabModelsDependencies.jsx";
import FormulaList from "./FormulaList.jsx";



const renderTabContent = (tab) => {
    switch (tab) {
        case "keys":
            return <TabKeys/>;
        case "attrs":
            return <TabAttributeValues/>;
        case "link_types":
            return <TabTypesDependencies/>;
        case "links_model":
            return <TabModelsDependencies/>;
        case "formula_list":
            return <FormulaList/>;
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
        {label: "Формулы", value: "formula_list"},
    ]

    return (<div style={{padding: 16}}>
        <Segmented value={tab} onChange={setTab} options={options} style={{marginBottom: 12}}/>
        {renderTabContent(tab)}
    </div>);
};

export default AttributesMain;
