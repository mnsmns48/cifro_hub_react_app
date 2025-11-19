import { Card } from 'antd-mobile';

import styles from '../css/collectionview.module.css';
import {BankOutlined, DribbbleOutlined} from "@ant-design/icons";

function CollectionView({ items, onSelect }) {
    return (
        <div className={styles.grid}>
            {items.map(item => (
                <Card
                    key={item.id}
                    className={styles.card}
                    icon={<DribbbleOutlined  style={{ color: '#1677ff' }} />}
                    title={<div style={{ fontWeight: 'normal' }}>{item.title}</div>}
                    extra={<BankOutlined />}
                    onBodyClick={() => onSelect?.(item)}
                    onHeaderClick={() => onSelect?.(item)}
                    style={{ borderRadius: '16px' }}
                >
                    <div className={styles.imgWrapper}>
                        <img src={item.preview} alt={item.title} className={styles.img} />
                    </div>

                    <div className={styles.price}>{item.output_price} ₽</div>
                </Card>
            ))}
        </div>
    );
}

export default CollectionView;