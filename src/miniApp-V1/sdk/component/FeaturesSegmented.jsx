import {Segmented} from "antd-mobile";
import {DislikeOutlined, LikeOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {useState} from "react";
import styles from "../css/features.module.css";

export default function FeaturesSegmented({features}) {
    const [tab, setTab] = useState("searchOutlined");

    const prosCons = features[0]?.pros_cons ?? {};
    const info = features[0]?.info ?? [];

    return (
        <div style={{flex: 1, display: "flex", flexDirection: "column", marginTop: 16 }}>
            <div style={{justifyContent: "center", display: "flex"}} className={styles.Segmented}>
                <Segmented
                    options={[
                        {
                            label: (
                                <div style={{padding: 4}}>
                                    <UnorderedListOutlined />
                                    <div>Параметры</div>
                                </div>
                            ),
                            value: 'searchOutlined',
                        },
                        {
                            label: (
                                <div style={{padding: 4}}>
                                    <LikeOutlined/>
                                    <div>Преимущества</div>
                                </div>
                            ),
                            value: 'likeOutlined',
                        },
                        {
                            label: (
                                <div style={{padding: 4}}>
                                    <DislikeOutlined/>
                                    <div>Недостатки</div>
                                </div>
                            ),
                            value: 'dislikeOutlined',
                        },
                    ]}
                    value={tab}
                    onChange={setTab}
                    style={{ borderRadius: 14 }}                // подписи

                />
            </div>

            {/* Контейнер с прокруткой */}
            <div style={{flex: 1, overflowY: "auto", padding: "16px"}}>
                {tab === "likeOutlined" && Array.isArray(prosCons.advantage) && (
                    <ul>
                        {prosCons.advantage.map((adv, idx) => (
                            <li key={idx}>{adv}</li>
                        ))}
                    </ul>
                )}

                {tab === "dislikeOutlined" && Array.isArray(prosCons.disadvantage) && (
                    <ul>
                        {prosCons.disadvantage.map((dis, idx) => (
                            <li key={idx}>{dis}</li>
                        ))}
                    </ul>
                )}

                {tab === "searchOutlined" && Array.isArray(info) && (
                    <div>
                        {info.map((section, idx) => {
                            const [sectionName, sectionValues] = Object.entries(section)[0];
                            return (
                                <div key={idx} style={{marginBottom: "12px"}}>
                                    <h4 style={{margin: "0 0 4px"}}>{sectionName}</h4>
                                    <ul style={{paddingLeft: "20px", margin: 0}}>
                                        {Object.entries(sectionValues).map(([key, value]) => (
                                            <li key={key}>
                                                <strong>{key}:</strong> {value}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}