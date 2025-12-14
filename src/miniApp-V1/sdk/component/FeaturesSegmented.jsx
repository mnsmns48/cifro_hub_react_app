import {Segmented, Switch} from "antd-mobile";
import {DislikeOutlined, LikeOutlined} from "@ant-design/icons";
import styles from "../css/features.module.css";
import {useContext, useState} from "react";
import {ThemeContext} from "../context.js";
import FeaturesComponentShort from "./Features/FeaturesComponentShort.jsx";
import {getDeviceFeaturesUI} from "./Features/FeatureService.js";
import FeaturesComponentDetailed from "./Features/FeaturesComponentDetailed.jsx";


export default function FeaturesSegmented({features}) {
    const [tab, setTab] = useState("info");
    const [showInfo, setShowInfo] = useState(false);

    const theme = useContext(ThemeContext);

    const prosCons = features?.pros_cons ?? {};
    const info = features?.info ?? [];

    const firstSectionName = info.length > 0 ? Object.keys(info[0])[0] : "";
    const [activeKey, setActiveKey] = useState(firstSectionName);

    const hasPros = Array.isArray(prosCons?.advantage) && prosCons.advantage.length > 0;
    const hasCons = Array.isArray(prosCons?.disadvantage) && prosCons.disadvantage.length > 0;
    const hasInfo = Array.isArray(info) && info.length > 0;

    if (!hasPros && !hasCons && !hasInfo) return null;

    const renderList = (items) => (
        <ul style={{color: theme.colorText}}>
            {items.map((item, idx) => (<li key={idx}>{item}</li>))}
        </ul>
    );

    const featuresBlocks = getDeviceFeaturesUI(features?.info, features?.type, features?.source);


    if (!hasPros && !hasCons && hasInfo) {
        return (<div style={{flex: 1, display: "flex", flexDirection: "column"}}>
            <div style={{justifyContent: "center", display: "flex", marginTop: 12}}>
                <Switch checked={showInfo} onChange={setShowInfo} uncheckedText='Кратко' checkedText='Подробно'/>
            </div>

            <div style={{overflowY: "auto"}} className={styles.FeatureBlock}>
                {showInfo ?
                    <FeaturesComponentDetailed info={info} activeKey={activeKey} setActiveKey={setActiveKey}
                                               theme={theme}/> :
                    <FeaturesComponentShort blocks={featuresBlocks}/>}
            </div>
        </div>);
    }


    const options = [{
        label: (<div style={{padding: 4}}>
            <Switch checked={showInfo} onChange={setShowInfo}/>
            <div style={{width: 70, textAlign: "center"}}>
                {showInfo ? "Подробно" : "Кратко"}
            </div>
        </div>), value: "info",
    }, hasPros && {
        label: (<div style={{padding: 4, marginTop: 3}}>
            <LikeOutlined style={{fontSize: 20}}/>
            <div>Преимущества</div>
        </div>), value: "pros",
    }, hasCons && {
        label: (<div style={{padding: 4, marginTop: 3}}>
            <DislikeOutlined style={{fontSize: 20}}/>
            <div>Недостатки</div>
        </div>), value: "cons",
    },].filter(Boolean);


    return (<div style={{flex: 1, display: "flex", flexDirection: "column"}}>
        <div style={{justifyContent: "center", display: "flex"}} className={styles.Segmented}>
            <Segmented
                options={options}
                value={tab}
                onChange={setTab}
                style={{borderRadius: 14}}
            />
        </div>

        <div style={{flex: 1, overflowY: "auto"}} className={styles.FeatureBlock}>
            {tab === "pros" && hasPros && renderList(prosCons.advantage)}
            {tab === "cons" && hasCons && renderList(prosCons.disadvantage)}

            {tab === "info" && hasInfo && (showInfo ?
                <FeaturesComponentDetailed info={info} activeKey={activeKey} setActiveKey={setActiveKey}
                                           theme={theme}/> :
                <FeaturesComponentShort blocks={featuresBlocks}/>)}
        </div>
    </div>);
}

