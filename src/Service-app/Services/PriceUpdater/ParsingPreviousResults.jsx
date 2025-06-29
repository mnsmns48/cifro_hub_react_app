import ParsingProgress from "./ParsingProgress.jsx";
import {getProgressLine, startDataCollection} from "./api.js";
import {Button} from "antd";
import {useEffect, useState} from "react";

const ParsingPreviousResults = ({selectedRow, onComplete}) => {
    const [isParsingStarted, setIsParsingStarted] = useState(false);
    const [progressLineObj, setProgressLineObj] = useState('');

    const handleFetchPreviousResults = async () => {
        const progress_line_response = await getProgressLine()
        if (progress_line_response.result) {
            setIsParsingStarted(true)
            setProgressLineObj(progress_line_response.result)
            const results = await startDataCollection(
                {
                    selectedRow,
                    progress: progress_line_response.result,
                    api_url: "/service/previous_parsing_results"
                }
            )
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
        <>
            <Button type="primary" style={{marginBottom: 8}} onClick={handleFetchPreviousResults}>Предыдущие
                результаты</Button>
            {isParsingStarted && (
                <div style={{marginBottom: "15px", marginTop: "15px", width: "100%"}}>
                    <ParsingProgress progress_obj={progressLineObj}/>
                </div>
            )}
        </>
    );
};

export default ParsingPreviousResults;