import MyModal from "../../../Ui/MyModal.jsx";
import { Popconfirm } from "antd";
import "./Css/ComparisonModal.css";

const ComparisonModal = ({ isOpen, onClose, content }) => {
    const renderContent = () => {
        if (Array.isArray(content)) {
            return (
                <div className="modal-links">
                    {content.map((url, index) => (
                        <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                            {url}
                        </a>
                    ))}
                </div>
            );
        }

        return <pre style={{ whiteSpace: "pre-wrap" }}>{content}</pre>;
    };

    return (
        <MyModal
            isOpen={isOpen}
            onConfirm={onClose}
            onCancel={onClose}
            content={renderContent()}
            footer={
                <Popconfirm title="Точно закрываем?" okText="Да" cancelText="Нет" onConfirm={onClose}>
                    <button className="modal-button">Закрыть</button>
                </Popconfirm>
            }
        />
    );
};


export default ComparisonModal;
