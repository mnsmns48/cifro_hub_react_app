import '../Service-utils/ActionParser.css';
import {Button, Select, Row, Col, Table} from 'antd';
import {useEffect, useState} from "react";
import axios from "axios";


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

    return (
        <>
            <div className='action_parser_main'>
                <h1>Price Updater</h1>
            </div>
            <Row style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Col span={6} className='left_col'>
                    <SourceSelector list={options} onChange={setSelectedSource}/>
                </Col>
                <Col span={12} className='right_col'>
                    <SearchTableSelector tableData={tableData}/>
                </Col>
            </Row>
            <div className='parser_footer'>
                <Button type="primary"
                        onClick={() => alert(`Парсинг!!!`)}> Процесс </Button>
            </div>
        </>
    );
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

const SearchTableSelector = ({tableData}) => {
    const columns = [
        {title: 'Название', dataIndex: 'title'},
        {title: 'Ссылка', dataIndex: 'url',
            render: (text) => <a href={text}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="table_url">{text}</a>
        },

    ];

    return (
        <div>
            <Table rowSelection={{type: 'radio'}} columns={columns} dataSource={tableData} rowKey="id"/>
        </div>
    );
};

export default ActionParser;
