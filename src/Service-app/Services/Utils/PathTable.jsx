import {useEffect, useState} from "react";
import {Table, Input, Button, Upload} from "antd";
import {DownloadOutlined, FileUnknownOutlined, SaveOutlined} from "@ant-design/icons";
import {fetchLevels, updateAndDeleteIcon, uploadIcon} from "./crud.js";


const PathTable = ({table}) => {
    const [data, setData] = useState([]);
    const [links, setLinks] = useState({});

    useEffect(() => {
        void loadData();
    }, [table]);

    const loadData = async () => {
        const result = await fetchLevels(table);
        setData(result);
        const initialLinks = {};

        result.forEach(item => {
            if (item.icon) {
                try {
                    const url = new URL(item.icon);
                    const filename = decodeURIComponent(url.pathname.split("/").pop());
                    initialLinks[item.id] = filename;
                } catch {
                    initialLinks[item.id] = item.icon;
                }
            }
        });
        setLinks(initialLinks);
    };

    const handleUpload = async (code, file) => {
        const result = await uploadIcon(table, code, file);
        if (!result) return;

        const {filename, url} = result;

        setLinks(prev => ({...prev, [code]: filename}));
        setData(prev =>
            prev.map(item =>
                item.id === code
                    ? {...item, icon: url}
                    : item
            )
        );
    };

    const handleLinkChange = (id, value) => {
        setLinks(prev => ({...prev, [id]: value}));
    };

    const handleSave = async (record) => {
        const filename = links[record.id] || null;
        const result = await updateAndDeleteIcon(table, record, filename);
        if (!result) return;

        const { icon, filename: updatedFilename } = result;

        setData(prev =>
            prev.map(item =>
                item.id === record.id
                    ? { ...item, icon }
                    : item
            )
        );
        setLinks(prev => ({ ...prev, [record.id]: updatedFilename }));
    };


    const columns = [
        {dataIndex: "label", key: "label"},
        {
            dataIndex: "icon", key: "icon_preview",
            render: (icon) =>
                icon ? (
                    <img src={icon} alt="иконка" style={{width: 40, height: 40}}/>
                ) : (
                    <span style={{color: "#999"}}>
                        <FileUnknownOutlined style={{justifyContent: "center", display: "flex"}}/>
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
            key: "filenameInput",
            render: (_, record) => (
                <Input
                    style={{fontSize: 12}}
                    value={links[record.id] || ""}
                    onChange={(e) => handleLinkChange(record.id, e.target.value)}
                    placeholder="Файл"
                />
            )
        },
        {
            key: "saveBtn",
            render: (_, record) => (
                <Button icon={<SaveOutlined/>} onClick={() => handleSave(record)}/>
            )
        },
    ];

    return <Table columns={columns} dataSource={data} pagination={false} showHeader={false}/>;
};

export default PathTable;
