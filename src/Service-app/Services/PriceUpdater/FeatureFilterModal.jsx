import {Modal, Checkbox, Button, Typography} from "antd";
import {useState, useMemo} from "react";

const {Text} = Typography;

const FeatureFilterModal = ({visible, onClose, rows, onApply}) => {
    const [selectedFeatures, setSelectedFeatures] = useState([]);


    const featureCounts = useMemo(() => {
        const counts = {};
        rows.forEach(row => {
            if (Array.isArray(row.features_title)) {
                row.features_title.forEach(feature => {
                    counts[feature] = (counts[feature] || 0) + 1;
                });
            }
        });
        return counts;
    }, [rows]);


    const sortedFeatures = useMemo(() => {
        return ["-------", ...Object.keys(featureCounts).sort()];
    }, [featureCounts]);

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
                <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                    {sortedFeatures.map(f => (
                        <Checkbox key={f} value={f}>
                            {f === "-------" ? (
                                <Text type="danger">{f}</Text>
                            ) : (
                                <>
                                    {f}{" "}
                                    <Text type="secondary" style={{ color: "#1677ff" }}>
                                       ... {featureCounts[f]}
                                    </Text>
                                </>
                            )}
                        </Checkbox>
                    ))}
                </div>
            </Checkbox.Group>
        </Modal>
    );
};

export default FeatureFilterModal;
