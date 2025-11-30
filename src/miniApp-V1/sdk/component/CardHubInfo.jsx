import styles from "../css/features.module.css"
import cardStyles from "../css/cardbox.module.css";
import '/fonts/ttfirsneue/stylesheet.css';

const CardInfo = ({cardData, theme}) => {
    return (
        <div className={styles.infoBox} style={{background: theme.colorCard}}>

            <div className={styles.infoRow}
                 style={{
                     fontFamily: "'TT Firs Neue', sans-serif",
                     justifyContent: 'center',
                 }}>
                <span>{cardData.title}</span>
            </div>


            <div className={styles.infoRow} style={{fontFamily: "'TT Firs Neue', sans-serif"}}>
                <span className={styles.infoLabel}>Гарантия:</span>
                <span className={styles.infoValue}>{cardData.warranty}</span>
            </div>


            <div className={styles.infoRow}>
        <span className={styles.infoLabel} style={{fontFamily: "'TT Firs Neue', sans-serif"}}>
          Цена:
        </span>
                <span className={`${cardStyles.price} ${styles.infoPrice}`}>
          {cardData.output_price} ₽
        </span>
            </div>
        </div>
    );
};

export default CardInfo;