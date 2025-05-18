import {Button} from "antd";
import {SettingOutlined} from "@ant-design/icons";
import {useState} from "react";
import axios from "axios";


const Parsing = ({ link }) => {

    const [loading, setLoading] = useState(false);

    const handleParse = async () => {
        if (!link.url) {
            console.warn("URL отсутствует!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("/service/give_parsing_id", { url: link.url });
            console.log("Parsing ID:", response.data.parsing_id, "URL:", response.data.url);
        } catch (error) {
            console.error("Ошибка запроса parsing_id:", error);
        } finally {
            setLoading(false);
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