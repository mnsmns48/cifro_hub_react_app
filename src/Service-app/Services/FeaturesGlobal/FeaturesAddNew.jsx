import {useEffect, useState} from "react";
import {Modal, Select, Input, Button, message} from "antd";
import {fetchGetData, fetchPostData} from "../SchemeAttributes/api.js";
import CreateBrandOrTypeModal from "./CreateBrandOrTypeModal.jsx";
import {LoginOutlined} from "@ant-design/icons";

const FeaturesAddNew = ({open, onClose, onCreated}) => {
    const [types, setTypes] = useState([]);
    const [brands, setBrands] = useState([]);

    const [selectedType, setSelectedType] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [title, setTitle] = useState("");

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [createMode, setCreateMode] = useState(null);

    useEffect(() => {
        if (!open) return;

        async function load() {
            const response = await fetchGetData("/service/features/types_brands_request");

            if (response) {
                setTypes(response.types || []);
                setBrands(response.brands || []);
            }
        }

        void load();
    }, [open]);

    const onTypeChange = (value) => {
        if (value === "__create_type__") {
            setCreateMode("type");
            setCreateModalOpen(true);
            return;
        }
        setSelectedType(value);
    };

    const onBrandChange = (value) => {
        if (value === "__create_brand__") {
            setCreateMode("brand");
            setCreateModalOpen(true);
            return;
        }
        setSelectedBrand(value);
    };

    const typeOptions = [
        ...types.map(t => ({label: t.type, value: t.id})),
        {
            label: (
                <span style={{display: "flex", alignItems: "center", gap: 6}}>
                <LoginOutlined style={{color: "purple"}}/>
                Создать новый тип
            </span>
            ),
            value: "__create_type__"
        }
    ];

    const brandOptions = [
        ...brands.map(b => ({label: b.brand, value: b.id})),
        {
            label: (
                <span style={{display: "flex", alignItems: "center", gap: 6}}>
                <LoginOutlined style={{color: "purple"}}/>
                Создать новый бренд
            </span>
            ),
            value: "__create_brand__"
        }
    ];

    const handleCreateFeature = async () => {
        if (!selectedType) {
            message.error("Выберите тип");
            return;
        }
        if (!selectedBrand) {
            message.error("Выберите бренд");
            return;
        }
        if (!title.trim()) {
            message.error("Введите название");
            return;
        }

        const payload = {
            title,
            type_obj: types.find(t => t.id === selectedType),
            brand_obj: brands.find(b => b.id === selectedBrand)
        };

        const created = await fetchPostData("/service/features/create_new_feature_global", payload);

        if (created && created.id) {
            message.success("Продукт успешно создан");

            onCreated(created);
            setSelectedType(null);
            setSelectedBrand(null);
            setTitle("");
            onClose();
        }

    };

    return (
        <>
            <Modal
                width={800}
                open={open}
                onCancel={() => {
                    onClose();
                    setSelectedType(null);
                    setSelectedBrand(null);
                    setTitle("")
                }}

                footer={
                    <Button type="primary" onClick={handleCreateFeature}>
                        Создать
                    </Button>
                }
            >
                <div style={{display: "flex", flexDirection: "column", gap: 20, marginTop: 30}}>

                    <Select
                        placeholder="Выберите тип"
                        value={selectedType}
                        onChange={onTypeChange}
                        options={typeOptions}
                        style={{width: "100%"}}
                    />

                    <Select
                        placeholder="Выберите бренд"
                        value={selectedBrand}
                        onChange={onBrandChange}
                        style={{width: "100%"}}
                        options={brandOptions}
                    />

                    <Input
                        placeholder="Название нового продукта"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
            </Modal>

            <CreateBrandOrTypeModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                mode={createMode}
                onCreate={async (name) => {
                    if (createMode === "type") {
                        const created = await fetchPostData("/service/features/add_new_type", {title: name});
                        if (created && created.id) {
                            setTypes(prev => [...prev, created]);
                            setSelectedType(created.id);
                        }
                    } else {
                        const created = await fetchPostData("/service/features/add_new_brand", {title: name});
                        if (created && created.id) {
                            setBrands(prev => [...prev, created]);
                            setSelectedBrand(created.id);
                        }
                    }
                }}
            />
        </>
    );
};

export default FeaturesAddNew;
