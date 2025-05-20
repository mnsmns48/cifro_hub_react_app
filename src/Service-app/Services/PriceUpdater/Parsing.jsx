import {Button} from "antd";
import {SettingOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import axios from "axios";
import ParsingProgress from "./ParsingProgress.jsx";

const Parsing = ({link}) => {
    console.log('link', link);
    const [loading, setLoading] = useState(false);
    const [parsingId, setParsingId] = useState(null);
    const [parsingStarted, setParsingStarted] = useState(false);

    const handleParse = async () => {
        if (!link.url) {
            console.warn("URL отсутствует!");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post("/service/give_parsing_id", {...link});
            setParsingId(response.data.request);
        } catch (error) {
            console.error("Ошибка запроса parsing id", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!parsingId || parsingStarted) return;
        setParsingStarted(true);
        handleStartParsing(parsingId)
            .catch(error => console.error("Ошибка запуска парсинга:", error));

    }, [parsingId]);


    const handleStartParsing = async (parsingId) => {
        try {
            await axios.post("/service/start_parsing", {request: parsingId, ...link});
        } catch (error) {
            console.error("Ошибка запуска парсинга:", error);
        }
    };


    return (
        <div className='parser_footer' style={{display: "flex", flexDirection: "column"}}>
            <Button icon={<SettingOutlined/>}
                    type="primary"
                    loading={loading}
                    onClick={handleParse}>парсинг</Button>
            {parsingStarted && (
                <div style={{marginTop: "15px", width: "100%"}}>
                    <ParsingProgress parsing_id={parsingId}/>
                </div>
            )}
        </div>
    );
};

export default Parsing;
