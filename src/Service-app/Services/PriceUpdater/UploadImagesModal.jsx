import {useEffect, useState} from "react";
import {Upload, Image, message, Space, Spin} from "antd";
import {CloseCircleFilled, InboxOutlined} from "@ant-design/icons";
import MyModal from "../../../Ui/MyModal.jsx";
import {getUploadedImages} from "./api.js";


const UploadImagesModal = ({isOpen, onClose, originCode, onUploaded}) => {
    const [existingFiles, setExistingFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const uploadUrl = `/api/upload/${originCode}`;

    useEffect(() => {
        if (!isOpen || !originCode) return;

        (async () => {
            setLoading(true);
            try {
                const data = await getUploadedImages(originCode);
                setExistingFiles(data.available || []);
            } catch (err) {
                message.error(err?.message || "Ошибка при получении изображений");
            } finally {
                setLoading(false);
            }
        })();
    }, [isOpen, originCode]);

    return (
        <MyModal
            isOpen={isOpen}
            onCancel={onClose}
            title={`Изображения для origin: ${originCode}`}
            closable={true}
            footer={null}
            content={
                <Spin spinning={loading}>
                    <div style={{display: "flex", flexDirection: "column", gap: 16}}>
                        {existingFiles.length > 0 && (
                            <Space wrap>
                                {existingFiles.map((file) => (
                                    <div
                                        key={file}
                                        style={{
                                            position: "relative",
                                            display: "inline-block",
                                            width: 80,
                                            height: 80,
                                        }}
                                    >
                                        <Image
                                            src={`/hub/${originCode}/${file}`}
                                            alt={file}
                                            width={80}
                                            height={80}
                                            style={{objectFit: "cover", borderRadius: 4}}
                                        />
                                        <CloseCircleFilled
                                            // onClick={() => handleDelete(file)}
                                            style={{
                                                position: "absolute",
                                                top: -6,
                                                right: -6,
                                                fontSize: 16,
                                                color: "#ff4d4f",
                                                cursor: "pointer",
                                                backgroundColor: "#fff",
                                                borderRadius: "50%",
                                            }}
                                        />
                                    </div>
                                ))}
                            </Space>
                        )}

                        <Upload.Dragger
                            name="file"
                            multiple
                            listType="picture-card"
                            showUploadList={true}
                            action={uploadUrl}
                            onSuccess={() => {
                                message.success("Файл загружен");
                                onUploaded?.();
                            }}
                            onError={() => message.error("Ошибка загрузки")}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p>Перетащи файлы сюда или кликни для выбора</p>
                        </Upload.Dragger>
                    </div>
                </Spin>
            }
        />
    );
};

export default UploadImagesModal;
