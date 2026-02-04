import {useCallback, useEffect, useState} from "react";
import {Upload, Image, message, Space} from "antd";
import {InboxOutlined} from "@ant-design/icons";

import UploadedImageItem from "../UploadImagesElement.jsx";
import MyModal from "../../../../Ui/MyModal.jsx";
import {
    deleteImageFromS3,
    getUploadedImages,
    markImageAsPreview,
    uploadImageToS3
} from "../api.js";
import Spinner from "../../../../Cifrotech-app/components/Spinner.jsx";

const UploadImagesModal = ({
                               isOpen,
                               onClose,
                               originCode,
                               originTitle,
                               onUploaded
                           }) => {
    const [existingFiles, setExistingFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchImages = useCallback(async () => {
        if (!originCode) return;

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
    }, [isOpen]);

    const propagate = useCallback(
        ({origin, images, preview}) => {
            if (!origin) {
                console.warn("UploadImagesModal: origin is missing");
                return;
            }

            setExistingFiles(images);
            onUploaded?.({origin, images, preview});
        },
        [onUploaded]
    );

    const deleteImage = useCallback(
        async (filename) => {
            try {
                const resp = await deleteImageFromS3(originCode, filename);
                propagate(resp);
            } catch {
                message.error("Ошибка при удалении");
            }
        },
        [originCode, propagate]
    );

    const customUpload = useCallback(
        async (opts) => {
            try {
                const resp = await uploadImageToS3(originCode, opts.file);
                propagate(resp);
                opts.onSuccess();
            } catch {
                message.error("Ошибка загрузки");
                opts.onError();
            }
        },
        [originCode, propagate]
    );

    const markAsPreview = useCallback(
        async (filename) => {
            try {
                const resp = await markImageAsPreview(originCode, filename);
                propagate(resp);
            } catch {
                message.error("Не удалось установить превью");
            }
        },
        [originCode, propagate]
    );

    return (
        <MyModal
            isOpen={isOpen}
            onCancel={onClose}
            title={`Изображения для origin: ${originCode} ${originTitle}`}
            closable
            footer={null}
            content={
                loading ? (
                    <Spinner/>
                ) : (
                    <div style={{display: "flex", flexDirection: "column", gap: 16}}>
                        {!!existingFiles.length && (
                            <Image.PreviewGroup>
                                <Space wrap size={[12, 12]}>
                                    {existingFiles.map(({filename, url, is_preview}) => (
                                        <UploadedImageItem
                                            key={filename}
                                            filename={filename}
                                            url={url}
                                            isPreview={is_preview}
                                            onDelete={deleteImage}
                                            onMakePreview={markAsPreview}
                                        />
                                    ))}
                                </Space>
                            </Image.PreviewGroup>
                        )}

                        <Upload.Dragger name="file"
                                        multiple={false}
                                        listType="picture-card"
                                        customRequest={customUpload}
                                        showUploadList={false}>
                            <div className="ant-upload-drag-icon"><InboxOutlined/></div>
                            Перетащи файл сюда или кликни для выбора
                        </Upload.Dragger>
                    </div>
                )
            }
        />
    );
};

export default UploadImagesModal;