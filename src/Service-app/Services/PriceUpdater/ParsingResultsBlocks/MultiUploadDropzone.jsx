import {Upload, message, Progress} from "antd";
import {useRef, useState} from "react";


const conicColors = {'0%': '#87d068', '50%': '#ffe58f', '100%': '#ffccc7',};

const MultiUploadDropzone = ({origin, onUploaded, onLoadingChange}) => {
    const queueRef = useRef([]);
    const timerRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const scheduleUpload = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            const files = queueRef.current;
            queueRef.current = [];
            if (files.length > 0) {
                void uploadBulk(files);
            }
        }, 200);
    };

    const beforeUpload = (file) => {
        queueRef.current.push(file);
        scheduleUpload();
        return false;
    };

    const uploadBulk = async (files) => {
        if (!files.length) return;
        setUploading(true);
        setProgress(0);
        onLoadingChange?.(true);

        const formData = new FormData();
        files.forEach(file => formData.append("files", file));

        try {
            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", `/service/upload_images/${origin}`);

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percent = Math.round((event.loaded / event.total) * 100);
                        setProgress(percent);
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const json = JSON.parse(xhr.responseText);
                            onUploaded?.(
                                {images: json.images, preview: json.preview},
                                origin
                            );
                            resolve();
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(xhr.responseText);
                    }
                };

                xhr.onerror = () => reject("Ошибка сети");
                xhr.send(formData);
            });
        } catch (e) {
            message.error("Ошибка загрузки");
        } finally {
            setUploading(false);
            setProgress(0);
            onLoadingChange?.(false);
        }
    };

    return (
        <div>
            <Upload.Dragger
                multiple
                showUploadList={false}
                beforeUpload={beforeUpload}
                accept="image/*"
            >
                <p style={{color: "#888", fontSize: 13}}>
                    Перетащи изображения сюда
                </p>
            </Upload.Dragger>

            {uploading && (
                <div style={{marginTop: 16}}>
                    <Progress percent={progress} strokeColor={conicColors} format={(p) => `${p}%`}
                    />
                </div>
            )}
        </div>
    );
};

export default MultiUploadDropzone;
