import {Button, Collapse, Input, Select} from "antd";
import {useEffect, useState} from "react";
import {
    fetchRangeRewardsProfiles,
    addRangeRewardProfile,
    deleteRangeRewardProfile,
    updateRewardRangeProfile
} from "./RewardRangeSettings/api.js";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import RewardRangeTable from "./RewardRangeSettings/RewardRangeTable.jsx";
import MyModal from "../../Ui/MyModal.jsx";


const RewardRangeSettings = () => {
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
                placeholder="Выберите профиль"
                value={isSelectedProfile ? {value: isSelectedProfile.id, label: isSelectedProfile.title} : undefined}
                onChange={handleChangeProfile}
                options={[...dataProfile.map(item => ({value: item.id, label: item.title}))]}
            />

            {isSelectedProfile && (
                <Collapse style={{width: 500}}>
                    <Collapse.Panel header={`Управление профилем "${isSelectedProfile.title}"`} key="1">
                        <div style={{display: "flex", justifyContent: "center", gap: "10px"}}>
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
            {/*{isSelectedProfile && (*/}
            {/*    <Button type="primary" icon={<PlusOutlined/>} onClick={handleAddRewardRangeLine}>*/}
            {/*        Добавить строку</Button>*/}
            {/*)*/}
            {/*}*/}
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