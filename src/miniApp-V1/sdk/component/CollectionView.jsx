import styles from '../css/collectionview.module.css';
import CardBox from "./CardBox.jsx";

function CollectionView({theme, items, noImg, safeInsets, onSelect}) {
    return (
        <div className={styles.grid}>
            {items.map(item => (
                <CardBox
                    theme={theme}
                    key={item.id}
                    cardData={item}
                    safeInsets={safeInsets}
                    noImg={noImg}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}

export default CollectionView;
