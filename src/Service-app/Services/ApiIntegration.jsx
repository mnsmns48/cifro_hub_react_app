import {useEffect, useState} from "react";
import {ApiOutlined} from "@ant-design/icons";
import {Tooltip} from "antd";
import {fetchGetData} from "./Common/api.js";
import CategoriesTree from "./ApiIntegration/CategoriesTree.jsx";
import ProductsTable from "./ApiIntegration/ProductsTable.jsx";
import axios from "axios";

const ApiIntegration = () => {


    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]);

    const [contractorId, setContractorId] = useState(null);
    const [deliveryLocationId, setDeliveryLocationId] = useState(null);

    const [access, setAccess] = useState(null);

    const [status, setStatus] = useState(null);
    const [ping, setPing] = useState(null);

    // -----------------------------
    // LOAD VENDORS
    // -----------------------------
    const loadVendors = async () => {
        try {
            const data = await fetchGetData(`/service/vendors`);
            const list = data.vendors ?? [];

            setVendors(list);

            if (list.length === 1) {
                setVendorId(list[0].id);
                setVendorFunction(list[0].function);
            }
        } catch (e) {
            setStatus("network_error");
            console.log(e);
        }
    };

    // -----------------------------
    // PING
    // -----------------------------
    const loadPing = async () => {
        if (!vendorId || !vendorFunction) return;

        try {
            const data = await fetchGetData(
                `/service/${vendorFunction}/vendors/${vendorId}/ping`
            );
            setStatus(data.status);
            setPing(data.ping ?? null);
        } catch (e) {
            setStatus("network_error");
            setPing(null);
            console.log(e);
        }
    };


    const loadAccess = async () => {
        const data = await fetchGetData(`/service/${vendorFunction}/vendors/${vendorId}/access-check`);
        if (data.status === "ok") {
            setAccess(data);
            const allowed = data.accessMatrix.find(a => a.allowed);
            if (allowed) {
                setContractorId(allowed.contractorId);
                setDeliveryLocationId(allowed.deliveryLocationId);
            }
        }
    };

    // -----------------------------
    // LOAD PRODUCTS
    // -----------------------------
    const loadProducts = async (categoryId) => {
        if (!contractorId || !deliveryLocationId) return;

        try {
            const res = await axios.get(`/service/microline/vendors/${vendorId}/products`,
                {params: {categoryId, contractorId, deliveryLocationId}}
            );

            const items = Array.isArray(res.data?.products?.items)
                ? res.data.products.items
                : [];
            console.log(items);
            setProducts(items);
        } catch (e) {
            console.error("loadProducts error:", e);
            setProducts([]);
        }
    };

    // -----------------------------
    // EFFECTS
    // -----------------------------
    useEffect(() => {
        void loadVendors();
    }, []);

    useEffect(() => {
        if (vendorId && vendorFunction) {
            void loadPing();
            void loadAccess();
        }
    }, [vendorId, vendorFunction]);

    useEffect(() => {
        if (!selectedCategory) return;
        if (!contractorId) return;
        if (!deliveryLocationId) return;

        void loadProducts(selectedCategory);
    }, [selectedCategory, contractorId, deliveryLocationId]);

    // -----------------------------
    // RENDER
    // -----------------------------
    if (!status && vendors.length === 0) return <div>Загрузка...</div>;

    const ok = status === "ok";

    return (
        <div style={{display: "flex", flexDirection: "column", gap: 10}}>

            {vendors.length > 1 && (
                <select
                    value={vendorId ?? ""}
                    onChange={(e) => {
                        const id = Number(e.target.value);
                        const v = vendors.find(v => v.id === id);
                        setVendorId(id);
                        setVendorFunction(v.function);
                    }}
                    style={{padding: 5}}
                >
                    <option value="" disabled>Выберите вендора</option>
                    {vendors.map(v => (
                        <option key={v.id} value={v.id}>
                            {v.name} ({v.function})
                        </option>
                    ))}
                </select>
            )}

            <Tooltip title="Проверить соединение">
                <div
                    onClick={loadPing}
                    style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        gap: 10,
                        cursor: "pointer",
                        userSelect: "none"
                    }}
                >
                    <ApiOutlined
                        style={{
                            fontSize: 20,
                            color: ok ? "limegreen" : "red",
                            filter: ok
                                ? "drop-shadow(0 0 6px limegreen)"
                                : "drop-shadow(0 0 6px red)"
                        }}
                    />
                    {ok && ping !== null && (
                        <div style={{marginLeft: 10, color: "#999"}}>{ping} ms</div>
                    )}
                    {!ok && (
                        <div style={{marginLeft: 10, color: "#999"}}>{status}</div>
                    )}
                </div>
            </Tooltip>

            {vendorId && vendorFunction && (
                <CategoriesTree
                    vendorId={vendorId}
                    vendorFunction={vendorFunction}
                    onSelectCategory={setSelectedCategory}
                />
            )}

            <ProductsTable
                products={products}
            />

            {access && (
                <div style={{marginTop: 20}}>
                    <h4>Доступные комбинации:</h4>
                    <ul>
                        {access.accessMatrix
                            .filter(a => a.allowed)
                            .map(a => (
                                <li key={`${a.contractorId}-${a.deliveryLocationId}`}>
                                    contractorId={a.contractorId}, deliveryLocationId={a.deliveryLocationId}
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ApiIntegration;
