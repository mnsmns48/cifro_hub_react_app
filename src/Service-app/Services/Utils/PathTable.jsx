import {useEffect, useState} from 'react';
import {Input, Table} from 'antd';
import {Button, Upload} from 'antd';
import {DownloadOutlined, FileUnknownOutlined, SaveOutlined} from "@ant-design/icons";
import {fetchHubLevelsWithPreview, loadingImage} from "./api.js";

const PathTable = () => {
    const [data, setData] = useState([]);
    const [links, setLinks] = useState({});


    const handleUpload = async (originId, file) => {
        const response = await loadingImage(originId, "utils", file);

        const url = Array.isArray(response.url)
            ? response.url.find(item => item.name === response.filename)?.url
            : response.url;

        if (response?.filename && url) {
            setLinks(prev => ({...prev, [originId]: response.filename}));
            setData(prev =>
                prev.map(item =>
                    item.id === originId
                        ? {...item, icon: url}
                        : item
                )
            );
        }
    };


    const handleLinkChange = (id, value) => {
        setLinks(prev => ({...prev, [id]: value}));
    };

    useEffect(() => {
        const loadData = async () => {
            const result = await fetchHubLevelsWithPreview();
            const sortedData = result.sort((a, b) => {
                if (a.parent_id !== b.parent_id) {
                    return a.parent_id - b.parent_id;
                }
                return a.sort_order - b.sort_order;
            });

            setData(sortedData);

            const initialLinks = {};
            result.forEach(item => {
                if (item.icon) {
                    try {
                        const url = new URL(item.icon);
                        const filename = url.pathname.split("/").pop();
                        initialLinks[item.id] = filename;
                    } catch {
                        initialLinks[item.id] = item.icon;
                    }
                }
            });

            setLinks(initialLinks);
        };

        void loadData();
    }, []);


    const columns = [
        {dataIndex: "label", key: "label"},
        {
            dataIndex: "icon", key: "icon_preview", render: (icon) =>
                icon ? (
                    <img src={icon} alt="иконка" style={{width: 40, height: 40}}/>
                ) : (
                    <span style={{color: "#999"}}>
                <FileUnknownOutlined style={{justifyContent: 'center', display: 'flex'}}/>
            </span>
                ),
        },
        {
            key: "upload",
            render: (_, record) => (
                <Upload
                    showUploadList={false}
                    beforeUpload={(file) => {
                        void handleUpload(record.id, file);
                        return false;
                    }}
                >
                    <Button icon={<DownloadOutlined/>}/>
                </Upload>
            )
        },
        {
            key: "filenameInput", render: (_, record) => (
                <Input
                    style={{fontSize: 12}}
                    value={links[record.id] || ""}
                    onChange={(e) => handleLinkChange(record.id, e.target.value)}
                    placeholder="Название файла"
                />
            )
        },
        {
            key: "saveBtn", render: () => (
                <Button icon={<SaveOutlined/>}/>
            )
        },
    ];


    return <Table columns={columns} dataSource={data} pagination={false} showHeader={false}/>;
};

export default PathTable;