import {Collapse, Image, Space} from "antd";
import styles from "../css/infoinmain.module.css"
import '/fonts/ttfirsneue/stylesheet.css';
import {DownCircleOutlined, UserOutlined} from "@ant-design/icons";
import {Masonry} from 'antd';
import {AppServicePicsContext} from "../context.js";
import {useContext} from "react";


const extractPromoImages = (serviceImages) => {
    if (!serviceImages) return [];

    const regex = /promo\d*/i;

    return Object.keys(serviceImages)
        .filter(key => regex.test(key))
        .map(key => serviceImages[key])
        .filter(Boolean);
}

export default function InfoInMain() {
    const serviceImages = useContext(AppServicePicsContext)

    const imageList = extractPromoImages(serviceImages);

    return (
        <>
            <div style={{position: "relative", zIndex: 10}}>
                <a href="tel:+79787156486"
                   style={{
                       justifyContent: 'center', display: 'flex',
                       paddingTop: 16, color: 'inherit', textDecoration: 'none'
                   }}>+7 (978) 715-64-86</a>
            </div>
            <a href="https://t.me/cifrotech_mobile"
               target="_blank"
               rel="noopener noreferrer"
               className={styles.telegramLink}><UserOutlined/> Администратор</a>
            <Collapse
                bordered={false}
                className={styles.addressText}
                style={{marginTop: 16, fontFamily: "'TT Firs Neue', sans-serif"}}
                expandIcon={({isActive}) => (
                    <DownCircleOutlined
                        style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            textAlign: "center",
                            justifyContent: "center",
                            display: "flex",
                            transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "0.4s"
                        }}
                    />
                )}
                items={[
                    {
                        key: "1",
                        label: "п. Ленино, Проспект Ленина 9",
                        children: (
                            <div className={styles.mapContainer}>
                                <iframe
                                    src="https://yandex.ru/map-widget/v1/?um=constructor%3A0a95ba835d61c82795fafd46843418bb4923ab84978c079e6e2602ed17d7726b&amp;source=constructor"
                                    className="responsive-iframe"
                                    frameBorder="0"
                                    title="Location Map"
                                    style={{
                                        borderRadius: 14,
                                        width: "100%",
                                        height: "100%",
                                        margin: 0
                                    }}
                                ></iframe>
                            </div>
                        )
                    }
                ]}
            />

            <div className={styles.mainContainer}>
                <Masonry
                    columns={1}
                    gutter={4}
                    items={[
                        {
                            key: "cifrotech_main",
                            data: serviceImages?.cifrotech_
                        }
                    ]}
                    itemRender={({data}) => (
                        <img src={data} alt="main" style={{width: "100%", borderRadius: 14}}/>
                    )}
                />

                {Array.isArray(imageList) && imageList.length > 0 && (
                    <div style={{paddingTop: 16}}>
                        <Masonry
                            columns={3}
                            gutter={14}
                            items={imageList.map((img, index) => ({
                                key: `item-${index}`,
                                data: img,
                            }))}
                            itemRender={({data}) => (
                                <img src={`${data}?w=523&auto=format`} alt="sample"
                                     style={{width: '100%', borderRadius: 14}}
                                />
                            )}
                        />
                    </div>
                )}
            </div>
        </>
    )
}