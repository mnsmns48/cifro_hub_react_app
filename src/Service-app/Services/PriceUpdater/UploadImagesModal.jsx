import { useCallback, useEffect, useState } from "react";
import { Upload, Image, message, Space, Spin } from "antd";
import InboxOutlined from "@ant-design/icons";

import MyModal from "../../../Ui/MyModal.jsx";
import {getUploadedImages, uploadImageToS3, deleteImageFromS3, markImageAsPreview} from "./api.js";
import UploadedImageItem from "./UploadImagesElement.jsx";

const UploadImagesModal = ({ isOpen, onClose, originCode, originTitle, onUploaded  }) => {
    const [existingFiles, setExistingFiles] = useState([]);
    const [loading, setLoading] = useState(false);

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
                const { images, preview } = await deleteImageFromS3(originCode, filename);
                onUploaded({ images, preview });
                setExistingFiles(images);
            } catch {
                message.error("Ошибка при удалении");
            }
        },
        [originCode]
    );

    const customUpload = useCallback(async (opts) => {
        try {
            const { images, preview } = await uploadImageToS3(originCode, opts.file);
            setExistingFiles(images);
            onUploaded({ images, preview });
            opts.onSuccess();
        } catch {
            message.error("Ошибка загрузки");
            opts.onError();
        }
    }, [originCode]);

    const markAsPreview = useCallback(async (filename) => {
        try {
            const { images, preview } = await markImageAsPreview(originCode, filename);
            setExistingFiles(images);
            onUploaded({ images, preview });
        } catch {
            message.error("Не удалось установить изображение как превью");
        }
    }, [originCode, onUploaded]);



    return (
        <MyModal
            isOpen={isOpen}
            onCancel={onClose}
            title={`Изображения для origin: ${originCode} ${originTitle}`}
            closable
            footer={null}
            content={
                <Spin spinning={loading}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {!!existingFiles.length && (
                            <Image.PreviewGroup>
                                <Space wrap size={[12, 12]}>
                                    {existingFiles.map(({ filename, url, is_preview }) => (
                                        <UploadedImageItem
                                            key={filename}
                                            filename={filename}
                                            url={url}
                                            isPreview={is_preview}
                                            onDelete={deleteImage}
                                            onMakePreview={markAsPreview}/>
                                    ))}
                                </Space>
                            </Image.PreviewGroup>
                        )}
                        <Upload.Dragger name="file" multiple={false} listType="picture-card"
                                        customRequest={customUpload} showUploadList={false}>
                            <div className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </div> Перетащи файл сюда или кликни для выбора
                        </Upload.Dragger>
                    </div>
                </Spin>
            }
        />
    );
};

export default UploadImagesModal;
