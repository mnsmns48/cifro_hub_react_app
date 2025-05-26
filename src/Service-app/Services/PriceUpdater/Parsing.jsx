import {Button} from "antd";
import {SettingOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import ParsingProgress from "./ParsingProgress.jsx";
import {getProgressLine, startParsingProcess} from "./api.js";


const Parsing = ({url, onComplete}) => {
    const [isParsingStarted, setIsParsingStarted] = useState(false);
    const [progressLineObj, setProgressLineObj] = useState('');


    const clickParsingStartButton = async () => {
        const progress_line_response = await getProgressLine()
        if (progress_line_response.result) {
            setIsParsingStarted(true)
            setProgressLineObj(progress_line_response.result)
            const results = await startParsingProcess({url: url, progress: progress_line_response.result})
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
        <div className='parser_footer' style={{display: "flex", flexDirection: "column"}}>
            <Button icon={<SettingOutlined/>} type="primary" onClick={clickParsingStartButton}>парсинг</Button>
            {isParsingStarted && (
                <div style={{marginTop: "15px", width: "100%"}}>
                    <ParsingProgress progress_obj={progressLineObj}/>
                </div>
            )}
        </div>
    );
};

export default Parsing;