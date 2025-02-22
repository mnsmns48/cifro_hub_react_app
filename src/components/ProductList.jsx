import {Card, Flex, Image} from "antd";
import Meta from "antd/es/card/Meta";
import './ProductList.css';

const ProductList = ({content}) => {
    return (
        <>
            <Flex wrap gap="large" justify="start">
                {Array.isArray(content) ? (
                    content.map((item) => (
                        <Card key={item.code} title={item.name} style={{width: 300}}
                              hoverable={true}
                              size={"default"}
                              cover={<Image src={`${import.meta.env.VITE_BACKEND}/api2/images/${item.code}.jpg`}
                                            alt={item.name} style={{'width': '250px', margin: 8}}
                                            onError={(e) => {
                                                console.error("Image load error:", e);
                                            }}/>}>
                            <Meta title={`${item.price} руб`} description={`В наличии ${item.qty} шт`}/>
                            <div className="additional">
                                <p className="price">Price: 20$</p>
                            </div>
                        </Card>
                    ))
                ) : (
                    <p>No items to display</p>
                )}
            </Flex>
        </>
    );
};

export default ProductList;
