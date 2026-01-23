import {useCallback, useEffect, useState} from "react";
import {Upload, Image, Space, Spin} from "antd";
import InboxOutlined from "@ant-design/icons";

import MyModal from "../../../../Ui/MyModal.jsx";
import UploadedImageItem from "../UploadImagesElement.jsx";
import {useImagesActions} from "../../Hook/useImagesActions.js";

const UploadImagesModal = ({isOpen, onClose, originCode, originTitle, onUploaded}) => {
    const [existingFiles, setExistingFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const {fetchImages, deleteImage, markAsPreview, uploadImage} = useImagesActions(originCode, onUploaded);

    useEffect(() => {
        if (!isOpen) return;
        setLoading(true);
        fetchImages().then(setExistingFiles).finally(() => setLoading(false));
    }, [isOpen, fetchImages]);
    const customUpload = useCallback(async (opts) => {
        const result = await uploadImage(opts.file);
        if (result) {
            setExistingFiles(result.images);
            opts.onSuccess();
        } else {
            opts.onError();
        }
    }, [uploadImage]);


    return (
        <MyModal
            isOpen={isOpen}
            onCancel={onClose}
            title={`Изображения для origin: ${originCode} ${originTitle}`}
            closable
            footer={null}
            content={
                <Spin spinning={loading}>
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
                                            onDelete={async (f) => {
                                                const res = await deleteImage(f);
                                                if (res) setExistingFiles(res.images);
                                            }}
                                            onMakePreview={async (f) => {
                                                const res = await markAsPreview(f);
                                                if (res) setExistingFiles(res.images);
                                            }}
                                        />
                                    ))}
                                </Space>
                            </Image.PreviewGroup>
                        )}
                        <Upload.Dragger name="file" multiple={false} listType="picture-card"
                                        customRequest={customUpload} showUploadList={false}>
                            <div className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </div>
                            Перетащи файл сюда или кликни для выбора
                        </Upload.Dragger>
                    </div>
                </Spin>
            }
        />
    );
};

export default UploadImagesModal;