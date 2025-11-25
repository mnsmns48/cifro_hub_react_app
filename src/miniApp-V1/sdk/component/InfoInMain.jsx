import {Image, Space} from "antd";
import styles from "../css/infoinmain.module.css"
import '/fonts/ttfirsneue/stylesheet.css';

export default function InfoInMain({img, safeInsets}) {

    return (
        <>
            <div className={styles.mainContainer}>
                <Space wrap>
                    <Image src={img?.cifrotech_} alt='main_photo_pic' style={{borderRadius: 14}}/>
                </Space>
                <div className={styles.addressText} style={{fontFamily: "'TT Firs Neue', sans-serif"}}>
                    п. Ленино, Проспект Ленина 9
                </div>
                    <div style={{position: "relative", zIndex: 10}}>
                        <a
                            href="tel:+79787156486"
                            style={{
                                justifyContent: 'center',
                                display: 'flex',
                                paddingTop: 16,
                                color: 'inherit',
                                textDecoration: 'none'
                            }}
                        >
                            +7 (978) 715-64-86
                        </a>
                    </div>



                <a
                    href="https://t.me/cifrotech_mobile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.telegramLink}
                >
                    Администратор
                </a>
                <div className={styles.mapContainer}>
                    <iframe
                        src="https://yandex.ru/map-widget/v1/?um=constructor%3A0a95ba835d61c82795fafd46843418bb4923ab84978c079e6e2602ed17d7726b&amp;source=constructor"
                        className="responsive-iframe"
                        frameBorder="0"
                        title="Location Map"
                        style={{borderRadius: 14, width: "100%", height: '100%', margin: 0}}
                    ></iframe>
                </div>
            </div>
        </>
    )
}