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
            console.log("Ответ /service/give_parsing_id", response.data);

            setParsingId(response.data.parsing_id);  // Обновляем состояние

        } catch (error) {
            console.error("Ошибка запроса parsing_id:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (parsingId) {
            handleStartParsing(parsingId);
        }
    }, [parsingId]);

    const handleStartParsing = async (parsingId) => {
        if (!parsingId) {
            console.warn("Parsing ID отсутствует!");
            return;
        }
        try {
            console.log("Отправка:", { parsing_id: parsingId, url: link.url });
            const response = await axios.post("/service/start_parsing", { parsing_id: parsingId, url: link.url });
            console.log("Результат из /service/start_parsing", response.data);
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