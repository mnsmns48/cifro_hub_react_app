import {useState} from "react";
import {Card} from "antd-mobile";
import styles from "../css/cardbox.module.css";
import PicSwapper from "./PicSwapper.jsx";

export default function CardBox({theme, cardData, noImg, safeInsets, onSelect}) {
    const pics = cardData.pics?.length ? cardData.pics : [noImg];
    const [visible, setVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);


    const openFeaturesClick = () => {
    };

    return (
        <>
            <Card className={styles.card} onBodyClick={() => onSelect?.(cardData)}>
                <div className={styles.imgWrapper}>
                    <img src={cardData.preview || noImg} alt={cardData.title}
                         className={styles.img}
                         onClick={(e) => {
                             e.stopPropagation();
                             if (cardData.preview) {
                                 setActiveIndex(0);
                                 setVisible(true);
                             }
                         }}
                    />
                </div>
                <div onClick={openFeaturesClick}>
                    <div className={styles.price}>{cardData.output_price} ₽</div>
                    <div className={styles.cardTitle} lang="ru">{cardData.title}</div>
                </div>
            </Card>

            {cardData.preview && (
                <PicSwapper
                    theme={theme}
                    visible={visible}
                    onClose={() => setVisible(false)}
                    pics={pics}
                    activeIndex={activeIndex}
                    safeInsets={safeInsets}
                    title={cardData.title}
                />
            )}
        </>
    );
}
