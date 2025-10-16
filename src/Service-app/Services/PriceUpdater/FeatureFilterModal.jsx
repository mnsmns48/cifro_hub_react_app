import {Modal, Checkbox, Button, Typography} from "antd";
import {useState, useMemo} from "react";

const { Text } = Typography;

const FeatureFilterModal = ({visible, onClose, rows, onApply}) => {
    const [selectedFeatures, setSelectedFeatures] = useState([]);

    const allFeatures = useMemo(() => {
        const withFeatures = rows.filter(row =>
            Array.isArray(row.features_title) && row.features_title.length > 0
        );
        const flat = withFeatures.flatMap(row => row.features_title);
        const unique = Array.from(new Set(flat)).sort();
        return ["-------", ...unique];
    }, [rows]);



    const handleChange = (checkedValues) => {
        setSelectedFeatures(checkedValues);
    };

    const handleApply = () => {
        onApply(selectedFeatures);
        onClose();
    };

    return (
        <Modal
            open={visible}
            title="Фильтр по признакам"
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>Отмена</Button>,
                <Button key="apply" type="primary" onClick={handleApply}>Применить</Button>
            ]}
        >
            <Checkbox.Group value={selectedFeatures} onChange={handleChange}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {allFeatures.map(f => (
                        <Checkbox key={f} value={f}>
                            {f === "-------" ? <Text type="danger">{f}</Text> : f}
                        </Checkbox>
                    ))}
                </div>
            </Checkbox.Group>
        </Modal>
    );
};

export default FeatureFilterModal;
