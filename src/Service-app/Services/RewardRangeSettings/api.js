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
        const response = await axios.post("/service/add_reward", {title: newProfileName});
        const newProfile = response.data;
        setDataProfile(prev => {
            const updatedProfiles = [...prev, newProfile];
            setIsSelectedProfile(newProfile);
            return updatedProfiles;
        });
        setNewProfileName("");
    } catch (error) {
        console.error("Ошибка добавления:", error.response ? error.response.data : error.message);
    }
};

export const deleteRangeRewardProfile = async (isSelectedProfile, setDataProfile, setIsSelectedProfile) => {
    try {
        await axios.delete(`/service/delete_range_line/${isSelectedProfile.id}`);

        setDataProfile(prev => prev.filter(profile => profile.id !== isSelectedProfile.id));
        setIsSelectedProfile(null);
    } catch (error) {
        console.error("Ошибка удаления профиля:", error.response ? error.response.data : error.message);
    }
};

export const updateRewardRangeProfile = async (rangeId, updatedTitle, setDataProfile, setIsSelectedProfile) => {
    try {
        const response = await axios.put(`/service/update_range_line/${rangeId}`, {
            title: updatedTitle
        });
        setDataProfile(prev => prev.map(profile =>
            profile.id === rangeId ? { ...profile, title: updatedTitle } : profile
        ));
        setIsSelectedProfile(prev => ({ ...prev, title: updatedTitle }));

        return response.data;
    } catch (error) {
        console.error("Ошибка обновления профиля:", error.response ? error.response.data : error.message);
    }
};


export const fetchRangeRewardLines = async (range_id) => {
    try {
        const response = await axios.get(`/service/get_reward_line/${range_id}`);
        return response.data;
    } catch (error) {
        console.error("Проблема с бэкендом", error);
        return [];
    }
};

