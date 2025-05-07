import {useEffect, useState} from 'react';
import {Table} from 'antd';
import axios from 'axios';

const Vendors = () => {
    const [vendors, setVendors] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        axios.get('/service/vendors')
            .then(response => {
                const vendorData = response.data.vendors || [];
                setVendors(vendorData);
                if (vendorData.length > 0) {
                    const dynamicColumns = Object.keys(vendorData[0]).map(key => ({
                        title: key.charAt(0).toUpperCase() + key.slice(1),
                        dataIndex: key,
                        key,
                        render: (value) => key === 'source' ?
                            <a href={value} target="_blank" rel="noopener noreferrer">{value}</a> : value
                    }));
                    setColumns(dynamicColumns);
                }
            })
            .catch(error => console.error('Ошибка загрузки данных:', error));
    }, []);

    return (
        <div style={{padding: '20px'}}>
            <h2>Vendors</h2>
            <Table columns={columns} dataSource={vendors} rowKey="id"/>
        </div>
    );
};

export default Vendors;