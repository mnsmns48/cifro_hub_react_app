import {PlusOutlined, MinusOutlined} from "@ant-design/icons";
import {fetchPostData} from "../Common/api.js";
import {Popconfirm} from "antd";
import {useState} from "react";
import ModalVendorApiSearchLines from "./CategoryInfoPanel/ModalVendorApiSearchLines.jsx";

const CategoryInfoPanel = ({
                               nodeKey,
                               title,
                               idPath,
                               alreadyExists,
                               vendorId,
                               onAdded,
                               onVslChanged,
                               onSaveParsingLines
                           }) => {

    const [openApiSearchLines, setOpenApiSearchLines] = useState(false);

    if (!nodeKey || !title || !idPath) {
        return null;
    }

    const bgColor = alreadyExists?.status === true ? "#b7e8c8" : "#f4f4f4";

    const handleAdd = async (e) => {
        e.stopPropagation();
        try {
            const payload = {

                vendor_id: vendorId,
                category_id: nodeKey,
                title,
                id_path: idPath
            };
            const res = await fetchPostData("/service/api_bridge/add_vendor_api_search", payload);
            if (res.status === "ok") {
                onAdded({
                    ...payload,
                    id: res.id,
                    search_params: null,
                    status: true
                });
            }
        } catch (e) {
            console.error("Add error:", e);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        try {
            const payload = {
                vendor_id: vendorId,
                category_id: nodeKey
            };
            const res = await fetchPostData("/service/api_bridge/delete_vendor_api_search", payload);
            if (res.status === "ok") {
                onAdded({
                    vendor_id: vendorId,
                    category_id: nodeKey,
                    title: null,
                    id_path: null,
                    search_params: null,
                    status: false
                });
            }
        } catch (e) {
            console.error("Delete error:", e);
        }
    };


    return (
        <>
            <div
                onClick={() => alreadyExists?.status === true && setOpenApiSearchLines(true)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 12px",
                    background: bgColor,
                    borderRadius: 6,
                    marginBottom: 12,
                    fontSize: 15,
                    cursor: alreadyExists?.status ? "pointer" : "default"
                }}
            >
                <div style={{flexGrow: 1}}>
                    <div style={{fontWeight: 600}}>{title}</div>
                    <div style={{color: "#c6c6c6", fontSize: 13}}>
                        {nodeKey} • Путь: {idPath}
                    </div>
                </div>

                {alreadyExists?.status === false && (
                    <PlusOutlined
                        style={{fontSize: 18, color: "#52c41a", cursor: "pointer"}}
                        onClick={handleAdd}
                    />
                )}

                {alreadyExists?.status === true && (
                    <Popconfirm
                        title="Удалять запись категорчиески нельзя, можно лишиться всех ранее созданных связей"
                        okText="Удалить"
                        cancelText="Отмена"
                        onConfirm={handleDelete}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MinusOutlined
                            style={{fontSize: 18, color: "#ff4d4f", cursor: "pointer"}}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Popconfirm>
                )}
            </div>
            {openApiSearchLines && alreadyExists?.id && (
                <ModalVendorApiSearchLines
                    open={openApiSearchLines}
                    onClose={() => setOpenApiSearchLines(false)}
                    apiSearchId={alreadyExists.id}
                    vendorId={vendorId}
                    onVslChange={onVslChanged}
                    onSaveParsingLines={onSaveParsingLines}
                />
            )}

        </>
    );
};

export default CategoryInfoPanel;
