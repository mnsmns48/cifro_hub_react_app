import {useEffect, useState} from "react";
import {Spin} from "antd";
import {fetchPostData} from "./api.js";

const DescriptionRenderer = ({origin = null, product_features_map = null}) => {
    const [blocks, setBlocks] = useState(null);

    useEffect(() => {
        if (!origin && !product_features_map) {
            setBlocks([]);
            return;
        }

        setBlocks(null);
        const payload = {};

        if (product_features_map) {
            payload.product_features_map = product_features_map;
        } else if (origin) {
            payload.origins = [Number(origin)];
        }

        fetchPostData("/generate_description", payload)
            .then((res) => {
                const products = res?.success?.products || {};
                const id = Object.keys(products)[0];

                if (!id) {
                    setBlocks([]);
                    return;
                }

                setBlocks(products[id]?.blocks || []);
            })
            .catch((err) => {
                console.error("generate_description error:", err);
                setBlocks([]);
            });

    }, [origin, product_features_map]);

    if (blocks === null) {
        return (
            <div style={{padding: 10, textAlign: "center"}}>
                <Spin size="small"/>
            </div>
        );
    }

    if (!Array.isArray(blocks) || blocks.length === 0) {
        return (
            <div style={{padding: 10, color: "#cfcfcf"}}>
                Проверь шаблон DescriptionRenderer
            </div>
        );
    }

    return (
        <div style={{padding: 2, display: "flex", flexDirection: "column", gap: 2}}>
            {blocks.map((block, index) => (
                <div key={index} style={{whiteSpace: "nowrap", fontSize: 12, lineHeight: "14px"}}>
                    {block.text}
                </div>
            ))}
        </div>
    );
};

export default DescriptionRenderer;
