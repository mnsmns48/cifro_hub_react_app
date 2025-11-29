import {useContext, useState} from "react";
import {Card} from "antd-mobile";
import styles from "../css/cardbox.module.css";
import PicSwapper from "./PicSwapper.jsx";
import Features from "./Features.jsx";
import {AppEnvironmentContext, AppServicePicsContext} from "../context.js";

export default function CardBox({theme, cardData}) {
    const serviceImages = useContext(AppServicePicsContext)
    const noImg = serviceImages?.no_img

    const {insets} = useContext(AppEnvironmentContext);

    const pics = cardData.pics?.length ? cardData.pics : [noImg];
    const [visible, setVisible] = useState(false);
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
                        <img src={cardData.preview || noImg} alt={cardData.title} className={styles.img}/>
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
                            safeInsets={insets}
                            title={cardData.title}/>
            )}

            {featuresVisible && (
                <Features theme={theme}
                          noImg={noImg}
                          safeInsets={insets}
                          cardData={cardData}
                          visible={featuresVisible}
                          onClose={() => setFeaturesVisible(false)}/>
            )}
        </>
    );
}
