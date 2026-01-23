import { useEffect, useState } from "react";
import { Image } from "antd";
import UploadedImageItem from "../UploadImagesElement.jsx";
import { useImagesActions } from "../../Hook/useImagesActions.js";

const AttributesImageContainer = ({ data, onUploaded }) => {
    const originCode = data?.origin;

    const {
        fetchImages,
        deleteImage,
        markAsPreview
    } = useImagesActions(originCode, onUploaded);

    const [existingFiles, setExistingFiles] = useState([]);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!originCode) return;

        fetchImages().then(result => {
            setExistingFiles(result);
            setPreview(result.find(i => i.is_preview)?.url ?? null);
        });
    }, [originCode, fetchImages]);

    const handleDelete = async (filename) => {
        const res = await deleteImage(filename);
        if (!res) return;

        setExistingFiles(res.images);
        setPreview(res.preview);

        if (onUploaded) {
            onUploaded({ images: res.images, preview: res.preview }, originCode);
        }
    };

    const handleMakePreview = async (filename) => {
        const res = await markAsPreview(filename);
        if (!res) return;

        setExistingFiles(res.images);
        setPreview(res.preview);

        if (onUploaded) {
            onUploaded({ images: res.images, preview: res.preview }, originCode);
        }
    };

    return (
        <div>
            <div
                style={{
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                    paddingBottom: 10
                }}
            >
                <div style={{ width: "30%" }}>
                    {preview && (
                        <Image
                            src={preview}
                            style={{ borderRadius: 6, objectFit: "contain" }}
                        />
                    )}
                </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {existingFiles.map(img => (
                    <UploadedImageItem
                        key={img.filename}
                        filename={img.filename}
                        url={img.url}
                        isPreview={img.is_preview}
                        onDelete={handleDelete}
                        onMakePreview={handleMakePreview}
                    />
                ))}
            </div>
        </div>
    );
};

export default AttributesImageContainer;
