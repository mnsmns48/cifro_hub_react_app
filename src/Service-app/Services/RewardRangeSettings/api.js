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
        const response = await axios.post("/service/add_reward",
            {title: newProfileName, is_default: false});
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
        await axios.delete(`/service/delete_range_profile/${isSelectedProfile.id}`);

        setDataProfile(prev => prev.filter(profile => profile.id !== isSelectedProfile.id));
        setIsSelectedProfile(null);
    } catch (error) {
        console.error("Ошибка удаления профиля:", error.response ? error.response.data : error.message);
    }
};

export const updateRewardRangeProfile = async (rangeId, updatedTitle, setDataProfile, setIsSelectedProfile) => {
    try {
        const response = await axios.put(`/service/update_range_profile/${rangeId}`, {
            title: updatedTitle
        });
        setDataProfile(prev => prev.map(profile =>
            profile.id === rangeId ? {...profile, title: updatedTitle} : profile
        ));
        setIsSelectedProfile(prev => ({...prev, title: updatedTitle}));

        return response.data;
    } catch (error) {
        console.error("Ошибка обновления профиля:", error.response ? error.response.data : error.message);
    }
};

export const updateDefaultProfile = async (profileId) => {
    try {
        await axios.put(`/service/update_range_profile_is_default/${profileId}`);
        return profileId;
    } catch (error) {
        console.error("Ошибка установки профиля:", error);
        throw error;
    }
};


export const fetchRangeRewardLines = async (range_id) => {
    try {
        const response = await axios.get(`/service/get_reward_lines/${range_id}`);
        return response.data;
    } catch (error) {
        console.error("Проблема с бэкендом", error);
        return [];
    }
};


export const deleteRewardRangeLine = async (lineId) => {
    try {
        const response = await axios.delete(`/service/delete_reward_line/${lineId}`);
        return response.data;
    } catch (error) {
        console.error("Ошибка удаления строки:", error.response?.data || error.message);
        throw error;
    }
};


export const addRewardRangeLine = async (newLineData) => {
    console.log('newLineData', newLineData);
    try {
        const response = await axios.post("/service/add_reward_range_line", newLineData);
        return response.data;
    } catch (error) {
        console.error("Ошибка при добавлении строки:", error.response?.data || error.message);
        throw error;
    }
};

export const updateRewardRangeLine = async (lineId, updatedData) => {
    try {
        const response = await axios.put(`/service/update_reward_line/${lineId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("Ошибка при обновлении строки:", error.response?.data || error.message);
        throw error;
    }
};