import {Popup, Swiper} from "antd-mobile";
import {useEffect, useState} from "react";
import {getFetch} from "../../api.js";
import {miniAppConfig} from "../../miniAppConf.jsx";
import FeaturesSegmented from "./FeaturesSegmented.jsx";
import CardInfo from "./CardHubInfo.jsx";
import PicSwapper from "./PicSwapper.jsx";
import styles from "../css/features.module.css";
import '/fonts/ttfirsneue/stylesheet.css';

export default function Features({theme, tg, insets, cardData, visible, onClose}) {
    const [features, setFeatures] = useState(null);
    const [swiperVisible, setSwiperVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activePics, setActivePics] = useState([]);
    const [title, setTitle] = useState("");

    const pics = Array.isArray(cardData?.pics) ? cardData.pics : [];

    const safeInsets = {
        top: insets?.top ?? "0px",
        bottom: insets?.bottom ?? "0px",
        left: insets?.left ?? "0px",
        right: insets?.right ?? "0px",
    };

    const handleOpenSwiper = (pics, index = 0, title = "") => {
        setActivePics(Array.isArray(pics) ? pics : []);
        setActiveIndex(index);
        setTitle(title);
        setSwiperVisible(true);
    };

    useEffect(() => {
        if (!tg?.BackButton) return;

        const localHandler = () => {
            onClose();
        };

        if (visible) {
            tg.BackButton.offClick(localHandler);
            tg.BackButton.show();
            tg.BackButton.onClick(localHandler);
        } else {
            tg.BackButton.offClick(localHandler);
        }
        return () => {
            tg.BackButton.offClick(localHandler);
        };
    }, [tg, visible, onClose]);


    useEffect(() => {
        if (visible && cardData?.origin) {
            const endpoint = `${miniAppConfig.hub.Content.endpointFeatures}/${cardData.origin}`;
            getFetch(endpoint)
                .then((data) => {
                    setFeatures(data?.features ?? null);

                })
                .catch(() => setFeatures(null));
        }
    }, [visible, cardData?.origin]);


    return (
        <>
            <Popup
                visible={visible}
                onMaskClick={onClose}
                onClose={onClose}
                position="bottom"
                className={styles.rootPopup}
                bodyStyle={{
                    height: `calc(100vh - ${safeInsets.top} - ${safeInsets.bottom})`,
                    paddingTop: safeInsets.top,
                    paddingBottom: safeInsets.bottom,
                    paddingLeft: safeInsets.left,
                    paddingRight: safeInsets.right,
                    display: "flex",
                    flexDirection: "column"
                }}
            >

                    <div className={styles.contentContainer} style={{marginTop: 40}}>
                        {features && (
                            <div className={styles.mainTitle} style={{color: theme.colorText}}>
                                {features.title}
                            </div>
                        )}

                        {pics.length > 0 && (
                            <Swiper defaultIndex={0} loop={pics.length > 1}>
                                {pics.map((src, idx) => (
                                    <Swiper.Item key={idx}>
                                        <div className={styles.swiperPicItemContainer}>
                                            <img
                                                src={src}
                                                alt={`${cardData.title} ${idx}`}
                                                onClick={() => handleOpenSwiper(pics, idx, cardData.title)}
                                            />
                                        </div>
                                    </Swiper.Item>
                                ))}
                            </Swiper>
                        )}
                        <div className={styles.scrollContainer}>
                            <CardInfo cardData={cardData} theme={theme}/>
                            <FeaturesSegmented type={cardData?.type} features={features}/>
                        </div>
                    </div>

            </Popup>

            <PicSwapper
                theme={theme}
                visible={swiperVisible}
                onClose={() => setSwiperVisible(false)}
                pics={activePics}
                activeIndex={activeIndex}
                safeInsets={safeInsets}
                title={title}
            />
        </>
    );
}