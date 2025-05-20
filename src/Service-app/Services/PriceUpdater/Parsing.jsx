import {Button} from "antd";
import {SettingOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import axios from "axios";
import ParsingProgress from "./ParsingProgress.jsx";

const getProgressLine = async () => {
    try {
        const progress_line_response = await axios.get("/give_progress_line");
        return progress_line_response.data
    } catch (error) {
        console.error("Ошибка запроса", error);
    }
}

const startParsingProcess = async ({url, progress}) => {
    try {
        const parsingResult = await axios.post("/service/start_parsing", {url, progress});
        return parsingResult.data
    } catch (error) {
        console.error("Ошибка в Parsing Process", error);
    }
}


const Parsing = ({url}) => {
    const [isParsingStarted, setIsParsingStarted] = useState(false);
    const [progressLineObj, setProgressLineObj] = useState('');

    const clickParsingStartButton = async () => {
        const progress_line_response = await getProgressLine()
        if (progress_line_response.result) {
            setIsParsingStarted(true)
            setProgressLineObj(progress_line_response.result)
            await startParsingProcess({url: url, progress: progress_line_response.result})
        } else {
            console.log('progress_line_response error')
            setIsParsingStarted(false)
        }
    }


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
