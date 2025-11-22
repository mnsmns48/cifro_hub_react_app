import {Popup, Swiper} from "antd-mobile";
import {FullscreenExitOutlined} from "@ant-design/icons";
import styles from "../css/picswapper.module.css";

export default function PicSwapper({visible, onClose, pics, activeIndex, safeInsets, title}) {
    return (
        <Popup visible={visible} onMaskClick={onClose} bodyStyle={{
            height: "100hv",
            display: "flex",
            boxSizing: "border-box",
            justifyContent: "center",
            left: safeInsets.left,
            right: safeInsets.right,
        }}>
            <div style={{paddingTop: `calc(${safeInsets.top} + 38px)`}} className={styles.swiperContainer}>
                <Swiper defaultIndex={activeIndex} loop>
                    {pics.map((src, idx) => (
                        <Swiper.Item key={idx}>
                            <div className={styles.fullscreenImgWrapper}>
                                <img className={styles.fullscreenImg} src={src} alt={`${title} ${idx}`}/>
                            </div>
                        </Swiper.Item>))} </Swiper>
                <div className={styles.closeBtnWrapper}>
                    <FullscreenExitOutlined className={styles.closeBtn} onClick={onClose}/>
                </div>
            </div>
        </Popup>);
}