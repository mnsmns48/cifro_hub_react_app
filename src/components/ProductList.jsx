import {Card, Flex, Image} from "antd";
import Meta from "antd/es/card/Meta";
import './ProductList.css';
import ProductFeatures from "./ProductFeatures.jsx";

const ProductList = ({content}) => {
    return (
        <>
            <Flex wrap gap="large" justify="start">
                {Array.isArray(content) ? (
                    content.map((item) => (
                        <Card key={item.code} style={{width: 300}}
                              hoverable={true}
                              size={"default"}
                              cover={<Image src={`${import.meta.env.VITE_BACKEND}/api2/images/${item.code}.jpg`}
                                            alt={item.name} style={{'width': '280px', margin: 5}}
                                            onError={(e) => {
                                                console.error("Image load error:", e);
                                            }}/>}>
                            <div className="additional">
                                <p className="price">{`${item.price} ₽`}</p>
                            </div>
                            <Meta title={item.name} description={`Осталось ${item.qty} шт`}/>
                            <div className="short-smart-phone-specification ">
                                {'info' in item && <ProductFeatures info={item.info}/>}
                            </div>
                        </Card>
                    ))
                ) : (
                    <p>Здесь пусто</p>
                )}
            </Flex>
        </>
    );
};

export default ProductList;
