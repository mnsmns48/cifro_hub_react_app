import {Button} from "antd";
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
            console.log('progress_line_response error')
            setIsParsingStarted(false)
        }
    }

    useEffect(() => {
        if (!isParsingStarted) {
            setProgressLineObj("");
        }
    }, [isParsingStarted]);

    return (
        <>
            <Button icon={<SettingOutlined/>} type="primary" onClick={clickParsingStartButton}>Старт</Button>
            {isParsingStarted && (
                <div style={{marginBottom: "15px", marginTop: "15px", width: "100%"}}>
                    <ParsingProgress progress_obj={progressLineObj}/>
                </div>
            )}
        </>
    );
};

export default Parsing;