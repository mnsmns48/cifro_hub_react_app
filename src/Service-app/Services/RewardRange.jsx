import {Button, Select} from 'antd'
import {PlusOutlined} from "@ant-design/icons";
import {fetchRewards} from "./PriceUpdater/api.js";
import {useEffect, useState} from "react";

const RewardRange = () => {
    const [options, setOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);

    useEffect(() => {
        fetchRewards(setOptions);
    }, []);

    const handleChange = (value) => {
        setSelectedValue(value);
        console.log("Выбрано:", value);
    };


    return (
        <div className='action_parser_main'>
            <h1>Reward Range</h1>

            <Select
                labelInValue
                // style={{width: 200, marginBottom: 10}}
                placeholder="Выберите профиль вознаграждения"
                onChange={handleChange}
                options={options}
            />

            <Button type="primary" icon={<PlusOutlined/>} style={{marginTop: 10}}>
                Создать
            </Button>
        </div>
    )
}
export default RewardRange;