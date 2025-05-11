import '../Service-utils/ActionParser.css';
import {Button, Select, Row, Col, Table, Input} from 'antd';
import {useEffect, useState} from "react";
import axios from "axios";
import {DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import MyModal from "../../Ui/MyModal.jsx";


const fetchVendors = async () => {
    try {
        const response = await axios.get('/service/vendors');
        return response.data.vendors?.map(vendor => ({
            value: String(vendor.id),
            label: vendor.name
        })) || [];
    } catch (error) {
        console.error('Ошибка загрузки /service/vendors:', error);
        return [];
    }
};

const fetchTableData = async (vendorId) => {
    try {
        console.log(vendorId)
        const response = await axios.get(`/service/get_vsl/${vendorId}`);
        console.log(response.data)
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


const SearchTableSelector = ({tableData, refreshTableData, setSelectedRow}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVSL, setSelectedVSL] = useState(null);
    const [editingKey, setEditingKey] = useState(null);
    const [editedValues, setEditedValues] = useState({});

    const handleRowSelection = (selectedKeys, selectedRows) => {
        setSelectedRow(selectedRows[0] || null); // 🔥 Устанавливаем выбранную строку
    };


    const handleEdit = (record) => {
        setEditingKey(record.id);
        setEditedValues(record);
    };


    const handleSave = (id) => {
        axios.put(`/service/update_vsl/${id}`, editedValues)
            .then(response => {
                console.log('Обновлено:', response.data);
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
                .then(response => {
                    console.log('Удалено:', response.data);
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
            <Table rowSelection={{type: 'radio', onChange: handleRowSelection}} columns={columns}
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

    useEffect(() => {
        fetchVendors().then(setOptions);
    }, []);

    useEffect(() => {
        if (selectedSource) {
            fetchTableData(selectedSource).then(setTableData);
        }
    }, [selectedSource]);

    const refreshTableData = () => {
        if (selectedSource) {
            fetchTableData(selectedSource).then(setTableData);
        }
    };

    const addVSL = (vendorId, newVSLData) => {
        if (!vendorId) {
            console.error("Ошибка: vendorId не передан!");
            return;
        }
        console.log("Отправляем данные:", newVSLData);
        axios.post(`/service/create_vsl/${vendorId}`, newVSLData)
            .then(response => {
                console.log('Добавлено:', response.data);
                refreshTableData();
            })
            .catch(error => {
                if (error.response?.status === 409) {
                    setErrorMessage("Ошибка: такая ссылка или название уже существует!");
                } else {
                    setErrorMessage("Ошибка добавления. Попробуйте снова.");
                }
                setIsErrorModalOpen(true);
            });
    };

    return (
        <>
            <div className='action_parser_main'>
                <h1>Price Updater</h1>
            </div>
            <Row style={{alignItems: 'flex-start'}}>
                <Col span={7} className='left_col'>
                    <SourceSelector list={options} onChange={setSelectedSource}/>
                    {!selectedRow && (<Input style={{marginTop: 8}} placeholder="Ссылка"
                                             onChange={(e) => setInputVSLink(e.target.value)}/>)}
                    {inputVSLink && (
                        <div className='input_link_container'>
                            <Button type="primary" icon={<PlusOutlined/>} className='input_link'
                                    onClick={() => addVSL(selectedSource, {title: inputTitle, url: inputVSLink})}/>
                            <Input className='input_link_title' placeholder="Наименование ссылки"
                                   onChange={(e) => setInputTitle(e.target.value)}/>
                        </div>)
                    }
                    <div className='parser_footer'>
                        <Button type="primary" onClick={() => alert(`Парсинг!!!`)}> Процесс </Button>
                    </div>
                </Col>
                <Col span={15} className='right_col'>
                    <SearchTableSelector tableData={tableData} refreshTableData={refreshTableData}
                                         setSelectedRow={setSelectedRow}/>
                </Col>
            </Row>
            <MyModal
                isOpen={isErrorModalOpen}
                onCancel={() => setIsErrorModalOpen(false)}
                content={errorMessage}
                danger={true}
                footer={<Button type="primary" danger onClick={() => setIsErrorModalOpen(false)}>ОК</Button>}
            />
        </>
    );
};

export default ActionParser;
