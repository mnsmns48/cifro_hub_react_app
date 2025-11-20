import {Card} from "antd-mobile";
import styles from "../css/cardbox.module.css";



export default function CardBox({ cardData, onSelect }) {
    return (
        <Card
            className={styles.card}
            onBodyClick={() => onSelect?.(cardData)}
            style={{ borderRadius: '16px' }}
        >

            <div className={styles.imgWrapper}>
                <img src={cardData.preview} alt={cardData.title} className={styles.img} />
            </div>

            <div className={styles.price}>
                {cardData.output_price} ₽
            </div>

            <div className={styles.cardTitle}>
                {cardData.title}
            </div>


        </Card>
    );
}