import {Layout} from "antd";
import axios from "axios";
import {useEffect, useState} from "react";
import ProductList from "./ProductList.jsx";
import './AppContent.css'
import {useParams} from "react-router-dom";
import {Card, Col, Row, Spin} from "antd";
import {useNavigate} from "react-router-dom";
import {useWindowSize} from "../hooks/useWindowSize";
import {useMediaQuery} from "react-responsive";
import {useTheme} from "antd";
import {useThemeContext} from "../context/ThemeContext";

const {Content} = Layout;
export default function AppContent({contentDataId}) {
    const {id} = useParams();
    const [contentData, setContentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const {width} = useWindowSize();
    const isMobile = useMediaQuery({maxWidth: 768});
    const {token} = useTheme();
    const {isDarkMode} = useThemeContext();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let response;
                if (id) {
                    response = await axios.get(`${import.meta.env.VITE_BACKEND}/api2/category/${id}`);
                    if (response.data && response.data.products) {
                        setContentData(response.data.products);
                    }
                } else {
                    // Загружаем случайные товары, если нет categoryId
                    response = await axios.get(`${import.meta.env.VITE_BACKEND}/api2/root`);
                    if (response.data && response.data.products) {
                        setContentData(response.data.products);
                    }
                }
            } catch (error) {
                console.error("Error fetching content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleCardClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const getCardStyle = () => ({
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s',
        backgroundColor: isDarkMode ? token.colorBgContainer : '#fff',
        borderColor: isDarkMode ? token.colorBorder : '#f0f0f0',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }
    });

    const getCardBodyStyle = () => ({
        padding: isMobile ? '8px' : '12px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isDarkMode ? token.colorBgContainer : '#fff',
    });

    const getImageStyle = () => ({
        width: '100%',
        height: isMobile ? '120px' : '200px',
        objectFit: 'contain',
        backgroundColor: isDarkMode ? token.colorBgContainer : '#fff',
    });

    const getTitleStyle = () => ({
        fontSize: isMobile ? '14px' : '16px',
        marginBottom: '8px',
        color: isDarkMode ? token.colorText : '#000',
        fontWeight: 'bold',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        lineHeight: '1.2',
    });

    const getPriceStyle = () => ({
        fontSize: isMobile ? '16px' : '18px',
        color: isDarkMode ? token.colorText : '#000',
        fontWeight: 'bold',
        marginTop: 'auto',
    });

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                backgroundColor: isDarkMode ? token.colorBgContainer : '#fff'
            }}>
                <Spin size="large"/>
            </div>
        );
    }

    return (
        <div style={{
            padding: isMobile ? '10px' : '20px',
            backgroundColor: isDarkMode ? token.colorBgContainer : '#fff'
        }}>
            <Row gutter={[16, 16]}>
                {contentData.map((item) => (
                    <Col xs={12} sm={8} md={6} lg={4} key={item.id}>
                        <Card
                            hoverable
                            onClick={() => handleCardClick(item.id)}
                            style={getCardStyle()}
                            bodyStyle={getCardBodyStyle()}
                            cover={
                                <img
                                    alt={item.name}
                                    src={item.image}
                                    style={getImageStyle()}
                                />
                            }
                        >
                            <Card.Meta
                                title={item.name}
                                description={`${item.price} ₽`}
                                style={{
                                    title: getTitleStyle(),
                                    description: getPriceStyle()
                                }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
