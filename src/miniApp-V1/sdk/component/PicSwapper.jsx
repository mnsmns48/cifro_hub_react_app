import {Popup, Swiper} from "antd-mobile";
import {FullscreenExitOutlined} from "@ant-design/icons";
import styles from "../css/picswapper.module.css";

export default function PicSwapper({theme, visible, onClose, pics, activeIndex, safeInsets, title}) {

    return (
        <>
            <Popup visible={visible} onMaskClick={onClose} bodyStyle={{
                paddingTop: safeInsets.top,
                paddingBottom: safeInsets.bottom,
                paddingLeft: safeInsets.left,
                paddingRight: safeInsets.right,
                height: `calc(100vh - ${safeInsets.top} - ${safeInsets.bottom})`,
                display: "flex",
            }}>
                <div style={{paddingTop: `calc(${safeInsets.top} + 1px)`}} className={styles.swiperContainer}>
                    <Swiper defaultIndex={activeIndex} loop>
                        {pics.map((src, idx) => (
                            <Swiper.Item key={idx}>
                                <div className={styles.fullscreenImgWrapper}
                                     style={{paddingLeft: 10, paddingRight: 10}}>
                                    <img src={src} alt={`${title} ${idx}`}/>
                                </div>
                            </Swiper.Item>))} </Swiper>
                    <div className={styles.closeBtnWrapper} style={{color: theme.colorPrimary}} onClick={onClose}>
                        <FullscreenExitOutlined className={styles.closeBtn} onClick={onClose}/>
                    </div>
                </div>
            </Popup>
        </>);
}