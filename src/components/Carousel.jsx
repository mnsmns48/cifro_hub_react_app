import { Carousel } from 'antd';

const carouselStyle = {
    width: '40%',
    margin: '0 auto',
    paddingTop: '15px',
};

const imageStyle = {
    width: '100%',
    height: '120px',
    objectFit: 'cover'
};


const AppCarousel = () => (
    <div style={carouselStyle} className="carousel-container">
        <Carousel autoplay effect="fade" style={{backgroundColor: 'transparent'}}>
            <div>
                <img src="/slide1.jpg" alt="Slide 1" style={imageStyle} />
            </div>
        </Carousel>
    </div>
);

export default AppCarousel;