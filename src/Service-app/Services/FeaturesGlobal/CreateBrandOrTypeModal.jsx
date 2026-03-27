import {Modal, Input} from "antd";
import {useState} from "react";

const CreateBrandOrTypeModal = ({open, onClose, mode, onCreate}) => {
    const [value, setValue] = useState("");

    const title = mode === "type" ? "Создание нового типа" : "Создание нового бренда";

    const handleOk = () => {
        onCreate(value);
        setValue("");
        onClose();
    };

    return (
        <Modal open={open}
               onCancel={onClose}
               onOk={handleOk}
               okText="Создать"
               cancelText="Отмена"
               title={title}
        >
            <div style={{display: "flex", flexDirection: "column", gap: 20, marginTop: 30}}>
                <Input placeholder="Название" value={value} onChange={(e) => setValue(e.target.value)}/>
            </div>
        </Modal>
    );
};

export default CreateBrandOrTypeModal;
