import {useEffect, useState} from "react";
import {fetchGetData} from "./Common/api.js";
import {ApiOutlined} from "@ant-design/icons";
import {Tooltip} from "antd";
import CatalogContent from "./ApiBridge/CatalogContent.jsx";

const ApiBridge = () => {
    const [vendors, setVendors] = useState([]);
    const [vendor, setVendor] = useState(null);

    const [status, setStatus] = useState(null);
    const [access, setAccess] = useState(null);

    const [ping, setPing] = useState(null);

    useEffect(() => {
        void loadVendors();
    }, []);

    const loadVendors = async () => {
        try {
            const data = await fetchGetData(`/service/vendors`);
            const list = data.vendors ?? [];
            setVendors(list);
            if (list.length === 1) {
                setVendor(list[0]);
            }
        } catch (e) {
            console.error(e);
            setStatus("network_error");
        }
    };

    useEffect(() => {
        if (vendor) {
            void initVendor(vendor);
        }
    }, [vendor]);


    const initVendor = async (vendor) => {
        if (!vendor) return;
        try {
            const pingData = await fetchGetData(`/service/${vendor.function}/vendors/${vendor.id}/ping`);
            setStatus(pingData.status);
            setPing(pingData.ping ?? null);
            const accessResponse = await fetchGetData(`/service/${vendor.function}/vendors/${vendor.id}/access-check`);
            if (accessResponse.status === "ok") {
                setAccess({
                    status: accessResponse.status,
                    contractorId: accessResponse.contractorId,
                    deliveryLocationId: accessResponse.deliveryLocationId
                });
            }

        } catch (e) {
            console.error(e);
            setStatus("network_error");
            setPing(null);
        }
    };


    const connected = status === "ok";

    return (
        <>

            <div style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: 10,
                userSelect: "none",
                paddingBottom: 10,
            }}>{vendors.length === 1 && vendor && (
                <div>{vendor.name} ({vendor.function})</div>
            )}
                <Tooltip title="Проверить соединение">
                    <div style={{display: "flex", alignItems: "center", gap: 8, cursor: "pointer"}}
                         onClick={() => initVendor(vendor)}>
                        <ApiOutlined style={{fontSize: 20, color: connected ? "limegreen" : "red"}}/>
                        {connected && ping !== null && (<span style={{color: "#999",}}>{ping} ms</span>)}
                        {!connected && (<span style={{color: "#999"}}>{status}</span>)}
                    </div>
                </Tooltip>

            </div>


            {vendor && access && (
                <CatalogContent
                    vendorId={vendor.id}
                    vendorFunction={vendor.function}
                    contractorId={access.contractorId}
                    deliveryLocationId={access.deliveryLocationId}
                />
            )}

        </>
    );
};

export default ApiBridge;
