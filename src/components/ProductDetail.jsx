import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from 'axios';

export default function ProductDetail() {
    const {productId} = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api2/product/${productId}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        if (productId) {
            fetchProduct();
        }
    }, [productId]);
    if (!product) return <div>Загрузка...</div>;
    return (
        <div>
            <h2>{product.name}</h2>
        </div>
    );
} 