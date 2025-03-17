import {Card, Image} from "antd";
import Meta from "antd/es/card/Meta";
import './ProductList.css';
import ProductFeatures from "./ProductFeatures.jsx";
import { useNavigate } from 'react-router-dom';


function cleanTitle(title) {
    return title.replace(/смартфон/gi, '').trim();
}

const ProductList = ({content, endpoint}) => {
    const navigate = useNavigate();
    const handleProductClick = (productId, endpoint) => {
        navigate(`/${endpoint}_product/${productId}`);
    };

    return (
        <>
            <div className="product-list-container">
                {Array.isArray(content) ? (
                    content.map((item) => (
                        <Card
                            key={item.code}
                                // onClick={() => handleProductClick(item.code, endpoint)}
                            className="product-card"
                            hoverable={true}
                            size={"default"}
                            cover={
                                <Image
                                    src={`${import.meta.env.VITE_BACKEND}/api2/images/${item.code}.jpg`}
                                    alt={item.name}
                                    className="product-image"
                                    onError={(e) => { console.error("Image load error:", e); }} />}>
                            <div className="product-title">{cleanTitle(item.name)}</div>
                            <div className="additional">
                                <p className="price">{`${item.price} ₽`}</p>
                            </div>
                            <Meta description={`Осталось ${item.qty} шт`} style={{textAlign: 'right'}} />
                            <div className="short-smart-phone-specification">
                                {'info' in item && <ProductFeatures info={item.info} />}
                            </div>
                        </Card>
                    ))
                ) : (
                    <p>Здесь пусто</p>
                )}
            </div>
        </>
    );
};

export default ProductList;
