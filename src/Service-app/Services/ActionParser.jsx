import '../Service-utils/ActionParser.css';
import {Button, Select, Row, Col, Table} from 'antd';
import {useEffect, useState} from "react";
import axios from "axios";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
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


const ActionParser = () => {
    const [options, setOptions] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null);
    const [tableData, setTableData] = useState([]);

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

    return (
        <>
            <div className='action_parser_main'>
                <h1>Price Updater</h1>
            </div>
            <Row style={{alignItems: 'flex-start'}}>
                <Col span={7} className='left_col'>
                    <SourceSelector list={options} onChange={setSelectedSource}/>
                    <div className='parser_footer'>
                        <Button type="primary" onClick={() => alert(`Парсинг!!!`)}> Процесс </Button>
                    </div>
                </Col>
                <Col span={14} className='right_col'>
                    <SearchTableSelector tableData={tableData} refreshTableData={refreshTableData} />
                </Col>
            </Row>
        </>
    )
        ;
};

const SourceSelector = ({list, onChange}) => {
    return (
        <Select
            options={list}
            showSearch
            style={{width: 300}}
            placeholder="Select Vendor"
            optionFilterProp="label"
            onChange={onChange}
        />
    );
};

const SearchTableSelector = ({tableData, refreshTableData}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVSL, setSelectedVSL] = useState(null);

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
        {title: 'Название', dataIndex: 'title'},
        {
            title: 'Ссылка', dataIndex: 'url',
            render: (text) => <a href={text}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="table_url">{text}</a>
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <div style={{display: 'flex', justifyContent: 'center', gap: '8px'}}>
                    <Button icon={<EditOutlined/>} type="link"/>
                    <Button icon={<DeleteOutlined/>} type="link" danger onClick={() => showDeleteModal(record)}/>
                </div>
            )
        }

    ];

    return (
        <div>
            <Table rowSelection={{type: 'radio'}} columns={columns}
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

export default ActionParser;
