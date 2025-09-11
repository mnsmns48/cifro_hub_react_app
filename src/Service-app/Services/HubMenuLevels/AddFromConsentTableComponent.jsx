import MyModal from "../../../Ui/MyModal.jsx";
import {Button} from "antd";

const AddFromConsentTableComponent = ({ path_ids = [], origins = [], isOpen, onClose }) => {
    return (
        <MyModal
            isOpen={isOpen}
            onCancel={onClose}
            title="Обновляем"
            content={
                <div style={{ padding: 16 }}>
                    <h3>Path IDs</h3>
                    <ul>
                        {path_ids.map((id, index) => (
                            <li key={`path-${index}`}>
                                {typeof id === "object" ? JSON.stringify(id) : id}
                            </li>
                        ))}
                    </ul>

                    <h3>Origins</h3>
                    <ul>
                        {origins.map((origin) => (
                            <li key={`origin-${origin}`}>{origin}</li>
                        ))}
                    </ul>
                </div>
            }
            footer={
                <Button type="primary" onClick={onClose} style={{ padding: "6px 12px" }}>
                    Закрыть
                </Button>
            }
            width={800}
        />
    );
};


export default AddFromConsentTableComponent;