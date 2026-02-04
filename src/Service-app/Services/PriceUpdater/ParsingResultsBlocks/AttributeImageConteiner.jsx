import {useEffect, useState} from "react";
import {Image} from "antd";
import UploadedImageItem from "../UploadImagesElement.jsx";
import {useImagesActions} from "../../Hook/useImagesActions.js";

const AttributesImageContainer = ({data, onUploaded, onLoadingChange}) => {
    const [existingFiles, setExistingFiles] = useState([]);
    const [preview, setPreview] = useState(null);

    const originCode = data?.origin;

    const {fetchImages, deleteImage, markAsPreview} = useImagesActions(originCode, onUploaded);


    useEffect(() => {
        if (!data) return;
        setExistingFiles(data.images || []);
        setPreview(data.preview || null);
    }, [data]);

    useEffect(() => {
        if (!originCode) return;

        let cancelled = false;
        onLoadingChange?.(true);

        fetchImages()
            .then(result => {
                if (cancelled) return;

                setExistingFiles(result);
                setPreview(result.find(i => i.is_preview)?.url ?? null);

            })
            .finally(() => {
                if (!cancelled) onLoadingChange?.(false);
            });

        return () => {
            cancelled = true;
        };
    }, [originCode]);

    const handleDelete = async (filename) => {
        const res = await deleteImage(filename);
        if (!res) return;

        setExistingFiles(res.images);
        setPreview(res.preview);

        onUploaded?.({images: res.images, preview: res.preview}, originCode);
    };

    const handleMakePreview = async (filename) => {
        const res = await markAsPreview(filename);
        if (!res) return;

        setExistingFiles(res.images);
        setPreview(res.preview);

        onUploaded?.({images: res.images, preview: res.preview}, originCode);
    };

    return (
        <>
            <div style={{
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                paddingBottom: 10
            }}>
                <div style={{width: "30%"}}>
                    {preview && (
                        <Image
                            src={preview}
                            style={{borderRadius: 6, objectFit: "contain"}}
                        />
                    )}
                </div>
            </div>

            <div style={{display: "flex", flexWrap: "wrap", gap: 8}}>
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
        </>
    );
};

export default AttributesImageContainer;
