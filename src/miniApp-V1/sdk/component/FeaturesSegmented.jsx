import {JumboTabs, Segmented, Switch} from "antd-mobile";
import {DislikeOutlined, LikeOutlined} from "@ant-design/icons";
import styles from "../css/features.module.css";
import {useContext, useState} from "react";
import {getSectionIcon} from "./Features/IconMap.jsx";
import {ThemeContext} from "../context.js";
import SmartPhone from "./Features/SmartPhone.jsx";

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
        <ul style={{paddingLeft: "20px", margin: 0, color: "#3a3a3a"}}>
            {items.map((item, idx) => (
                <li key={idx}>{item}</li>
            ))}
        </ul>
    );

    const renderInfo = () => (
        <div>
            <JumboTabs activeKey={activeKey || firstSectionName} onChange={setActiveKey}>
                {info.map((section) => {
                    const [sectionName, sectionValues] = Object.entries(section)[0] ?? ["", {}];
                    const isActive = (activeKey || firstSectionName) === sectionName;

                    return (
                        <JumboTabs.Tab
                            title={sectionName}
                            key={sectionName}
                            description={
                                <span style={{color: isActive ? theme.colorLightGreen : "inherit"}}>
                {getSectionIcon(sectionName)}
              </span>
                            }
                        >
                            <table
                                style={{
                                    width: "100%",
                                    color: "#3a3a3a",
                                    marginTop: 8
                                }}
                            >
                                <tbody>
                                {Object.entries(sectionValues ?? {}).map(([key, value]) => (
                                    <tr key={key}>
                                        <td
                                            style={{
                                                fontWeight: "bold",
                                                padding: "4px 8px",
                                                width: "40%",

                                            }}
                                        >
                                            {key}
                                        </td>
                                        <td
                                            style={{
                                                padding: "4px 8px",
                                            }}
                                        >
                                            {value}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </JumboTabs.Tab>
                    );
                })}
            </JumboTabs>
        </div>
    );


    if (!hasPros && !hasCons && hasInfo) {
        return (
            <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
                <div style={{justifyContent: "center", display: "flex", marginTop: 12}}>
                    <Switch checked={showInfo} onChange={setShowInfo} uncheckedText='Кратко' checkedText='Подробно'/>
                </div>

                <div style={{flex: 1, overflowY: "auto", padding: "12px"}} className={styles.FeatureBlock}>
                    {showInfo ? renderInfo() : <SmartPhone info={features}/>}
                </div>
            </div>
        );
    }

    const options = [
        {
            label: (
                <div style={{padding: 4}}>
                    <Switch checked={showInfo} onChange={setShowInfo}/>
                    <div style={{width: 70, textAlign: "center"}}>{showInfo ? "Подробно" : "Кратко"}</div>
                </div>
            ),
            value: "info",
        },
        hasPros && {
            label: (
                <div style={{padding: 4, marginTop: 3}}>
                    <LikeOutlined style={{fontSize: 20}}/>
                    <div>Преимущества</div>
                </div>
            ),
            value: "pros",
        },
        hasCons && {
            label: (
                <div style={{padding: 4, marginTop: 3}}>
                    <DislikeOutlined style={{fontSize: 20}}/>
                    <div>Недостатки</div>
                </div>
            ),
            value: "cons",
        },
    ].filter(Boolean);

    return (
        <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
            <div style={{justifyContent: "center", display: "flex"}} className={styles.Segmented}>
                <Segmented
                    options={options}
                    value={tab}
                    onChange={setTab}
                    style={{borderRadius: 14}}
                />
            </div>

            <div style={{flex: 1, overflowY: "auto", padding: "16px"}} className={styles.FeatureBlock}>
                {tab === "pros" && hasPros && renderList(prosCons.advantage)}
                {tab === "cons" && hasCons && renderList(prosCons.disadvantage)}
                {tab === "info" && hasInfo && (showInfo ? renderInfo() : <SmartPhone info={features}/>)}
            </div>
        </div>
    );
}
