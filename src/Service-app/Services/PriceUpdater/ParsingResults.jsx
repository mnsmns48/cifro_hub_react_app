import {useState, useMemo, useCallback, useEffect} from "react";
import {Table, Button, Input, Select} from "antd";
import "../Css/ParsingResults.css";
import {createParsingColumns} from "./ParsingResultsColumns.jsx";
import {deleteParsingItems} from "./api.js";
import UploadImagesModal from "./UploadImagesModal.jsx";
import {fetchRangeRewardsProfiles} from "../RewardRangeSettings/api.js";
import { FileExcelOutlined } from "@ant-design/icons";
import {formatDate} from "../../../../utils.js";
import InHubDownloader from "./InHubDownloader.jsx";
import MyModal from "../../../Ui/MyModal.jsx";

const {Search} = Input;


const ParsingResults = ({result, vslId, onRangeChange}) => {
    const [rows, setRows] = useState(result.data ?? []);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [pageSize, setPageSize] = useState(100);
    const [showInputPrice, setShowInputPrice] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [currentOrigin, setCurrentOrigin] = useState(null);
    const [rewardOptions, setRewardOptions] = useState([]);
    const [addToHubModalVisible, setAddToHubModalVisible] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");


    useEffect(() => {
        setRows(Array.isArray(result.data) ? result.data : []);
        setSelectedRowKeys([]);
        setSearchText("");
        setActiveFilter("all");
        setExpandedRows(null);
    }, [result.data, result.range_reward]);


    useEffect(() => {
        (async () => {
            try {
                const resp = await fetchRangeRewardsProfiles();
                const list = Array.isArray(resp) ? resp : resp.data;
                setRewardOptions(
                    list.map(o => ({label: o.title, value: o.id}))
                );
            } catch {
                console.error("Ошибка загрузки профилей");
            }
        })();
    }, []);

    const handleSelectRange = async rangeId => {
        await onRangeChange(vslId, rangeId);
    };

    const openUploadModal = useCallback(origin => {
        setCurrentOrigin(origin);
        setUploadModalOpen(true);
    }, []);

    const toggleExpand = useCallback(
        key => setExpandedRows(prev => (prev === key ? null : key)),
        []
    );

    const filteredData = useMemo(() => {
        let data = rows;
        if (activeFilter === "noPreview") {
            data = data.filter(r => !r.preview);
        } else if (activeFilter === "noFeatures") {
            data = data.filter(r => Array.isArray(r.features_title) && r.features_title.length === 0);
        }

        const q = searchText.toLowerCase();
        return data.filter(r =>
            (r.title ?? "").toLowerCase().includes(q)
        );
    }, [rows, activeFilter, searchText]);

    const columns = useMemo(
        () =>
            createParsingColumns({
                setRows,
                showInputPrice,
                expandedRows,
                toggleExpand,
                openUploadModal
            }),
        [setRows, showInputPrice, expandedRows, toggleExpand]
    );

    const handleDelete = async () => {
        if (!selectedRowKeys.length) return;
        try {
            await deleteParsingItems(selectedRowKeys);
            setRows(prev =>
                prev.filter(r => !selectedRowKeys.includes(r.origin))
            );
            setSelectedRowKeys([]);
        } catch {
            console.error("Ошибка при удалении");
        }
    };

    const handleImageUploaded = useCallback(
        ({ images, preview }, origin) => {
            setRows(prev =>
                prev.map(r =>
                    r.origin !== origin
                        ? r
                        : { ...r, images, preview }
                )
            );
        },
        [setRows]
    );

    const downloadExcel = async () => {
        try {
            window.open(`/service/get_price_excel/${vslId}`, "_blank");
        } catch (err) {
            console.error(`Не сохранить данные в Excel файл ${err}`);
        }
    };

    const selectedItems = rows.filter(r => selectedRowKeys.includes(r.origin) );

    const handleAddToHub = (msg) => {
        setAddToHubModalVisible(false);
        setSuccessMessage(msg);
        setIsSuccessModalOpen(true);
    };


    return (
        <>
            <div>
                <p>
                    <strong>Категория:</strong>{" "}
                    {Array.isArray(result.category)
                        ? result.category.map((c, i) => (
                            <span key={i}>{c} </span>
                        ))
                        : null}
                </p>
                <p>
                    <strong>Дата и время:</strong> {formatDate(result.datestamp)}
                </p>
            </div>

            <div style={{display: "flex", gap: 15, flexWrap: "wrap", padding: "15px 0"}}>
                <Button onClick={() => setShowInputPrice(v => !v)}>{showInputPrice ? "Off" : "₽"}</Button>
                <Button onClick={() => setActiveFilter("all")} style={{background: "yellowgreen"}}/>
                <Button onClick={() => setActiveFilter("noPreview")} style={{background: "yellow"}}/>
                <Button onClick={() => setActiveFilter("noFeatures")} style={{background: "red"}}/>
                <Search placeholder="Пиши что ищешь" allowClear style={{maxWidth: 500}}
                        value={searchText} onChange={e => setSearchText(e.target.value)}/>
                <Select style={{minWidth: 200}}
                        options={rewardOptions} defaultValue={result.range_reward.id} onChange={handleSelectRange}/>
                <Button
                    type="text"
                    icon={<FileExcelOutlined style={{ fontSize: 20, color: "#52c41a" }} />}
                    onClick={downloadExcel}
                    title="Скачать Excel"
                />
            </div>

            {selectedRowKeys.length > 0 && (
                <Button danger style={{margin: "0 0 10px 10px"}} onClick={handleDelete}>
                    Удалить ({selectedRowKeys.length})
                </Button>
            )}
            {selectedRowKeys.length > 0 && (
                <Button
                    type="primary"
                    style={{ margin: "0 0 10px 10px" }}
                    onClick={() => setAddToHubModalVisible(true)}
                >
                    Добавить в Хаб ({selectedRowKeys.length})
                </Button>
            )}

            <Table className="parsing-result-table" dataSource={filteredData}
                   columns={columns}
                // rowKey={(rec, idx) => `${rec.origin}-${idx}`}
                   rowKey="origin" tableLayout="fixed"
                   rowSelection={{
                       selectedRowKeys,
                       onChange: setSelectedRowKeys
                   }}
                   pagination={{
                       pageSize,
                       showSizeChanger: true,
                       pageSizeOptions: ["10", "25", "50", "100"],
                       onShowSizeChange: (_, size) => setPageSize(size)
                   }}
                   rowClassName={rec => {
                       const noF =
                           Array.isArray(rec.features_title) &&
                           rec.features_title.length === 0;
                       const noP = !rec.preview;
                       if (noF) return "row-no-features";
                       if (noP) return "row-no-image";
                       return "";
                   }}
            />

            <InHubDownloader
                VslId={vslId}
                resultObj={result}
                isOpen={addToHubModalVisible}
                items={selectedItems}
                onCancel={() => setAddToHubModalVisible(false)}
                onConfirm={handleAddToHub}
            />

            <UploadImagesModal
                isOpen={uploadModalOpen}
                originCode={currentOrigin}
                onClose={() => setUploadModalOpen(false)}
                onUploaded={(data) => handleImageUploaded(data, currentOrigin)}
            />
            <MyModal
                isOpen={isSuccessModalOpen}
                content={successMessage}
                onConfirm={() => setIsSuccessModalOpen(false)}
                onCancel={() => setIsSuccessModalOpen(false)}
                footer={<button onClick={() => setIsSuccessModalOpen(false)}>Ок</button>}
            />
        </>
    );
};

export default ParsingResults;