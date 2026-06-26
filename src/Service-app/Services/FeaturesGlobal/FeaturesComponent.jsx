import {Button, Modal, Typography} from "antd";
import {useState} from "react";
import InfoTable from "./InfoTable.jsx";
import ProsConsTable from "./ProsConsTable.jsx";
import BulkInsertModal from "./BulkInsertModal.jsx";

const {Title} = Typography;

const FeaturesComponent = ({open, onClose, data, addedFromBulk}) => {
    const [bulkOpen, setBulkOpen] = useState(false);

    if (!open || !data) return null;

    const {title, info, pros_cons} = data;

    return (
        <>
            <Modal width={800} open={open} onCancel={onClose} footer={null}>
                <Title level={4}>{title}</Title>

                <div style={{display: "flex", justifyContent: "end", marginBottom: 8}}>
                    <Button size="small" onClick={() => setBulkOpen(true)}>
                        Загрузить блоком
                    </Button>
                </div>

                <InfoTable featureId={data.id} info={info}/>
                <br/>
                <ProsConsTable prosCons={pros_cons} featureId={data.id}/>
            </Modal>

            <BulkInsertModal
                open={bulkOpen}
                onClose={() => setBulkOpen(false)}
                featureId={data.id}
                addedFromBulk={addedFromBulk}
            />

        </>
    );
};

export default FeaturesComponent;
