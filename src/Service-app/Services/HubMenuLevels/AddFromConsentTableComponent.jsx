import MyModal from "../../../Ui/MyModal.jsx";
import {Button} from "antd";
import {reCalculateApiLoad} from "./api.js";
import {useEffect, useState} from "react";


const AddFromConsentTableComponent = ({path_ids = [], origins = [], isOpen, onClose}) => {
    const [reCalcLoad, setReCalcLoad] = useState([]);


    useEffect(() => {

        const payload = {
            path_ids: path_ids.map(Number),
            origins: origins?.length ? origins.map(Number) : null
        };
        reCalculateApiLoad(payload).then(setReCalcLoad);
    }, [path_ids, origins]);


    const renderContent = () => (
        <div style={{padding: 16}}>
            <pre>{JSON.stringify(reCalcLoad, null, 2)}</pre>
        </div>
    );


    return (
        <MyModal
            isOpen={isOpen}
            onCancel={onClose}
            title="Обновляем"
            content={renderContent()}
            footer={
                <>
                    <Button type="primary" onClick={onClose} style={{padding: "6px 12px"}}>
                        Закрыть
                    </Button>
                    <Button type="primary" onClick={onClose} style={{padding: "6px 12px"}}>
                        Закрыть
                    </Button>
                </>
            }
            width={800}
        />
    );
};


export default AddFromConsentTableComponent;