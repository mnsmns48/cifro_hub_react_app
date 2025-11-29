import {useContext, useState} from "react";
import {Card} from "antd-mobile";
import styles from "../css/cardbox.module.css";
import Features from "./Features.jsx";
import {AppEnvironmentContext, AppServicePicsContext} from "../context.js";

export default function CardBox({theme, cardData, backBtnVisible, setBackBtnVisible}) {
    const {insets, tg} = useContext(AppEnvironmentContext);
    const serviceImages = useContext(AppServicePicsContext)
    const noImg = serviceImages?.no_img

    const [featurePopUpVisible, setFeaturePopUpVisible] = useState(false);


    const openFeaturesClick = () => {
        tg?.HapticFeedback.impactOccurred('medium')
        setBackBtnVisible(true);
        setFeaturePopUpVisible(true)
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


            {featurePopUpVisible && (
                <Features theme={theme} noImg={noImg} safeInsets={insets} cardData={cardData}
                          visible={backBtnVisible} onClose={() => setBackBtnVisible(false)}/>
            )}
        </>
    );
}
