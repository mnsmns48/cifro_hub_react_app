import {PlusOutlined, MinusOutlined} from "@ant-design/icons";
import {fetchPostData} from "../Common/api.js";
import {Popconfirm} from "antd";

const CategoryInfoPanel = ({nodeKey, title, idPath, alreadyExists, vendorId, onAdded}) => {
    if (!nodeKey || !title || !idPath) {
        return null;
    }

    const bgColor = alreadyExists === true ? "#b7e8c8" : "#f4f4f4";

    const handleAdd = async () => {
        try {
            const payload = {
                vendor_id: vendorId,
                category_id: nodeKey,
                title,
                id_path: idPath
            };

            const res = await fetchPostData("/service/api_bridge/add_vendor_api_search", payload);

            if (res.status === "ok") {
                onAdded(true);
            }
        } catch (e) {
            console.error("Add error:", e);
        }
    };


    const handleDelete = async () => {
        try {
            const payload = {
                vendor_id: vendorId,
                category_id: nodeKey
            };

            const res = await fetchPostData("/service/api_bridge/delete_vendor_api_search", payload);

            if (res.status === "ok") {
                onAdded(false);
            }
        } catch (e) {
            console.error("Delete error:", e);
        }
    };


    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 12px",
            background: bgColor,
            borderRadius: 6,
            marginBottom: 12,
            fontSize: 15
        }}>
            <div style={{flexGrow: 1}}>
                <div style={{fontWeight: 600}}>{title}</div>
                <div style={{color: "#c6c6c6", fontSize: 13}}>
                    {nodeKey} • Путь: {idPath}
                </div>
            </div>

            {!alreadyExists && (
                <PlusOutlined
                    style={{fontSize: 18, color: "#52c41a", cursor: "pointer"}}
                    onClick={handleAdd}
                />
            )}

            {alreadyExists && (
                <Popconfirm
                    title="Удалить запись?"
                    description="Эта категория будет удалена из VendorApiSearch"
                    okText="Удалить"
                    cancelText="Отмена"
                    onConfirm={handleDelete}
                >
                    <MinusOutlined
                        style={{fontSize: 18, color: "#ff4d4f", cursor: "pointer"}}
                    />
                </Popconfirm>
            )}
        </div>
    );
};

export default CategoryInfoPanel;
