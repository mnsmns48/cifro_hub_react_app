import { useCallback, useEffect, useState } from "react";
import { Upload, Image, message, Space, Spin } from "antd";
import {CloseCircleFilled, InboxOutlined, StarFilled, StarOutlined} from "@ant-design/icons";

import MyModal from "../../../Ui/MyModal.jsx";
import {getUploadedImages, uploadImageToS3, deleteImageFromS3} from "./api.js";

const UploadImagesModal = ({ isOpen, onClose, originCode }) => {
    const [existingFiles, setExistingFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [makePreview, setMakePreview] = useState(false);

    const fetchImages = useCallback(async () => {
        setLoading(true);
        try {
            const images = await getUploadedImages(originCode);
            setExistingFiles(images);
        } catch {
            message.error("Не удалось загрузить изображения");
        } finally {
            setLoading(false);
        }
    }, [originCode]);

    useEffect(() => {
        if (isOpen) fetchImages();
    }, [isOpen, fetchImages]);

    const deleteImage = useCallback(
        async (filename) => {
            try {
                const { images } = await deleteImageFromS3(originCode, filename);
                setExistingFiles(images);
            } catch {
                message.error("Ошибка при удалении");
            }
        },
        [originCode]
    );

    const customUpload = useCallback(
        async (opts) => {
            try {
                const { images } = await uploadImageToS3(originCode, opts.file, makePreview);
                setExistingFiles(images);
                if (makePreview) setMakePreview(false);
            } catch {
                message.error("Ошибка загрузки");
                opts.onError();
            }
        },
        [originCode, makePreview]
    );

    return (
        <MyModal
            isOpen={isOpen}
            onCancel={onClose}
            title={`Изображения для origin: ${originCode}`}
            closable
            footer={null}
            content={
                <Spin spinning={loading}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {!!existingFiles.length && (
                            <Image.PreviewGroup>
                                <Space wrap size={[12, 12]}>
                                    {existingFiles.map(({ filename, url, is_preview }) => (
                                        <div
                                            key={filename}
                                            style={{
                                                position: "relative",
                                                width: 80,
                                                height: 80,
                                                overflow: "hidden",
                                                borderRadius: 4,
                                                border: is_preview
                                                    ? "3px solid #1890ff"
                                                    : "1px solid #ddd",
                                            }}
                                        >
                                            <Image
                                                src={url}
                                                alt={filename}
                                                width={80}
                                                height={80}
                                                style={{ objectFit: "cover" }}
                                            />
                                            {!is_preview ? (
                                                <StarOutlined
                                                    style={{
                                                        position: "absolute",
                                                        bottom: 2,
                                                        right: 2,
                                                        color: "#fff",
                                                        fontSize: 18,
                                                        textShadow: "0 0 2px rgba(0,0,0,0.5)",
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            ) : (
                                                <StarFilled
                                                    style={{
                                                        position: "absolute",
                                                        bottom: 2,
                                                        right: 2,
                                                        color: "#ebfa14",
                                                        fontSize: 18,
                                                    }}
                                                />
                                            )}
                                            <CloseCircleFilled
                                                onClick={() => deleteImage(filename)}
                                                style={{
                                                    position: "absolute",
                                                    top: 2,
                                                    right: 2,
                                                    fontSize: 16,
                                                    color: "#ff4d4f",
                                                    backgroundColor: "#fff",
                                                    borderRadius: "50%",
                                                    cursor: "pointer",
                                                }}
                                            />
                                        </div>
                                    ))}
                                </Space>
                            </Image.PreviewGroup>
                        )}
                        <Upload.Dragger
                            name="file"
                            multiple={false}
                            listType="picture-card"
                            showUploadList={false}
                            customRequest={customUpload}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p>Перетащи файл сюда или кликни для выбора</p>
                        </Upload.Dragger>
                    </div>
                </Spin>
            }
        />
    );
};

export default UploadImagesModal;
