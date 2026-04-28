import {useState} from "react";
import {Modal, Select, message, Spin} from "antd";
import {fetchGetData, fetchPostData} from "../SchemeAttributes/api.js";
import MultiUploadDropzone from "../PriceUpdater/ParsingResultsBlocks/MultiUploadDropzone.jsx";
import {useImagesActions} from "../Hook/useImagesActions.js";
import UploadedImageItem from "../PriceUpdater/UploadImagesElement.jsx";


const OriginImageViewer = ({origin, title, images = [], onClose, onUploaded}) => {
    const [loading, setLoading] = useState(false);
    const [dependencyList, setDependencyList] = useState([]);
    const [selectedDependencyOrigin, setSelectedDependencyOrigin] = useState(null);

    const {deleteImage, markAsPreview} = useImagesActions(origin, onUploaded);

    const handleDelete = async (filename) => {
        const res = await deleteImage(filename);
        if (!res) return;
        onUploaded({images: res.images}, origin);
    };

    const handleMakePreview = async (filename) => {
        const res = await markAsPreview(filename);
        if (!res) return;
        onUploaded({images: res.images}, origin);
    };

    const loadDependencyList = async () => {
        if (!origin) return;
        try {
            const resp = await fetchGetData(`/service/load_dependency_images_list/${origin}`);
            setDependencyList(resp);
        } catch (e) {
            console.error("Ошибка загрузки зависимых изображений", e);
        }
    };

    const handleImplementDependencyImages = async (value) => {
        if (!value || !origin) return;

        setSelectedDependencyOrigin(value);

        try {
            setLoading(true);
            const resp = await fetchPostData("/service/implement_dependency_images", {
                target_origin: origin,
                image_same_origin: value
            });

            onUploaded({images: resp}, origin);
        } catch (e) {
            console.error(e);
            message.error("Ошибка при переносе картинок");
        } finally {
            setLoading(false);
        }
    };

    const allImages = images || [];

    return (
        <Modal open onCancel={onClose} footer={null} title={title} width={768} confirmLoading={loading}>
            {allImages.length === 0 ? (
                <div style={{padding: 20}}>
                    <MultiUploadDropzone
                        origin={origin}
                        onUploaded={(data) => onUploaded({images: data.images}, origin)}
                        onLoadingChange={setLoading}
                    />
                </div>
            ) : (
                <>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            flexWrap: "wrap",
                            gap: 8,
                            maxHeight: 600,
                            overflowY: "auto",
                            paddingBottom: 16
                        }}
                    >
                        {allImages.map((img) => (
                            <UploadedImageItem
                                key={img.filename}
                                filename={img.filename}
                                url={img.url}
                                isPreview={img.is_preview}
                                onDelete={handleDelete}
                                onMakePreview={handleMakePreview}
                            />
                        ))}

                        <div
                            style={{
                                width: 80,
                                height: 80,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px dashed #bbb",
                                borderRadius: 4,
                                padding: 4
                            }}
                        >
                            <MultiUploadDropzone
                                origin={origin}
                                onUploaded={(data) => onUploaded({images: data.images}, origin)}
                                onLoadingChange={setLoading}
                            />
                        </div>
                    </div>
                </>
            )}

            <div style={{marginTop: 20, display: "flex", gap: 8}}>
                <Select
                    style={{width: "100%"}}
                    showSearch
                    value={selectedDependencyOrigin}
                    placeholder="Картинки из"
                    onFocus={loadDependencyList}
                    disabled={loading}
                    options={dependencyList.map(item => ({
                        label: (
                            <span style={{fontSize: 10}}
                                  data-search={item.title.toLowerCase()}>
                            <span style={{color: "red"}}>{item.qnt_images} </span>{item.title}</span>
                        ),
                        value: item.origin
                    }))}
                    filterOption={(input, option) => {
                        const search = option?.label?.props?.["data-search"];
                        return search?.includes(input.toLowerCase());
                    }}
                    onChange={handleImplementDependencyImages}
                />
                {loading && (<Spin size="small"/>)}
            </div>
        </Modal>
    );
};

export default OriginImageViewer;
