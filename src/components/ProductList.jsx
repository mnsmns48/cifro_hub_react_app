import {Card, Image} from "antd";
const ProductList = ({ content }) => {
    return (
        <>
            {Array.isArray(content) ? (
                content.map((item) => (
                    <Card key={item.code} title={item.name}>
                        <Image src={`${import.meta.env.VITE_BACKEND}/api2/images/${item.code}.jpg`}
                               alt={item.name} style={{ 'width': '200px' }}
                               onError={(e) => {console.error("Image load error:", e);
                        }}/>
                    </Card>
                ))
            ) : (
                <p>No items to display</p>
            )}
        </>
    );
};

export default ProductList;
