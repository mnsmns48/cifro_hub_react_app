import {Modal, Input, Button, Tag} from "antd";
import {useState} from "react";

const CreateBrandOrTypeModal = ({open, onClose, mode, onCreate}) => {
    const [title, setTitle] = useState("");
    const [kindInput, setKindInput] = useState("");
    const [kindList, setKindList] = useState([]);

    const titleText = mode === "type" ? "Создание нового типа" : "Создание нового бренда";

    const addKind = () => {
        const v = kindInput.trim().toLowerCase();
        if (v.length < 2) return;
        if (kindList.includes(v)) return;

        setKindList([...kindList, v]);
        setKindInput("");
    };

    const removeKind = (k) => {
        setKindList(kindList.filter(item => item !== k));
    };

    const handleOk = () => {
        if (!title.trim()) return;
        if (!kindList.length) return;
        const payload = {title: title.trim(), kind: kindList}
        onCreate(payload);
        setTitle("");
        setKindInput("");
        setKindList([]);
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={handleOk}
            okText="Создать"
            cancelText="Отмена"
            title={titleText}
        >
            <div style={{display: "flex", flexDirection: "column", gap: 20, marginTop: 30}}>

                <Input
                    placeholder="Название"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div style={{display: "flex", gap: 8}}>
                    <Input
                        placeholder="Добавить слова синонимы. Это обязательно"
                        value={kindInput}
                        onChange={(e) => setKindInput(e.target.value)}
                        onPressEnter={addKind}
                    />
                    <Button type="primary" onClick={addKind}>Добавить</Button>
                </div>

                <div style={{display: "flex", flexWrap: "wrap", gap: 8}}>
                    {kindList.map((k) => (
                        <Tag key={k} closable onClose={() => removeKind(k)}>
                            {k}
                        </Tag>
                    ))}
                </div>

                {!kindList.length && (
                    <div style={{color: "red"}}>Слова-синонимы обязательны</div>
                )}
            </div>
        </Modal>
    );
};

export default CreateBrandOrTypeModal;
