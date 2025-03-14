import {Card, Image} from "antd";
import Meta from "antd/es/card/Meta";
import './ProductList.css';
import ProductFeatures from "./ProductFeatures.jsx";


function cleanTitle(title) {
    return title.replace(/смартфон/gi, '').trim();
}

const ProductList = ({content}) => {
    return (
        <>
            <div className="product-list-container">
                {Array.isArray(content) ? (
                    content.map((item) => (
                        <Card key={item.code} 
                              className="product-card"
                              hoverable={true}
                              size={"default"}
                              cover={<Image 
                                       src={`${import.meta.env.VITE_BACKEND}/api2/images/${item.code}.jpg`}
                                       alt={item.name} 
                                       className="product-image"
                                       onError={(e) => {
                                           console.error("Image load error:", e);
                                       }}/>}>
                            <div className="additional">
                                <p className="price">{`${item.price} ₽`}</p>
                            </div>
                            <div style={{textAlign: 'right'}}>
                                <Meta
                                    title={<span className="product-title">{cleanTitle(item.name)}</span>}
                                    description={`Осталось ${item.qty} шт`}
                                />
                            </div>
                            <div className="short-smart-phone-specification">
                                {'info' in item && <ProductFeatures info={item.info}/>}
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
