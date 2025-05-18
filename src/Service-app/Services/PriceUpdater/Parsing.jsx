import {Button} from "antd";
import {SettingOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import axios from "axios";


const Parsing = ({link}) => {
    const [loading, setLoading] = useState(false);
    const [parsingId, setParsingId] = useState(null);


    const handleParse = async () => {
        if (!link.url) {
            console.warn("URL отсутствует!");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post("/service/give_parsing_id", { url: link.url });
            setParsingId(response.data.parsing_id);
        } catch (error) {
            console.error("Ошибка запроса parsing id", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (parsingId) {
            (async () => {
                await handleStartParsing(parsingId);
            })();
        }
    }, [parsingId]);


    const handleStartParsing = async (parsingId) => {
        if (!parsingId) {
            console.warn("Parsing ID отсутствует!");
            return;
        }
        try {
            const response = await axios.post("/service/start_parsing", { parsing_id: parsingId, url: link.url });
        } catch (error) {
            console.error("Ошибка запуска парсинга:", error);
        }
    };



    return (
        <div className='parser_footer'>
            <Button icon={<SettingOutlined/>}
                    type="primary"
                    loading={loading}
                    onClick={handleParse}>парсинг</Button>

        </div>
    )
};

export default Parsing;