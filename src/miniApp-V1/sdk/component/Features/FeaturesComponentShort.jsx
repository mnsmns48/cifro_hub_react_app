import {useEffect, useState, useContext} from "react";
import {Spin} from "antd";

import {ThemeContext} from "../../context.js";
import styles from "../../css/features.module.css";
import {fetchPostData} from "../../../../Service-app/Services/Common/api.js";

const FeaturesComponentShort = ({id, info}) => {
    const theme = useContext(ThemeContext);
    const [blocks, setBlocks] = useState(null);


    useEffect(() => {
        if (!id || !info) {
            setBlocks([]);
            return;
        }
        setBlocks(null);
        const infoDict = info ? Object.assign({}, ...info) : null;
        const payload = {
            product_features_map: {
                [id]: infoDict
            }
        };

        fetchPostData("/service/desc-builder/generate_description", payload)
            .then((res) => {
                const products = res?.success?.products || {};
                const pid = Object.keys(products)[0];

                if (!pid) {
                    setBlocks([]);
                    return;
                }

                setBlocks(products[pid]?.blocks || []);
            })
            .catch((err) => {
                console.error("generate_description error:", err);
                setBlocks([]);
            });

    }, [id, info]);


    if (blocks === null) {
        return (
            <div style={{padding: 10, textAlign: "center"}}>
                <Spin size="small"/>
            </div>
        );
    }


    if (!Array.isArray(blocks) || blocks.length === 0) {
        return (
            <div style={{padding: 10, color: "#999"}}>
                Админ добавляет описание. Скоро всё будет
            </div>
        );
    }

    return (
        <div style={{padding: "12px 0 0 18px"}}>
            <table>
                <tbody>
                {blocks.map((block, index) => (
                    <tr key={index}>
                        <td style={{width: "12%"}}>
                            {block.icon ? (
                                <img
                                    src={block.icon}
                                    alt=""
                                    style={{
                                        width: 20,
                                        height: 20,
                                        objectFit: "contain",
                                        opacity: 0.9
                                    }}
                                />
                            ) : (
                                <span style={{color: theme.colorMuted}} className={styles.shortFeaturesIcon}>•</span>
                            )}
                        </td>

                        <td style={{
                            paddingLeft: 8,
                            lineHeight: 1.7,
                            fontWeight: 501,
                            fontFamily: theme.fontFamily,
                            color: theme.colorSecondary,
                            whiteSpace: "nowrap"
                        }}>
                            {block.text}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default FeaturesComponentShort;
