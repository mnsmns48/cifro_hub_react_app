import {Modal, Typography} from "antd";
import InfoTable from "./InfoTable.jsx";
import ProsConsTable from "./ProsConsTable.jsx";

const {Title} = Typography;

const FeaturesComponent = ({open, onClose, data}) => {
    if (!open || !data) return null;

    const {title, info, pros_cons} = data;

    return (
        <Modal width={800} open={open} onCancel={onClose} footer={null}>
            <Title level={4}>{title}</Title>
            <InfoTable featureId={data.id} info={info}/>
            <br/>
            <ProsConsTable prosCons={pros_cons} featureId={data.id}/>
        </Modal>
    );
};

export default FeaturesComponent;
