import '../Service-utils/ActionParser.css';
import {Button, Select, Row, Col, Table, Input, Flex} from 'antd';
import {useEffect, useState} from "react";
import axios from "axios";
import {DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined, SettingOutlined} from "@ant-design/icons";
import MyModal from "../../Ui/MyModal.jsx";


const fetchVendors = async () => {
    try {
        const response = await axios.get('/service/vendors');
        return response.data.vendors?.map(vendor => ({
            value: String(vendor.id),
            label: vendor.name
        })) || [];
    } catch (error) {
        console.error('Ошибка загрузки данных', error);
        return [];
    }
};

const fetchTableData = async (vendorId) => {
    try {
        const response = await axios.get(`/service/get_vsl/${vendorId}`);
        return response.data.vsl || [];
    } catch (error) {
        console.error('Ошибка загрузки /get_vsl/${vendorId}:', error);
        return [];
    }
};

const SourceSelector = ({list, onChange}) => {
    return (
        <Select defaultValue={list.length > 0 ? list[0].value : undefined}
                defaultOpen={true}
                options={list}
                showSearch
                style={{width: '100%'}}
                placeholder="Select Vendor"
                optionFilterProp="label"
                onChange={onChange}/>
    );
};

const SearchTableSelector = ({tableData, refreshTableData, setSelectedRow, selectedRowKeys, setSelectedRowKeys}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVSL, setSelectedVSL] = useState(null);
    const [editingKey, setEditingKey] = useState(null);
    const [editedValues, setEditedValues] = useState({});

    const handleRowSelection = (selectedKeys, selectedRows) => {
        setSelectedRowKeys(selectedKeys);
        setSelectedRow(selectedRows[0] || null);
    };

    const handleEdit = (record) => {
        setEditingKey(record.id);
        setEditedValues(record);
    };

    const handleSave = (id) => {
        axios.put(`/service/update_vsl/${id}`, editedValues)
            .then(() => {
                refreshTableData();
                setEditingKey(null);
            })
            .catch(error => console.error('Ошибка обновления:', error));
    };

    const showDeleteModal = (vendor) => {
        setSelectedVSL(vendor);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedVSL) {
            axios.delete(`/service/delete_vsl/${selectedVSL.id}`)
                .then(() => {
                    refreshTableData();
                })
                .catch(error => console.error('Ошибка удаления:', error))
                .finally(() => {
                    setIsModalOpen(false);
                    setSelectedVSL(null);
                });
        }
    };

    const columns = [
        ...Object.keys(tableData[0] || {}).filter(key => key !== "id" && key !== "vendor_id").map(key => ({
            title: key,
            dataIndex: key,
            key,
            render: (text, record) =>
                editingKey === record.id ? (
                    <Input
                        value={editedValues[key] || ''}
                        onChange={(e) => setEditedValues(prev => ({...prev, [key]: e.target.value}))}
                    />
                ) : text
        })),
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => {
                let actionButton;
                if (editingKey === record.id) {
                    actionButton = <Button icon={<SaveOutlined/>} type="link" onClick={() => handleSave(record.id)}/>
                } else {
                    actionButton = <Button icon={<EditOutlined/>} type="link" onClick={() => handleEdit(record)}/>
                }
                return (
                    <div className='search_table_action_buttons'>
                        {actionButton}
                        <Button icon={<DeleteOutlined/>} type="link" danger onClick={() => showDeleteModal(record)}/>
                    </div>)
            }
        }
    ];

    return (
        <div>
            <Table rowSelection={{
                type: 'radio',
                onChange: handleRowSelection,
                selectedRowKeys: selectedRowKeys
            }}
                   onRow={(record) => ({
                       onClick: () => {
                           if (selectedRowKeys.includes(record.id)) {
                               setSelectedRowKeys([]);
                               setSelectedRow(null);
                           } else {
                               setSelectedRowKeys([record.id]);
                               setSelectedRow(record);
                           }
                       }
                   })}
                   columns={columns}
                   dataSource={tableData}
                   rowKey="id"/>
            <MyModal
                isOpen={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                content={`Удаляем ?`}
                danger={true}
                footer={<>
                    <Button type="primary" danger onClick={handleDeleteConfirm}>Удалить</Button>
                    <Button onClick={() => setIsModalOpen(false)}>Отмена</Button>
                </>}
            />
        </div>
    );
};

const ActionParser = () => {
    const [options, setOptions] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [inputVSLink, setInputVSLink] = useState("");
    const [inputTitle, setInputTitle] = useState("");
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        fetchVendors().then(setOptions);
    }, []);

    useEffect(() => {
        if (selectedSource) {
            fetchTableData(selectedSource).then(setTableData);
            setSelectedRow(null);
            setSelectedRowKeys(null);
        }

    }, [selectedSource]);

    const refreshTableData = async (newRec = null) => {
        if (!selectedSource) return;

        try {
            const updatedData = await fetchTableData(selectedSource);
            setTableData(updatedData);
            if (newRec) {
                setTimeout(() => {
                    const selectedEntry = updatedData.find(item => item.id === newRec.id);
                    if (selectedEntry) {
                        setSelectedRow(selectedEntry);
                        setSelectedRowKeys([selectedEntry.id]);
                    }
                }, 300);
            }
        } catch (error) {
            console.error("Ошибка при обновлении таблицы:", error);
        }
    };


    const addVSL = async (vendorId, newVSLData) => {
        if (!vendorId) {
            return;
        }
        try {
            const response = await axios.post(`/service/create_vsl/${vendorId}`,
                {id: 0, vendor_id: Number(vendorId), ...newVSLData});
            const newVsl = response.data.vsl;
            await refreshTableData(newVsl);
            setInputVSLink("");
            setInputTitle("");
            setSuccessMessage(`Ссылка "${newVsl.title}" успешно добавлена!`);
            setIsSuccessModalOpen(true);
        } catch (error) {
            if (error.response?.status === 409) {
                setErrorMessage("Ошибка: такая ссылка или название уже существует!");
            } else {
                setErrorMessage(`Ошибка добавления, проблема с сервером`);
            }
            setIsErrorModalOpen(true);
        }
    };

    return (
        <>
            <div className='action_parser_main'>
                <h1>Price Updater</h1>
            </div>
            <Row style={{alignItems: 'flex-start'}}>
                <Col span={7} className='left_col'>
                    <Flex vertical style={{'width': 300}}>
                        <SourceSelector list={options} onChange={setSelectedSource}/>
                        {!selectedRow && (<Input style={{marginTop: 8}} placeholder="Ссылка"
                                                 onChange={(e) => setInputVSLink(e.target.value)}
                                                 value={inputVSLink}/>)}
                        {inputVSLink && (
                            <div className='input_link_container'>
                                <Button type="primary" icon={<PlusOutlined/>} className='input_link'
                                        onClick={() => addVSL(selectedSource, {title: inputTitle, url: inputVSLink})}/>
                                <Input className='input_link_title' placeholder="Наименование ссылки"
                                       onChange={(e) => setInputTitle(e.target.value)}/>
                            </div>)
                        }
                        <div className='parser_footer'>
                            {selectedRow && (
                                <Button
                                    icon={<SettingOutlined/>}
                                    type="primary"
                                    onClick={() => {
                                        console.log(`Парсим URL: ${selectedRow.url}`)
                                    }}>Парсинг</Button>)}
                        </div>
                    </Flex>
                </Col>
                <Col span={15} className='right_col'>
                    <SearchTableSelector
                        tableData={tableData}
                        refreshTableData={refreshTableData}
                        setSelectedRow={setSelectedRow}
                        selectedRowKeys={selectedRowKeys}
                        setSelectedRowKeys={setSelectedRowKeys}/>
                </Col>
            </Row>
            <MyModal
                isOpen={isErrorModalOpen}
                onCancel={() => setIsErrorModalOpen(false)}
                content={errorMessage}
                danger={true}
                footer={<Button type="primary" danger onClick={() => setIsErrorModalOpen(false)}>ОК</Button>}
            />
            <MyModal
                isOpen={isSuccessModalOpen}
                onConfirm={() => setIsSuccessModalOpen(false)}
                onCancel={() => setIsSuccessModalOpen(false)}
                content={successMessage}
                footer={<button onClick={() => setIsSuccessModalOpen(false)}>OK</button>}
            />
        </>
    );
};

export default ActionParser;
