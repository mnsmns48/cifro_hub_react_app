import MyModal from "../../../Ui/MyModal.jsx";
import SmartPhone from "../../../Cifrotech-app/components/products/smartPhone.jsx";
import {Spin} from "antd";

const DependencyModal = ({open, onClose, data}) => {
    return (
        <MyModal
            isOpen={open}
            onConfirm={onClose}
            onCancel={onClose}
            title={
                <div style={{textAlign: "center"}}>
                    {data?.title || "Детали"}
                </div>
            }
            content={
                <div style={{textAlign: "left"}}>
                    {data ? <SmartPhone info={{info: data.info, source: data.source}}/> : <Spin/>}
                </div>
            }
            footer={null}
        />
    );
};

export default DependencyModal;
