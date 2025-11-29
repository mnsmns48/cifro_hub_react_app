import {Segmented, Collapse} from "antd-mobile";
import {DislikeOutlined, LikeOutlined, UnorderedListOutlined} from "@ant-design/icons";
import styles from "../css/features.module.css";
import {useState} from "react";

export default function FeaturesSegmented({features}) {
    const [tab, setTab] = useState("info");

    const prosCons = features?.pros_cons ?? {};
    const info = features?.info ?? [];

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
            <Collapse accordion>
                {info.map((section, idx) => {
                    const [sectionName, sectionValues] = Object.entries(section)[0] ?? ["", {}];
                    return (
                        <Collapse.Panel key={idx} title={sectionName}>
                            <ul style={{paddingLeft: "20px", margin: 0, color: "#3a3a3a"}}>
                                {Object.entries(sectionValues ?? {}).map(([key, value]) => (
                                    <li key={key}>
                                        <strong>{key}:</strong> {value}
                                    </li>
                                ))}
                            </ul>
                        </Collapse.Panel>
                    );
                })}
            </Collapse>
        </div>
    );


    // только info → без Segmented
    if (hasInfo && !hasPros && !hasCons) {
        return (
            <div style={{flex: 1, overflowY: "auto", padding: "16px"}} className={styles.FeatureBlock}>
                {renderInfo()}
            </div>
        );
    }

    // prosCons + info → полноценный Segmented
    const options = [
        {
            label: (
                <div style={{padding: 4}}>
                    <UnorderedListOutlined/>
                    <div>Параметры</div>
                </div>
            ),
            value: "info",
        },
        hasPros && {
            label: (
                <div style={{padding: 4}}>
                    <LikeOutlined/>
                    <div>Преимущества</div>
                </div>
            ),
            value: "pros",
        },
        hasCons && {
            label: (
                <div style={{padding: 4}}>
                    <DislikeOutlined/>
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
                    className={styles.SegmentedText}
                    options={options}
                    value={tab}
                    onChange={setTab}
                    style={{borderRadius: 14}}
                />
            </div>

            <div style={{flex: 1, overflowY: "auto", padding: "16px"}} className={styles.FeatureBlock}>
                {tab === "pros" && hasPros && renderList(prosCons.advantage)}
                {tab === "cons" && hasCons && renderList(prosCons.disadvantage)}
                {tab === "info" && hasInfo && renderInfo()}
            </div>
        </div>
    );
}
