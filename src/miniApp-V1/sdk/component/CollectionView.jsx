import styles from '../css/collectionview.module.css';
import CardBox from "./CardBox.jsx";

function CollectionView({items, noImg, onSelect}) {
    return (
        <div className={styles.grid}>
            {items.map(item => (
                <CardBox
                    key={item.id}
                    cardData={item}
                    noImg={noImg}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}

export default CollectionView;
