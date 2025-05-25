import {Button, Col, Flex, Input, Row} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import MyModal from "../../Ui/MyModal.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import VendorSourceSelector from "./PriceUpdater/VendorSourceSelector.jsx";
import SearchTableSelector from "./PriceUpdater/SearchTableSelector.jsx";
import './PriceUpdater/PriceUpdater.css'
import Parsing from "./PriceUpdater/Parsing.jsx";

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


const PriceUpdater = () => {
    const [vendorList, setVendorList] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [selectedVSLRow, setSelectedVSLRow] = useState(null);
    const [inputVSLink, setInputVSLink] = useState("");
    const [inputTitle, setInputTitle] = useState("");
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [selectedVSLRowKeys, setSelectedVSLRowKeys] = useState([]);

    useEffect(() => {
        fetchVendors().then(setVendorList);
    }, []);

    useEffect(() => {
        if (selectedVendor) {
            fetchTableData(selectedVendor).then(setTableData);
            setSelectedVSLRow(null);
            setSelectedVSLRowKeys(null);
        }

    }, [selectedVendor]);


    const refreshTableData = async (newRec = null) => {
        if (!selectedVendor) return;

        try {
            const updatedData = await fetchTableData(selectedVendor);
            setTableData(updatedData);
            if (newRec) {
                setTimeout(() => {
                    const selectedEntry = updatedData.find(item => item.id === newRec.id);
                    if (selectedEntry) {
                        setSelectedVSLRow(selectedEntry);
                        setSelectedVSLRowKeys([selectedEntry.id]);
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
                        <VendorSourceSelector list={vendorList} onChange={setSelectedVendor}/>
                        {!selectedVSLRow && (<Input style={{marginTop: 8}}
                                                    placeholder="Ссылка"
                                                    onChange={(e) => setInputVSLink(e.target.value)}
                                                    value={inputVSLink}/>)}
                        {inputVSLink && (
                            <div className='input_link_container'>
                                <Button type="primary" icon={<PlusOutlined/>} className='input_link'
                                        onClick={() => addVSL(selectedVendor, {title: inputTitle, url: inputVSLink})}/>
                                <Input className='input_link_title' placeholder="Наименование ссылки"
                                       onChange={(e) => setInputTitle(e.target.value)}/>
                            </div>)
                        }
                        {selectedVSLRow !== null && <Parsing url={selectedVSLRow.url}/>}
                    </Flex>
                </Col>
                <Col span={15} className='right_col'>
                    <SearchTableSelector
                        tableData={tableData}
                        refreshTableData={refreshTableData}
                        setSelectedRow={setSelectedVSLRow}
                        selectedRowKeys={selectedVSLRowKeys}
                        setSelectedRowKeys={setSelectedVSLRowKeys}/>
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
            <div>Тут результаты</div>
        </>

    );
}


export default PriceUpdater;