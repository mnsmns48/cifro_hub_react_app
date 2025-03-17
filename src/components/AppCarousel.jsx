import { Carousel } from 'antd';
import { useEffect, useState } from 'react';

const carouselStyle = {
    width: '40%',
    margin: '0 auto',
    marginBottom: '15px',
    marginTop: '25px'
};

const imageStyle = {
    width: '100%',
    height: '120px',
    objectFit: 'cover'
};


const carouselSettings = {
    autoplay: true,
    autoplaySpeed: 5000,
    dots: true,
    effect: 'fade',
    pauseOnHover: true
};

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
        <div style={carouselStyle}>
            <Carousel {...carouselSettings}>
                {slides.map((slide, index) => (
                    <div key={index}>
                        <img src={slide} alt={`Slide ${index + 1}`} style={imageStyle} />
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default AppCarousel; 