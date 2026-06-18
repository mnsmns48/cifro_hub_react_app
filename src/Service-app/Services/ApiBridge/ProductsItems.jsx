import {Table} from "antd";
import axios from "axios";
import {useEffect, useState} from "react";

const ProductsItems = ({categoryId, vendorId, contractorId, deliveryLocationId, onProgressId, setRowCount}) => {
    const [products, setProducts] = useState([]);


    useEffect(() => {
        const ready =
            [categoryId, vendorId, contractorId, deliveryLocationId]
                .every(v => v != null);
        if (ready) {
            void loadProducts();
        }

    }, [categoryId, contractorId, deliveryLocationId]);

    const loadProducts = async () => {
        if (!contractorId || !deliveryLocationId) return;

        try {
            // 1. Получаем progress_id
            const progressRes = await axios.get("/give_progress_line");
            const progressId = progressRes.data.result;

            // 2. Передаём progressId родителю
            onProgressId(progressId);

            // 3. Запускаем загрузку товаров
            const res = await axios.get(`/service/microline/vendors/${vendorId}/products`, {
                params: {categoryId, contractorId, deliveryLocationId, progress: progressId}
            });

            const items = Array.isArray(res.data?.products) ? res.data.products : [];
            setProducts(items);
            setRowCount(res.data?.total);

        } catch (e) {
            console.error("loadProducts error:", e);
            setProducts([]);
        }

    };

    const columns = [
        {
            title: "Название",
            dataIndex: "name",
            key: "name",
            width: "40%",
            render: (text) => <span style={{fontWeight: 500}}>{text}</span>
        },
        {
            title: "Код",
            dataIndex: "productCode",
            key: "productCode",
            width: 120
        },
        {
            title: "Бренд",
            dataIndex: "brand",
            key: "brand",
            width: 120
        },
        {
            title: "Цена",
            dataIndex: "price",
            key: "price",
            width: 120,
        },
        {
            title: "Остаток",
            dataIndex: "amount",
            key: "amount",
            width: 100
        },
        {
            title: "Доставка",
            dataIndex: "delivery",
            key: "delivery",
            width: 100
        }
    ];

    return (
        <div>
            <Table dataSource={products} columns={columns} rowKey="productCode" size="small"/>
        </div>
    );
};

export default ProductsItems;
