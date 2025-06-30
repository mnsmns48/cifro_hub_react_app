import {Button, Checkbox} from "antd";
import {useState} from "react";
import {getProgressLine, startDataCollection} from "./api.js";
import MyModal from "../../../Ui/MyModal.jsx";

const ParsingButtonsCommonComponent = ({
                                           label,
                                           setProgressLineObj,
                                           setIsParsingStarted,
                                           confirmText,
                                           apiUrl,
                                           selectedRow,
                                           onComplete,
                                           icon = null
                                       }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [syncFeatures, setSyncFeatures] = useState(true);
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleConfirm = async () => {
        setConfirmOpen(false);
        const {result: progress} = await getProgressLine();
        if (!progress) return;
        setIsParsingStarted(true);
        setProgressLineObj(progress);
        let results;
        try {
            results = await startDataCollection({
                selectedRow,
                progress,
                api_url: apiUrl,
                sync_features: syncFeatures
            });
        } catch (e) {
            setErrorMessage("Сервер недоступен");
            setErrorOpen(true);
            setIsParsingStarted(false);
            setProgressLineObj("");
            return;
        }

        if (!results.is_ok) {
            setErrorMessage(results.message || "Нет результатов прошлого сбора");
            setErrorOpen(true);
            setIsParsingStarted(false);
            setProgressLineObj("");
            return;
        }
        onComplete(results);
    };

    return (
        <>
            <Button type="primary" icon={icon} style={{marginBottom: 8, marginTop: 15, width: "100%"}}
                    onClick={() => setConfirmOpen(true)}>{label}</Button>
            <MyModal isOpen={confirmOpen} title={confirmText} onConfirm={handleConfirm}
                     onCancel={() => {
                         setConfirmOpen(false);
                         setSyncFeatures(false);
                     }}
                     content={
                         <Checkbox checked={syncFeatures} onChange={e => setSyncFeatures(e.target.checked)}>
                             Синхронизировать характеристики устройств
                         </Checkbox>
                     }
                     footer={
                         <>
                             <Button key="no" onClick={() => {
                                 setConfirmOpen(false);
                                 setSyncFeatures(false)
                             }}>
                                 Нет
                             </Button>
                             <Button key="yes" type="primary" onClick={handleConfirm}>
                                 Да
                             </Button>
                         </>
                     }
            />

            <MyModal isOpen={errorOpen} title="Ошибка" content={errorMessage}
                     onConfirm={() => setErrorOpen(false)}
                     onCancel={() => setErrorOpen(false)}
                     footer={
                         <Button type="primary" onClick={() => setErrorOpen(false)}>
                             ОК
                         </Button>
                     }
                     danger
            />
        </>
    );
};

export default ParsingButtonsCommonComponent;
