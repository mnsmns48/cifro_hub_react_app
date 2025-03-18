import {Carousel} from 'antd';
import {useEffect, useState} from 'react';
import './AppCarousel.css'


const AppCarousel = () => {
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        const images = import.meta.glob('/public/slide/*.jpg');
        const slideImages = Object.keys(images).map(path => {
            return path.replace('/public/slide/', '/slide/');
        });
        setSlides(slideImages);
    }, []);

    return (
        <div className="carouselStyle">
            <Carousel autoplay={true} autoplaySpeed={5000} dots={true} effect={"fade"} pauseOnHover={true}>
                {slides.map((slide, index) => (
                    <div key={index}>
                        <img src={slide} alt={`Slide ${index + 1}`} className="carousel-image" />
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default AppCarousel;