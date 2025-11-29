import {Popup, Swiper} from "antd-mobile";
import {useContext, useEffect, useState} from "react";
import {getFetch} from "../../api.js";
import {miniAppConfig} from "../../miniAppConf.jsx";
import FeaturesSegmented from "./FeaturesSegmented.jsx";
import CardInfo from "./CardHubInfo.jsx";
import PicSwapper from "./PicSwapper.jsx";
import styles from "../css/features.module.css";
import '/fonts/ttfirsneue/stylesheet.css';
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";
import {AppEnvironmentContext} from "../context.js";
import spinnerStyles from "../../miniapp.module.css";

export default function Features({theme, safeInsets, visible, onClose, cardData}) {
    const [features, setFeatures] = useState(null);
    const [swiperVisible, setSwiperVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activePics, setActivePics] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const pics = Array.isArray(cardData?.pics) ? cardData.pics : [];
    const {tg} = useContext(AppEnvironmentContext);

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
            setLoading(true);
            const endpoint = `${miniAppConfig.hub.Content.endpointFeatures}/${cardData.origin}`;
            getFetch(endpoint)
                .then((data) => setFeatures(Array.isArray(data) ? data : []))
                .catch(() => setFeatures([]))
                .finally(() => setLoading(false));
        }
    }, [visible, cardData?.origin]);


    return (
        <>
            <Popup
                visible={visible}
                onMaskClick={onClose}
                onClose={onClose}
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
                {loading ? (
                    <div className={spinnerStyles.centeredSpinner}>
                        <Spinner/>
                    </div>
                ) : (
                    <div className={styles.contentContainer}>
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

                        <CardInfo cardData={cardData} theme={theme}/>

                        <div className={styles.scrollContainer}>
                            <FeaturesSegmented features={features}/>
                        </div>
                    </div>
                )}
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