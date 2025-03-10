import {Card, Image, Tooltip} from "antd";
import Meta from "antd/es/card/Meta";
import './ProductList.css';
import ProductFeatures from "./ProductFeatures.jsx";

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
                            <Meta title={item.name} description={`Осталось ${item.qty} шт`}/>
                            {/*<Tooltip */}
                            {/*    title="Прокрутите для просмотра всех характеристик" */}
                            {/*    placement="bottomLeft"*/}
                            {/*    mouseEnterDelay={0.5}*/}
                            {/*>*/}
                                <div className="short-smart-phone-specification">
                                    {'info' in item && <ProductFeatures info={item.info}/>}
                                </div>
                            {/*</Tooltip>*/}
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
