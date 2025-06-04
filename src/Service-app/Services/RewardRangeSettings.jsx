import {Button, Collapse, Input, Select} from "antd";
import {useEffect, useState} from "react";
import {
    fetchRangeRewardsProfiles,
    addRangeRewardProfile,
    deleteRangeRewardProfile,
    updateRewardRangeProfile,
    updateDefaultProfile
} from "./RewardRangeSettings/api.js";
import {DeleteOutlined, EditOutlined, PlusOutlined, CheckCircleOutlined, SelectOutlined} from "@ant-design/icons";
import RewardRangeTable from "./RewardRangeSettings/RewardRangeTable.jsx";
import MyModal from "../../Ui/MyModal.jsx";


const RewardRangeSettings = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [dataProfile, setDataProfile] = useState([]);
    const [isSelectedProfile, setIsSelectedProfile] = useState(null);
    const [newProfileName, setNewProfileName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("")
    const [isAddingNewLine, setIsAddingNewLine] = useState(false);


    useEffect(() => {
        fetchRangeRewardsProfiles().then(rewards => {
            setDataProfile(rewards);
            if (rewards.length > 0) {
                setIsSelectedProfile(rewards[0]);
            }
        }).catch(error => {
            console.error("Ошибка загрузки профиля:", error);
        });
    }, []);

    useEffect(() => {
    }, [dataProfile]);

    const handleChangeProfile = (selected) => {
        if (!selected || !selected.value) {
            setIsSelectedProfile(null);
            return;
        }
        const profile = dataProfile.find(item => item.id === selected.value);

        if (!profile) {
            return;
        }
        setIsSelectedProfile(profile);
    };

    const handleSetDefaultProfile = async () => {
        if (!isSelectedProfile) return;
        setIsLoading(true);
        try {
            const updatedId = await updateDefaultProfile(isSelectedProfile.id);
            const updatedProfiles = dataProfile.map(profile => ({
                ...profile,
                is_default: profile.id === updatedId
            }));
            setDataProfile([...updatedProfiles]);
            const updatedSelected = updatedProfiles.find(profile => profile.id === isSelectedProfile.id);
            setIsSelectedProfile(updatedSelected);
        } catch (error) {
            console.error("Ошибка:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleOpenModal = () => {
        setNewTitle(isSelectedProfile.title);
        setIsModalOpen(true);
    };


    const handleConfirmRename = async () => {
        await updateRewardRangeProfile(isSelectedProfile.id, newTitle, setDataProfile, setIsSelectedProfile);
        setIsModalOpen(false);
    };


    return (<div>
        <div className='action_parser_main'>
            <h1>Настройка профилей вознаграждения</h1>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: "20px"}}>
            <Select
                labelInValue
                allowClear
                style={{width: 250, height: 50}}
                placeholder="Выбрать профиль"
                value={
                    isSelectedProfile
                        ? {
                            value: isSelectedProfile.id,
                            label: (
                                <>{isSelectedProfile.title} {isSelectedProfile.is_default && <CheckCircleOutlined/>}</>
                            ),
                        }
                        : undefined
                }
                onChange={handleChangeProfile}
                options={dataProfile.map((item) => ({
                    value: item.id,
                    label: (
                        <> {item.title} {item.is_default && <CheckCircleOutlined/>}</>
                    ),
                }))}
            />


            {isSelectedProfile && (
                <Collapse style={{width: 600}}>
                    <Collapse.Panel header={"Управление профилем"} key="1">
                        <div style={{display: "flex", justifyContent: "center"}}>
                            {isSelectedProfile.is_default ? (
                                <Button icon={<CheckCircleOutlined/>} type="primary" style={{margin: 10}}
                                        disabled>
                                    Выбран по-умолчанию
                                </Button>
                            ) : (
                                <Button icon={<SelectOutlined/>}
                                        type="default" style={{margin: 10}} onClick={handleSetDefaultProfile}
                                        loading={isLoading}
                                        disabled={isLoading}>
                                    Установить по-умолчанию
                                </Button>
                            )}
                            <Button icon={<EditOutlined/>} type="default" style={{margin: 10}}
                                    onClick={handleOpenModal}>
                                Изменить название
                            </Button>
                            <Button icon={<DeleteOutlined/>}
                                    type="primary" style={{margin: 10}}
                                    onClick={() => deleteRangeRewardProfile(
                                        isSelectedProfile, setDataProfile, setIsSelectedProfile)}>
                                Удалить
                            </Button>
                        </div>
                    </Collapse.Panel>
                </Collapse>
            )}
        </div>

        <div style={{padding: "10px 0px 10px"}}>
            {!isSelectedProfile && (
                <>
                    <Button icon={<PlusOutlined/>}
                            disabled={!newProfileName.trim()}
                            onClick={() => addRangeRewardProfile(
                                newProfileName,
                                setDataProfile,
                                setIsSelectedProfile,
                                setNewProfileName)}
                    />
                    <Input placeholder="Название нового профиля"
                           style={{width: "200px", margin: "10px 20px 10px"}}
                           onChange={(e) => setNewProfileName(e.target.value)}/>
                </>
            )}
            {isSelectedProfile && (
                <RewardRangeTable selectedProfile={isSelectedProfile}
                                  isAddingNewLine={isAddingNewLine}
                                  setIsAddingNewLine={setIsAddingNewLine}/>
            )}
            <MyModal
                isOpen={isModalOpen}
                onConfirm={handleConfirmRename}
                onCancel={() => setIsModalOpen(false)}
                title="Изменить название профиля"
                footer={
                    <>
                        <Input placeholder="Новое название профиля" value={newTitle}
                               onChange={(e) => setNewTitle(e.target.value)}/>
                        <Button type="primary" onClick={handleConfirmRename}>OK</Button>
                        <Button onClick={() => setIsModalOpen(false)}>Отмена</Button>
                    </>
                }
            />
        </div>
    </div>);
}
RewardRangeSettings.componentTitle = "Настройка вознаграждения"
RewardRangeSettings.componentIcon = <img src="/ui/rubli-6.png" alt="icon" width="30" height="30"/>
export default RewardRangeSettings;