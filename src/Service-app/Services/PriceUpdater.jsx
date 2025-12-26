import {Button, Flex, Input} from "antd";
import {FileSearchOutlined} from "@ant-design/icons";
import MyModal from "../../Ui/MyModal.jsx";
import {useEffect, useState} from "react";
import VendorSourceSelector from "./PriceUpdater/VendorSourceSelector.jsx";
import SearchTableSelector from "./PriceUpdater/SearchTableSelector.jsx";
import './Css/PriceUpdater.css';
import {
    fetchVendors,
    fetchTableData,
    addVSL,
    reCalcOutputPrices,
    startDataCollection,
    getProgressLine
} from "./PriceUpdater/api.js";
import ParsingResults from "./PriceUpdater/ParsingResults.jsx";
import ProgressIndicator from "./PriceUpdater/ProgressIndicator.jsx";


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
    const [parsedData, setParsedData] = useState({});
    const [isParsingDone, setIsParsingDone] = useState(false);
    const [progressLineObj, setProgressLineObj] = useState("");
    const [isParsingStarted, setIsParsingStarted] = useState(false);
    const [isSyncFeatures, setIsSyncFeatures] = useState({});

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

    useEffect(() => {
        if (!selectedVSLRow || !isParsingDone) {
            setIsParsingStarted(false);
            setProgressLineObj("");
        }
    }, [selectedVSLRow, isParsingDone]);


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

    const handleRangeChange = async (vslId, rangeId) => {
        try {
            const resp = await reCalcOutputPrices(vslId, rangeId);
            setParsedData(resp);
        } catch (err) {
            console.error(err);
        }
    };

    const runParsingFlow = async ({selectedRow, api_url}) => {
        const {result: progress} = await getProgressLine();
        if (!progress) return;

        setIsParsingStarted(true);
        setProgressLineObj(progress);

        const results = await startDataCollection({
            selectedRow,
            progress,
            api_url,
            sync_features: isSyncFeatures[selectedRow.id] ?? false,
        });

        if (!results.is_ok) {
            setIsParsingStarted(false);
            setProgressLineObj("");
            return;
        }
        handleParsingComplete(results);
    };


    const handleAction = async ({key, selectedRow, value}) => {
        switch (key) {
            case "isSyncFeatures":
                setIsSyncFeatures(prev => ({
                    ...prev,
                    [selectedRow.id]: value
                }));
                break;

            case "startParsing":
                await runParsingFlow({
                    selectedRow,
                    api_url: "/service/start_parsing"
                });
                break;

            case "prevResults":
                await runParsingFlow({
                    selectedRow,
                    api_url: "/service/previous_parsing_results"
                });
                break;
        }
    };


    return (
        <>
            {!isParsingDone && (
                <div style={{display: "flex", flexDirection: "column", gap: 20}}>
                    <Flex vertical style={{width: 300}} align="flex-start">
                        <VendorSourceSelector list={vendorList} onChange={setSelectedVendor}/>
                        <Input style={{marginTop: 8}}
                               placeholder="Новая ссылка"
                               onChange={(e) => setInputVSLink(e.target.value)}
                               value={inputVSLink}/>
                        {inputVSLink && (
                            <div className="input_link_container">
                                <Input placeholder="Как будет называться"
                                       value={inputTitle}
                                       onChange={(e) => setInputTitle(e.target.value)}
                                       style={{marginBottom: 8}}/>
                                <Button
                                    className="input_link"
                                    type="default"
                                    onClick={() =>
                                        addVSL(
                                            selectedVendor,
                                            {title: inputTitle, url: inputVSLink},
                                            refreshTableData,
                                            setInputVSLink,
                                            setInputTitle,
                                            setSuccessMessage,
                                            setIsSuccessModalOpen,
                                            setErrorMessage,
                                            setIsErrorModalOpen
                                        )
                                    }
                                >
                                    Добавить
                                </Button>
                            </div>
                        )}
                    </Flex>

                    {selectedVendor && (
                        <SearchTableSelector
                            tableData={tableData}
                            refreshTableData={refreshTableData}
                            setSelectedRow={setSelectedVSLRow}
                            selectedRowKeys={selectedVSLRowKeys}
                            setSelectedRowKeys={setSelectedVSLRowKeys}
                            handleAction={handleAction}
                            isSyncFeatures={isSyncFeatures}
                        />
                    )}
                    {isParsingStarted && (
                        <ProgressIndicator progress_obj={progressLineObj}/>
                    )}
                </div>
            )}

            <MyModal
                isOpen={isErrorModalOpen}
                onCancel={() => setIsErrorModalOpen(false)}
                content={errorMessage}
                danger={true}
                footer={
                    <Button type="primary" danger
                            onClick={() => {
                                setIsErrorModalOpen(false);
                                closeModalAfterDelay(setIsErrorModalOpen);
                            }}
                    >ОК
                    </Button>
                }
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
                footer={
                    <Button type="primary"
                            onClick={() => {
                                setIsSuccessModalOpen(false);
                                closeModalAfterDelay(setIsSuccessModalOpen);
                            }}
                    >OK
                    </Button>
                }
            />
            {isParsingDone && parsedData && (
                <>
                    <Button onClick={handleNewSearch}>Новый поиск</Button>
                    <ParsingResults
                        url={selectedVSLRow?.url}
                        result={parsedData}
                        vslId={selectedVSLRow?.id}
                        onRangeChange={handleRangeChange}
                    />
                </>
            )}
        </>
    );

};

PriceUpdater.componentTitle = "Данные"
PriceUpdater.componentIcon = <div className="circle-container"><FileSearchOutlined className="icon-style"/></div>
export default PriceUpdater;