import {message, Table} from "antd";
import axios from "axios";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {getProductColumns} from "./ProductItemsColumns.jsx";
import {fetchPostData} from "../Common/api.js";
import "./styles.css"

const ProductsItems = forwardRef(({
                                      categoryId,
                                      vendorId,
                                      contractorId,
                                      deliveryLocationId,
                                      onProgressId,
                                      onProgressDone,
                                      setRowCount,
                                      setExecTime,
                                      setAlreadyExists,
                                      selectedProducts,
                                      setSelectedProducts
                                  }, ref) => {

        const [products, setProducts] = useState([]);
        const [loaded, setLoaded] = useState(false);
        const [brands, setBrands] = useState([]);
        const [selectedBrands, setSelectedBrands] = useState([]);
        const [debouncedSearch, setDebouncedSearch] = useState("");
        const [search, setSearch] = useState("");


        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedSearch(search);
            }, 300);

            return () => clearTimeout(handler);
        }, [search]);


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
                setAlreadyExists(res.data?.already_exists ?? null);
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


        const filteredProducts = products
            .filter(p => {
                const brandOk =
                    selectedBrands.length === 0 ||
                    selectedBrands.includes(p.brand);

                const searchOk =
                    !debouncedSearch ||
                    p.name.toLowerCase().includes(debouncedSearch.toLowerCase());

                return brandOk && searchOk;
            });


        const columns = getProductColumns(brands, search, setSearch);

        const productsSelection = {
            selectedRowKeys: selectedProducts.map(
                p => `${p.productCode}-${p.brand}`
            ),
            onChange: (selectedRowKeys, selectedRows) => {
                setSelectedProducts(selectedRows);
            }
        };

        useImperativeHandle(ref, () => ({
            saveParsingLines: async (linkedVSL) => {
                console.log("linkedVSL", linkedVSL);
                console.log("products", products);
                await fetchPostData("/service/update_parsing_line_data_from_api", {
                    linked_VSL: linkedVSL,
                    raw_products: products
                });
                message.success("ParsingLine обновлены");
            }
        }));

        if (!loaded) return null;


        return (
            <Table
                rowSelection={productsSelection}
                className="products-items-table"
                dataSource={filteredProducts}
                columns={columns}
                key={categoryId}
                rowKey={(record) => `${record.productCode}-${record.brand}`}
                size="small"
                pagination={false}
                onChange={(filters) => {
                    setSelectedBrands(filters.brand || []);
                }}
            />
        );
    }
);
ProductsItems.displayName = "ProductsItems";
export default ProductsItems;
