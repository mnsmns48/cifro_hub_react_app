import {Card, Image, Pagination} from "antd";
import Meta from "antd/es/card/Meta";
import './ProductList.css';
import ProductFeatures from "./ProductFeatures.jsx";
import {useNavigate, useSearchParams} from 'react-router-dom';


function cleanTitle(title) {
    return title.replace(/смартфон/gi, '').trim();
}

const ProductList = ({content, endpoint}) => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(import.meta.env.VITE_PAGINATION_SIZE);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentProducts = Array.isArray(content) ? content.slice(startIndex, endIndex) : [];

    const handleProductClick = (productId, endpoint) => {
        navigate(`/${endpoint}_product/${productId}`);
    };
    const handlePageChange = (page) => {
        setSearchParams({...Object.fromEntries(searchParams), page: page});
    };
    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div className="product-list-container">
                {Array.isArray(content) ? (
                    currentProducts.map((item) => (
                        <Card
                            key={item.code}
                            // onClick={() => handleProductClick(item.code, endpoint)}
                            className="product-card"
                            hoverable={true}
                            size={"default"}
                            cover={
                                <Image
                                    src={`/api2/images/${item.code}.jpg`} //${import.meta.env.VITE_BACKEND}
                                    alt={item.name}
                                    className="product-image"
                                    onError={(e) => {
                                        console.error("Image load error:", e);
                                    }}/>}>
                            <div className="product-title">{cleanTitle(item.name)}</div>
                            <div className="additional">
                                <p className="price">{`${item.price} ₽`}</p>
                            </div>
                            <Meta description={`Осталось ${item.qty} шт`} style={{textAlign: 'right'}}/>
                            <div className="short-smart-phone-specification">
                                {'info' in item && <ProductFeatures info={item.info}/>}
                            </div>
                        </Card>
                    ))
                ) : (
                    <p>Здесь пусто</p>
                )}
            </div>
            {Array.isArray(content) && content.length > pageSize && (
                <Pagination current={currentPage} total={content.length} pageSize={pageSize} onChange={handlePageChange}/>
            )}
        </div>
    );
};

export default ProductList;
