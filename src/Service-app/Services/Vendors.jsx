import {Button, Table, Input} from 'antd';
import {EditOutlined, DeleteOutlined, SaveOutlined, PlusOutlined} from '@ant-design/icons';
import {useEffect, useState} from 'react';
import axios from 'axios';
import './Css/Vendors.css'
import MyModal from "../../Ui/MyModal.jsx";

const Vendors = () => {
    const [vendorFields, setVendorFields] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [editedValues, setEditedValues] = useState({});
    const [newVendor, setNewVendor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

    useEffect(() => {
        axios.get('/service/vendors')
            .then(response => {
                setVendors(response.data.vendors || []);
                const keys = response.data.vendors?.[0] ? Object.keys(response.data.vendors[0]).filter(k => k !== "id") : [];
                setVendorFields(keys);
            })
            .catch(error => console.error('Ошибка загрузки данных:', error));
    }, []);

    const handleEdit = (record) => {
        setEditingKey(record.id);
        setEditedValues(record);
    };


    const handleSave = (id) => {
        axios.put(`/service/vendors/${id}`, editedValues)
            .then(response => {
                console.log('Обновлено:', response.data);
                setVendors(prevVendors =>
                    prevVendors.map(vendor =>
                        vendor.id === id ? {...vendor, ...editedValues} : vendor
                    )
                );
                setEditingKey(null);
            })
            .catch(error => console.error('Ошибка обновления:', error));
    };

    const handleAdd = () => {
        if (vendorFields.length === 0) {
            setVendorFields(['name', 'source', 'telegram_id']);
        }
        setNewVendor(prev => prev ? null : Object.fromEntries([['id', 0], ...vendorFields.map(key => [key, ''])]));
    };

    const handleSaveNewVendor = () => {
        if (!newVendor.name.trim()) {
            setIsErrorModalOpen(true);
            return;
        }
        axios.post('/service/vendors', newVendor)
            .then(response => {
                console.log('Добавлено:', response.data);
                setVendors(prevVendors => [...prevVendors, response.data['vendor']]);
                setNewVendor(null);
            })
            .catch(error => console.error('Ошибка добавления:', error));
    };

    const showDeleteModal = (vendor) => {
        setSelectedVendor(vendor);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedVendor) {
            axios.delete(`/service/vendors/${selectedVendor.id}`)
                .then(response => {
                    console.log('Удалено:', response.data);
                    setVendors(prevVendors => prevVendors.filter(vendor => vendor.id !== selectedVendor.id));
                })
                .catch(error => console.error('Ошибка удаления:', error))
                .finally(() => {
                    setIsModalOpen(false);
                    setSelectedVendor(null);
                });
        }
    };

    const columns = [
        ...Object.keys(vendors[0] || {}).filter(key => key !== "id").map(key => ({
            title: key,
            dataIndex: key,
            key,
            render: (text, record) =>
                editingKey === record.id ? (
                    <Input value={editedValues[key] || ''}
                           onChange={(e) => setEditedValues(prev => ({...prev, [key]: e.target.value}))}/>
                ) : text
        })),
        {
            key: 'actions',
            render: (_, record) => {
                let actionButton;
                if (editingKey === record.id) {
                    actionButton = <Button icon={<SaveOutlined/>} type="link" onClick={() => handleSave(record.id)}/>
                } else {
                    actionButton = <Button icon={<EditOutlined/>} type="link" onClick={() => handleEdit(record)}/>
                }
                return (
                    <>
                        {actionButton}
                        <Button icon={<DeleteOutlined/>} type="link" danger onClick={() => showDeleteModal(record)}/>
                    </>)
            }
        }
    ];

    return (
        <>
            <div className='vendor-main'>
                <h1>Vendors</h1>
                <Button
                    icon={<PlusOutlined/>}
                    type="primary"
                    shape="circle"
                    onClick={handleAdd}
                    className="add_vendor_button"
                />
            </div>
            {newVendor && (
                <div className="new-vendor-line">
                    {vendorFields.map(key => (
                            <Input key={key}
                                   placeholder={key}
                                   value={newVendor[key] || ''}
                                   onChange={(e) => setNewVendor(prev => ({...prev, [key]: e.target.value}))}/>
                        )
                    )
                    }
                    <Button icon={<SaveOutlined/>} type="primary" onClick={handleSaveNewVendor}>Сохранить</Button>
                </div>)}
            <Table columns={columns} dataSource={vendors} rowKey="id"/>
            <MyModal
                isOpen={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                content={`Вы уверены, что хотите удалить ${selectedVendor?.name}?`}
                danger={true}
                footer={<>
                    <Button type="primary" danger onClick={handleDeleteConfirm}>Удалить</Button>
                    <Button onClick={() => setIsModalOpen(false)}>Отмена</Button>
                </>}
            />
            <MyModal
                isOpen={isErrorModalOpen}
                content="Имя поставщика не может быть пустым."
                danger={true}
                footer={<Button type="primary" danger onClick={() => setIsErrorModalOpen(false)}>ОК</Button>}
            />
        </>
    );
};

export default Vendors;