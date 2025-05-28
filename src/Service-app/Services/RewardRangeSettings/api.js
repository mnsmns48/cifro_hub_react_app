import axios from "axios";


export const fetchRangeRewardsProfiles = async () => {
    try {
        const response = await axios.get("/service/get_rewards");
        return response.data;
    } catch (error) {
        console.error("Проблема с бэкендом", error);
        return [];
    }
};


export const addRangeRewardProfile = async (newProfileName, setDataProfile, setIsSelectedProfile, setNewProfileName) => {
    try {
        const response = await axios.post("/service/add_reward", { title: newProfileName });
        const newProfile = response.data;
        setDataProfile(prev => {
            const updatedProfiles = [...prev, newProfile];
            setIsSelectedProfile(newProfile);  // ✅ Выбираем новый профиль
            return updatedProfiles;
        });
        setNewProfileName("");
    } catch (error) {
        console.error("Ошибка добавления:", error.response ? error.response.data : error.message);
    }
};
