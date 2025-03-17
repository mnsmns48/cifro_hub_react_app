import {Card, Image, Pagination} from "antd";
import Meta from "antd/es/card/Meta";
import './ProductList.css';
import ProductFeatures from "./ProductFeatures.jsx";
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';


function cleanTitle(title) {
    return title.replace(/смартфон/gi, '').trim();
}

const ProductList = ({content, endpoint}) => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const pageSize = 12;
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentProducts = Array.isArray(content)  ? content.slice(startIndex, endIndex)  : [];

    const handleProductClick = (productId, endpoint) => {
        navigate(`/${endpoint}_product/${productId}`);
    };
    const handlePageChange = (page) => {
        setSearchParams({ ...Object.fromEntries(searchParams), page: page });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            {Array.isArray(content) && content.length > pageSize && (
                <div style={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    padding: '20px 0'
                }}>
                    <Pagination
                        current={currentPage}
                        total={content.length}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductList;
