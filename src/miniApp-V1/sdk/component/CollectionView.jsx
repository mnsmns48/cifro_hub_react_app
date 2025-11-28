import styles from '../css/collectionview.module.css';
import CardBox from "./CardBox.jsx";
import {useContext} from "react";
import {ThemeContext} from "../context.js";


function CollectionView({items, safeInsets}) {
    const theme = useContext(ThemeContext);

    return (
        <div className={styles.grid}>
            {items.map(item => (
                <CardBox
                    theme={theme}
                    key={item.id}
                    cardData={item}
                    safeInsets={safeInsets}
                />
            ))}
        </div>
    );
}

export default CollectionView;
