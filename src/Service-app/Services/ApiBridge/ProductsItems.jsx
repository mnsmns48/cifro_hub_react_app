import {Table} from "antd";
import axios from "axios";
import {useEffect, useState} from "react";
import {getProductColumns} from "./ProductItemsColumns.jsx";

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
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);

    useEffect(() => {
        const ready = [categoryId, vendorId, contractorId, deliveryLocationId]
            .every(v => v != null);

        if (ready) {
            setLoaded(false);
            void loadProducts();
        }
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

            const uniqueBrands = [...new Set(items.map(p => p.brand).filter(Boolean))].sort();
            setBrands(uniqueBrands);

            setSelectedBrands([]);

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


    const filteredProducts =
        selectedBrands.length === 0
            ? products
            : products.filter(p => selectedBrands.includes(p.brand));

    const columns = getProductColumns(brands, selectedBrands);

    if (!loaded) return null;

    return (
        <Table
            dataSource={filteredProducts}
            columns={columns}
            key={categoryId}
            rowKey={(record) => `${record.productCode}-${record.brand}`}
            size="small"
            pagination={{pageSize: 30}}


            onChange={(pagination, filters) => {
                setSelectedBrands(filters.brand || []);
            }}
        />
    );
};

export default ProductsItems;
