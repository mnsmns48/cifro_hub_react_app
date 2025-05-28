import {Button, Input, Select} from "antd";
import {useEffect, useState} from "react";
import {fetchRangeRewardsProfiles, addRangeRewardProfile} from "./RewardRangeSettings/api.js";
import {PlusOutlined} from "@ant-design/icons";


const RewardRangeSettings = () => {
    const [dataProfile, setDataProfile] = useState([]);
    const [isSelectedProfile, setIsSelectedProfile] = useState(null);
    const [newProfileName, setNewProfileName] = useState("");


    useEffect(() => {
        const loadRewards = async () => {
            const rewards = await fetchRangeRewardsProfiles();
            setDataProfile(rewards);
        };
        loadRewards();
    }, []);


    const handleChangeProfile = (selected) => {
        if (!selected || !selected.value) {
            setIsSelectedProfile(null); // ✅ Сбрасываем профиль
            return;
        }
        const profile = dataProfile.find(item => item.id === selected.value);

        if (!profile) {
            return;
        }
        setIsSelectedProfile(profile);
    };


    return (<div>
        <div className='action_parser_main'>
            <h1>Reward Range Settings</h1>
        </div>
        <Select
            labelInValue
            allowClear
            style={{width: 250}}
            placeholder="Выберите профиль"
            value={isSelectedProfile ? {value: isSelectedProfile.id, label: isSelectedProfile.title} : undefined}
            onChange={handleChangeProfile}
            options={[...dataProfile.map(item => ({value: item.id, label: item.title}))]}
        />
        <div style={{padding: "10px 0px 10px"}}>
            {!isSelectedProfile && (
                <>
                    <Button icon={<PlusOutlined/>}
                            disabled={!newProfileName.trim()}
                            onClick={() => addRangeRewardProfile(newProfileName, setDataProfile, setIsSelectedProfile, setNewProfileName)}
                    />
                    <Input placeholder="Название нового"
                           style={{width: "200px", margin: "10px 20px 10px"}}
                           onChange={(e) => setNewProfileName(e.target.value)}/>
                </>
            )}
        </div>
    </div>);
}

export default RewardRangeSettings;