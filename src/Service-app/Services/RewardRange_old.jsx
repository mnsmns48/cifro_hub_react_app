import { Button, Select } from 'antd';
import { fetchRewards } from "./PriceUpdater/api.js";
import { useEffect, useState } from "react";
import RewardRangeTable_old from "./RewardRange_old/RewardRangeTable_old.jsx";
import axios from "axios";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import {data} from "react-router-dom";

const RewardRange_old = () => {
    const [dataProfile, setDataProfile] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [isAdding, setIsAdding] = useState(false); //

    useEffect(() => {
        const loadRewards = async () => {
            const rewards = await fetchRewards();
            setDataProfile(rewards);
        };
        loadRewards();
    }, []);

    const handleDelete = async (lineId) => {
        try {
            await axios.delete(`/service/delete_reward_line/${lineId}`);
            setSelectedProfile(prev => ({
                ...prev,
                lines: prev.lines.filter(line => line.id !== lineId)
            }));
        } catch (error) {
            console.error("Ошибка удаления:", error.response ? error.response.data : error.message);
        }
    };


    const handleSave = async (newData) => {
        try {
            const payload = {
                range_id: selectedProfile.id,
                line_from: Number(newData.line_from),
                line_to: Number(newData.line_to),
                is_percent: Boolean(newData.is_percent),
                reward: Number(newData.reward)
            };

            const response = await axios.post("/service/add_reward_line", payload);

            setSelectedProfile(prev => ({
                ...prev,
                lines: [...prev.lines, response.data.data]
            }));

            setIsAdding(false);
        } catch (error) {
            console.error("Ошибка добавления:", error.response ? error.response.data : error.message);
        }
    };



    const handleChange = (selected) => {
        const profile = dataProfile.find(item => item.id === selected.value);
        setSelectedProfile(profile);
    };

    const handleToggleAdd = () => {
        setIsAdding(prev => !prev);
    };

    return (
        <div className='action_parser_main'>
            <h1>Reward Range</h1>
            <Select
                labelInValue
                placeholder="Выберите профиль"
                onChange={handleChange}
                options={[
                    { value: "", label: "Создать" },
                    ...dataProfile.map(item => ({ value: item.id, label: item.title }))
                ]}
            />
            {selectedProfile && (
                <RewardRangeTable_old selectedProfile={selectedProfile} onDelete={handleDelete} isAdding={isAdding} onSave={handleSave} />
            )}
            <Button
                icon={isAdding ? <MinusOutlined /> : <PlusOutlined />} // ✅ Меняем иконку в зависимости от `isAdding`
                style={{ padding: "20px", margin: "0 auto" }}
                onClick={handleToggleAdd} // ✅ Обрабатываем клик
            />
        </div>
    );
};

export default RewardRange_old;
