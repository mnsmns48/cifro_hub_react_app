import {Table} from "antd";
import axios from "axios";
import {useEffect, useState} from "react";

const ProductsItems = ({
                           categoryId,
                           vendorId,
                           contractorId,
                           deliveryLocationId,
                           onProgressId,
                           onProgressDone,
                           setRowCount,
                           setExecTime
                       }) => {
    const [products, setProducts] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const ready = [categoryId, vendorId, contractorId, deliveryLocationId]
            .every(v => v != null);

        if (ready) {
            setLoaded(false);
            void loadProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId]);

    const loadProducts = async () => {
        try {
            const progressRes = await axios.get("/give_progress_line");
            const progressId = progressRes.data.result;
            onProgressId(progressId);

            const res = await axios.get(
                `/service/microline/vendors/${vendorId}/products`,
                {params: {categoryId, contractorId, deliveryLocationId, progress: progressId}}
            );

            const items = Array.isArray(res.data?.products) ? res.data.products : [];
            setProducts(items);
            setRowCount(res.data?.total ?? items.length);
            setExecTime(res.data?.exec_time);
            setLoaded(true);
        } catch (e) {
            console.error("loadProducts error:", e);
            setProducts([]);
            setRowCount(0);

            setLoaded(true);
        } finally {
            onProgressDone();
        }
    };

    if (!loaded) return null;

    const columns = [
        {title: "Название", dataIndex: "name", key: "name", width: "40%"},
        {title: "Код", dataIndex: "productCode", key: "productCode", width: 120},
        {title: "Бренд", dataIndex: "brand", key: "brand", width: 120},
        {title: "Цена", dataIndex: "price", key: "price", width: 120},
        {title: "Остаток", dataIndex: "amount", key: "amount", width: 100},
        {title: "Доставка", dataIndex: "delivery", key: "delivery", width: 100}
    ];

    return (
        <Table
            dataSource={products}
            columns={columns}
            rowKey="productCode"
            size="small"
            pagination={{pageSize: 30, showSizeChanger: true}}
        />
    );
};

export default ProductsItems;
