import {Button, Popconfirm} from "antd";
import {SettingOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import ParsingProgress from "./ParsingProgress.jsx";
import {getProgressLine, startParsingProcess} from "./api.js";


const Parsing = ({selectedRow, onComplete}) => {
    const [isParsingStarted, setIsParsingStarted] = useState(false);
    const [progressLineObj, setProgressLineObj] = useState('');


    const clickParsingStartButton = async () => {
        const progress_line_response = await getProgressLine()
        if (progress_line_response.result) {
            setIsParsingStarted(true)
            setProgressLineObj(progress_line_response.result)
            const results = await startParsingProcess({selectedRow, progress: progress_line_response.result})
            onComplete(results);
        } else {
            setIsParsingStarted(false)
        }
    }

    useEffect(() => {
        if (!isParsingStarted) {
            setProgressLineObj("");
        }
    }, [isParsingStarted]);

    return (
        <><Popconfirm title="Вы уверены, что хотите запустить парсинг?" onConfirm={clickParsingStartButton}
                      okText="Да" cancelText="Нет">
            <Button icon={<SettingOutlined/>} type="primary" style={{marginTop: "15px", width: "100%"}}> Старт</Button>
        </Popconfirm>

            {isParsingStarted && (
                <div style={{marginBottom: "15px", marginTop: "15px", width: "100%"}}>
                    <ParsingProgress progress_obj={progressLineObj}/>
                </div>
            )}
        </>
    );
};

export default Parsing;