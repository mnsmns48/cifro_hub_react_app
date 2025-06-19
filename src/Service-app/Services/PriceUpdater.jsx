import {Button, Col, Flex, Input, Row} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import MyModal from "../../Ui/MyModal.jsx";
import {useEffect, useState} from "react";
import VendorSourceSelector from "./PriceUpdater/VendorSourceSelector.jsx";
import SearchTableSelector from "./PriceUpdater/SearchTableSelector.jsx";
import './Css/PriceUpdater.css';
import Parsing from "./PriceUpdater/Parsing.jsx";
import {fetchVendors, fetchTableData, addVSL, fetchPreviousParsingResults} from "./PriceUpdater/api.js";
import ParsingResults from "./PriceUpdater/ParsingResults.jsx";


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
    const [parsedData, setParsedData] = useState([]);
    const [isParsingDone, setIsParsingDone] = useState(false);

    useEffect(() => {
        fetchVendors().then(setVendorList);
    }, []);

    useEffect(() => {
        if (selectedVendor && !isParsingDone) {
            fetchTableData(selectedVendor).then(setTableData);
            setSelectedVSLRow(null);
            setSelectedVSLRowKeys(null);
        }
    }, [selectedVendor, isParsingDone]);


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

    const closeModalAfterDelay = (setter, delay = 2000) => {
        setTimeout(() => setter(false), delay);
    };

    const handleParsingComplete = (data) => {
        setParsedData(data);
        setIsParsingDone(true);
    };

    const handleFetchPreviousResults = async (id) => {
        try {
            const results = await fetchPreviousParsingResults(id);
            if (results.is_ok) {
                setParsedData(results);
                setIsParsingDone(true);
            } else {
                setErrorMessage(results.message || "Ошибка получения данных");
                setIsErrorModalOpen(true);
            }
        } catch (error) {
            console.error("Ошибка загрузки предыдущих результатов:", error);
        }
    };

    const handleNewSearch = async () => {
        setIsParsingDone(false);
        setParsedData([]);
        setSelectedVSLRow(null);
        setSelectedVSLRowKeys([]);
        setInputVSLink("");
        setInputTitle("");
        if (selectedVendor) {
            const updatedData = await fetchTableData(selectedVendor);
            setTableData(updatedData);
        }
    };

    return (
        <>
            <div className='action_parser_main'>
                <h1>Обновление цен</h1>
            </div>
            {!isParsingDone && (
                <Row style={{alignItems: 'flex-start'}}>
                    <Col span={7} className='left_col'>
                        <Flex vertical style={{width: 300}}>
                            <VendorSourceSelector list={vendorList} onChange={setSelectedVendor}/>
                            {!selectedVSLRow && (
                                <Input style={{marginTop: 8}} placeholder="Ссылка"
                                       onChange={(e) => setInputVSLink(e.target.value)} value={inputVSLink}/>
                            )}
                            {inputVSLink && (
                                <div className='input_link_container'>
                                    <Button type="primary" icon={<PlusOutlined/>} className='input_link'
                                            onClick={() => addVSL(selectedVendor, {
                                                    title: inputTitle,
                                                    url: inputVSLink
                                                }, refreshTableData,
                                                setInputVSLink, setInputTitle, setSuccessMessage, setIsSuccessModalOpen,
                                                setErrorMessage, setIsErrorModalOpen)}/>
                                    <Input className='input_link_title' placeholder="Наименование ссылки"
                                           onChange={(e) => setInputTitle(e.target.value)}/>

                                </div>
                            )
                            }
                            {selectedVSLRow !== null && (
                                <div className='parser_buttons'>
                                    <Button onClick={() => handleFetchPreviousResults(selectedVSLRow.id)}
                                            type="primary" style={{marginBottom: 8}}>Предыдущие результаты</Button>
                                    <Parsing selectedRow={selectedVSLRow} onComplete={handleParsingComplete}/>

                                </div>
                            )}
                        </Flex>
                    </Col>
                    <Col span={15} className='right_col'>
                        {selectedVendor && (
                            <SearchTableSelector tableData={tableData} refreshTableData={refreshTableData}
                                                 setSelectedRow={setSelectedVSLRow} selectedRowKeys={selectedVSLRowKeys}
                                                 setSelectedRowKeys={setSelectedVSLRowKeys}/>
                        )}
                    </Col>
                </Row>)}

            <MyModal
                isOpen={isErrorModalOpen}
                onCancel={() => setIsErrorModalOpen(false)}
                content={errorMessage}
                danger={true}
                footer={<Button type="primary" danger onClick={() => {
                    setIsErrorModalOpen(false);
                    closeModalAfterDelay(setIsErrorModalOpen);
                }}>ОК</Button>}
            />

            <MyModal
                isOpen={isSuccessModalOpen}
                onConfirm={() => {
                    setIsSuccessModalOpen(false);
                    closeModalAfterDelay(setIsSuccessModalOpen);
                }}
                onCancel={() => {
                    setIsSuccessModalOpen(false);
                    closeModalAfterDelay(setIsSuccessModalOpen);
                }}
                content={successMessage}
                footer={<Button type="primary" onClick={() => {
                    setIsSuccessModalOpen(false);
                    closeModalAfterDelay(setIsSuccessModalOpen);
                }}>OK</Button>}
            />
            {isParsingDone && parsedData && (
                <>
                    <Button onClick={handleNewSearch}>Новый поиск</Button>
                    <ParsingResults result={parsedData}/>
                </>
            )}
        </>
    );
};

PriceUpdater.componentTitle = "Обновления цен"
PriceUpdater.componentIcon = <img src="/ui/prices.png" alt="icon" width="30" height="30"/>
export default PriceUpdater;