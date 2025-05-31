import {useEffect, useState} from "react";
import {addRewardRangeLine, deleteRewardRangeLine, fetchRangeRewardLines, updateRewardRangeLine} from "./api.js";
import {Button, Input, Space, Switch, Table} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined, RedoOutlined, SaveOutlined} from "@ant-design/icons";
import '../Css/RewardRangeSettings.css'


const RewardRangeTable = ({selectedProfile, isAddingNewLine, setIsAddingNewLine}) => {
    const [rangeData, setRangeData] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [editedValues, setEditedValues] = useState({});
    const [newLine, setNewLine] = useState(null);


    useEffect(() => {
        if (!selectedProfile) return;
        fetchRangeRewardLines(selectedProfile.id).then(rewards => {
            setRangeData(rewards);
        }).catch(error => {
            console.error("Ошибка загрузки строк таблицы:", error);
        });
    }, [selectedProfile]);


    useEffect(() => {
        if (isAddingNewLine) {
            const newEntry = {
                id: `new_${Date.now()}`,
                range_id: selectedProfile.id,
                line_from: "",
                line_to: "",
                is_percent: false,
                reward: ""
            };

            setNewLine(newEntry);
            setEditingKey(newEntry.id);
            setEditedValues(newEntry);
            setIsAddingNewLine(false);
        }
    }, [isAddingNewLine]);

    const handleSaveNewLine = async () => {
        if (!newLine) return;
        try {
            await addRewardRangeLine(newLine);
            const updatedData = await fetchRangeRewardLines(selectedProfile.id);
            setRangeData(updatedData);
            setNewLine(null);
            setEditingKey(null);
        } catch (error) {
            console.error("Ошибка при добавлении строки:", error);
        }
    };

    const handleDeleteRewardRangeLine = async (lineId) => {
        try {
            await deleteRewardRangeLine(lineId);
            setRangeData(prevData => prevData.filter(item => item.id !== lineId));
        } catch (error) {
            console.error("Ошибка при удалении:", error);
        }
    };


    const handleSaveEdit = async (record) => {
        try {
            const updatedLine = await updateRewardRangeLine(record.id, editedValues);
            setRangeData(prevData =>
                prevData.map(item => item.id === record.id ? updatedLine : item)
            );
            setEditingKey(null);
        } catch (error) {
            console.error("Ошибка при обновлении строки", error);
        }
    };


    const handleCancelNewLine = () => {
        setEditingKey(null);
    };

    const handleEdit = (record) => {
        setEditingKey(record.id);
        setEditedValues({...record});
    };


    const columns = [
        {
            title: "От",
            dataIndex: "line_from",
            key: "line_from",
            width: 180,
            render: (text, record) =>
                editingKey === record.id || record === newLine ? (
                    <Input
                        type="number"
                        value={record === newLine ? newLine.line_from : editedValues.line_from ?? record.line_from}
                        onChange={(e) => {
                            const numericValue = Number(e.target.value);
                            if (record === newLine) {
                                setNewLine(prev => ({...prev, line_from: numericValue}));
                            } else {
                                setEditedValues(prev => ({...prev, line_from: numericValue}));
                            }
                        }}
                    />
                ) : text
        },
        {
            title: "До",
            dataIndex: "line_to",
            key: "line_to",
            width: 180,
            render: (text, record) =>
                editingKey === record.id || record === newLine ? (
                    <Input
                        type="number"
                        value={record === newLine ? newLine.line_to : editedValues.line_to ?? record.line_to}
                        onChange={(e) => {
                            const numericValue = Number(e.target.value);
                            if (record === newLine) {
                                setNewLine(prev => ({...prev, line_to: numericValue}));
                            } else {
                                setEditedValues(prev => ({...prev, line_to: numericValue}));
                            }
                        }}
                    />
                ) : text
        },
        {
            title: "Процент?",
            dataIndex: "is_percent",
            key: "is_percent",
            width: 100,
            render: (val, record) =>
                editingKey === record.id || record === newLine ? (
                    <Switch
                        checked={record === newLine ? newLine.is_percent : editedValues.is_percent ?? record.is_percent}
                        onChange={(checked) => {
                            if (record === newLine) {
                                setNewLine(prev => ({...prev, is_percent: checked}));
                            } else {
                                setEditedValues(prev => ({...prev, is_percent: checked}));
                            }
                        }}
                    />
                ) : <Switch checked={val} disabled/>
        },
        {
            title: "Вознаграждение / Процент",
            dataIndex: "reward",
            key: "reward",
            width: 180,
            render: (text, record) =>
                editingKey === record.id || record === newLine ? (
                    <Input
                        type="number"
                        value={record === newLine ? newLine.reward : editedValues.reward ?? record.reward}
                        onChange={(e) => {
                            const numericValue = Number(e.target.value);
                            if (record === newLine) {
                                setNewLine(prev => ({...prev, reward: numericValue}));
                            } else {
                                setEditedValues(prev => ({...prev, reward: numericValue}));
                            }
                        }}
                    />
                ) : text
        },
        {
            title: "Действия",
            key: "actions",
            width: 120,
            render: (_, record) => (
                <Space>
                    {record === newLine ? (
                        <>
                            <Button
                                icon={<SaveOutlined/>}
                                type="link"
                                onClick={handleSaveNewLine}
                                disabled={!newLine.line_from || !newLine.line_to || !newLine.reward}
                            />
                            <Button
                                icon={<RedoOutlined/>}
                                type="text"
                                danger
                                onClick={handleCancelNewLine}
                            />
                        </>
                    ) : editingKey === record.id ? (
                        <>
                            <Button icon={<SaveOutlined/>} type="link" onClick={() => handleSaveEdit(record)}/>
                            <Button icon={<RedoOutlined/>} type="text" danger onClick={() => setEditingKey(null)}/>
                        </>
                    ) : (
                        <>
                            <Button icon={<EditOutlined/>} type="link" onClick={() => handleEdit(record)}/>
                            <Button icon={<DeleteOutlined/>} type="text"
                                    onClick={() => handleDeleteRewardRangeLine(record.id)}/>
                        </>
                    )}
                </Space>
            )
        }
    ];


    return (
        <div>
            <Table
                dataSource={newLine ? [...rangeData, newLine] : rangeData}
                columns={columns}
                rowKey="id"
            />
            <Button icon={<PlusOutlined/>} onClick={() => setIsAddingNewLine(true)}>
                Добавить
            </Button>
        </div>
    );
}

export default RewardRangeTable;