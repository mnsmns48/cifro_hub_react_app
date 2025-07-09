import { useEffect, useState } from "react";
import { Upload, Image, message, Space, Spin } from "antd";
import { CloseCircleFilled, InboxOutlined } from "@ant-design/icons";
import MyModal from "../../../Ui/MyModal.jsx";
import { getUploadedImages, uploadImageToS3 } from "./api.js";

const UploadImagesModal = ({ isOpen, onClose, originCode, onUploaded }) => {
    const [existingFiles, setExistingFiles] = useState([]);
    const [loading, setLoading] = useState(false);


    const fetchImages = async () => {
        setLoading(true);
        try {
            const data = await getUploadedImages(originCode);
            const available = data.images || [];
            setExistingFiles(available);
        } catch (err) {
            message.error(err?.message || "Ошибка при получении изображений");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && originCode) {
            fetchImages();
        }
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
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {existingFiles.length > 0 && (
                            <Image.PreviewGroup>
                                <Space wrap size={[12, 12]}>
                                    {existingFiles.map(({ filename, url }) => (
                                        <div key={filename} style={{ position: 'relative', width: 80,
                                                height: 80, overflow: 'hidden', borderRadius: 4}}>
                                            <Image src={url} alt={filename} width={80} height={80}
                                                   style={{ objectFit: 'cover' }}/>
                                            <CloseCircleFilled
                                                // onClick={() => /* удаление */}
                                                style={{
                                                    position: 'absolute',
                                                    top: -6,
                                                    right: -6,
                                                    fontSize: 16,
                                                    color: '#ff4d4f',
                                                    backgroundColor: '#fff',
                                                    borderRadius: '50%',
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        </div>
                                    ))}
                                </Space>
                            </Image.PreviewGroup>
                        )}

                        <Upload.Dragger name="file" multiple={false} listType="picture-card"
                            showUploadList={false} customRequest={async (opts) => {
                            try {
                                const { images, preview } = await uploadImageToS3(originCode, opts.file)
                                message.success('Файл загружен')
                                onUploaded({ images, preview })
                                opts.onSuccess('ok')
                            } catch (err) {
                                message.error('Ошибка загрузки')
                                opts.onError(err)
                            }
                        }}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
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
