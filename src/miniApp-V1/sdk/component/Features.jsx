import {Popup, Swiper} from "antd-mobile";
import {useEffect, useState} from "react";
import {getFetch} from "../../api.js";
import {miniAppConfig} from "../../miniAppConf.jsx";
import {UndoOutlined} from "@ant-design/icons";
import FeaturesSegmented from "./FeaturesSegmented.jsx";
import styles from "../css/features.module.css"

export default function Features({theme, noImg, safeInsets, visible, onClose, cardData}) {
    const pics = Array.isArray(cardData?.pics) ? cardData.pics : [];
    const [features, setFeatures] = useState([]);

    useEffect(() => {
        if (visible && cardData?.origin) {
            const endpoint = `${miniAppConfig.hub.Content.endpointFeatures}/${cardData.origin}`;
            getFetch(endpoint)
                .then(data => setFeatures(data))
                .catch(() => setFeatures([]));
        }
    }, [visible, cardData?.origin]);

    useEffect(() => {
        if (visible) {
            window.Telegram?.WebApp?.BackButton?.show();
            window.Telegram?.WebApp?.BackButton?.onClick(() => {
                onClose()
                window.Telegram?.WebApp?.BackButton?.hide();
            });

        } else {
            window.Telegram?.WebApp?.BackButton?.hide();
        }
    }, [visible, onClose]);

    return (
        <Popup visible={visible}
               onMaskClick={onClose}
               onClose={onClose}
               className={styles.rootPopup}
               bodyStyle={{
                   height: `calc(100vh - ${safeInsets.top} - ${safeInsets.bottom})`,
                   paddingTop: safeInsets.top,
                   paddingBottom: safeInsets.bottom,
                   paddingLeft: safeInsets.left,
                   paddingRight: safeInsets.right,
               }}>
            <div style={{paddingTop: `calc(${safeInsets.top} + 1px)`}}>
                {features.length > 0 && (
                    <div className={styles.mainTitle}>{features[0].title}</div>
                )}
                {pics.length > 0 ? (
                    <Swiper defaultIndex={0} loop={pics.length > 1}>
                        {pics.map((src, idx) => (
                            <Swiper.Item key={idx}>
                                <div className={styles.swiperPicItemContainer}>
                                    <img src={src} alt={`${cardData.title} ${idx}`}/>
                                </div>
                            </Swiper.Item>
                        ))}
                    </Swiper>
                ) : (
                    <div style={{textAlign: "center"}}>
                        {/*<img src={noImg}*/}
                        {/*     alt={`${cardData.title}`}*/}
                        {/*     style={{*/}
                        {/*         maxWidth: "20%",*/}
                        {/*         maxHeight: "20%",*/}
                        {/*         objectFit: "contain"*/}
                        {/*     }}*/}
                        {/*/>*/}
                    </div>
                )}
            </div>

            {/*<div style={{display: "flex", justifyContent: "center", padding: "8px", borderBottom: "1px solid #eee"}}>*/}
            {/*    <button*/}
            {/*        onClick={onClose}*/}
            {/*        style={{*/}
            {/*            background: "transparent",*/}
            {/*            cursor: "pointer",*/}
            {/*            fontSize: "32px",*/}
            {/*            color: theme.colorText*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <UndoOutlined/>*/}
            {/*    </button>*/}
            {/*</div>*/}

            <FeaturesSegmented features={features}/>

        </Popup>
    );
}
