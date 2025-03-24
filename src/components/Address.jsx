import React from 'react';
import {FaTelegram, FaPhoneAlt} from 'react-icons/fa'; // Import Telegram icon
import './Address.css'; // Optional, for styling

export default function Address() {
    return (
        <>
            <div className="contacts">
                <h3>
                    <p>
                        <FaTelegram style={{color: '#0088cc'}} /> <a href="https://t.me/cifrotech_mobile">cifrotech_mobile</a>
                    </p>
                    <p>
                        <FaPhoneAlt /> +79787156486
                    </p>
                </h3>
            </div>
            <div className="container">
                <div className="main-photo">
                    <img
                        src="cifrotech_.jpg"
                        alt="cifrotech_main_photo"
                        className="responsive-image"
                    />
                </div>
                <div className="map">
                    <iframe
                        src="https://yandex.ru/map-widget/v1/?um=constructor%3A0a95ba835d61c82795fafd46843418bb4923ab84978c079e6e2602ed17d7726b&amp;source=constructor"
                        className="responsive-iframe"
                        frameBorder="0"
                        title="Location Map"
                    ></iframe>
                </div>
            </div>
        </>
    );
}
