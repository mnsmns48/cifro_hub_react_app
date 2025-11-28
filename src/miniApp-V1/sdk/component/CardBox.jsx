import {useContext, useState} from "react";
import {Card} from "antd-mobile";
import styles from "../css/cardbox.module.css";
import PicSwapper from "./PicSwapper.jsx";
import Features from "./Features.jsx";
import {AppServicePicsContext} from "../context.js";

export default function CardBox({theme, cardData, safeInsets}) {
    const serviceImages = useContext(AppServicePicsContext)
    const noImg = serviceImages?.no_img

    const pics = cardData.pics?.length ? cardData.pics : [noImg];
    const [visible, setVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [featuresVisible, setFeaturesVisible] = useState(false);

    const openFeaturesClick = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
        setFeaturesVisible(true);
    };

    return (
        <>
            <div onClick={openFeaturesClick}>
                <Card className={styles.card}>
                    <div className={styles.imgWrapper}>
                        <img src={cardData.preview || noImg} alt={cardData.title}
                             className={styles.img}
                            // onClick={(e) => {
                            //     e.stopPropagation();
                            //     if (cardData.preview) {
                            //         setActiveIndex(0);
                            //         setVisible(true);
                            //     }
                            // }}
                        />
                    </div>
                    <div className={styles.price}>{cardData.output_price} ₽</div>
                    <div className={styles.cardTitle} lang="ru">{cardData.title}</div>
                </Card>
            </div>
            {cardData.preview && (
                <PicSwapper theme={theme}
                            visible={visible}
                            onClose={() => setVisible(false)}
                            pics={pics}
                            activeIndex={activeIndex}
                            safeInsets={safeInsets}
                            title={cardData.title}/>
            )}

            {featuresVisible && (
                <Features theme={theme}
                          noImg={noImg}
                          safeInsets={safeInsets}
                          cardData={cardData}
                          visible={featuresVisible}
                          onClose={() => setFeaturesVisible(false)}/>
            )}
        </>
    );
}
