import {useCallback, useEffect, useState} from "react";
import {fetchGetData} from "../SchemeAttributes/api.js";
import {Image, Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";

const AttributesImageContainer = ({data}) => {
    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadImages = useCallback(async () => {
        if (!data) return;

        setLoading(true);

        const result = await fetchGetData(`service/fetch_images_62701/${data?.origin}`);

        setPreview(result?.preview ?? null);
        setImages(result?.images ?? []);

        setLoading(false);
    }, [data]);

    useEffect(() => {
        void loadImages();
    }, [data, loadImages]);

    return (
        <>
            {loading && (
                <div style={{display: "flex", justifyContent: "center", padding: 20, marginTop: 30}}>
                    <Spin indicator={<LoadingOutlined spin/>} size="large"/>
                </div>
            )}

            {!loading && (
                <Image.PreviewGroup>
                    <div style={{justifyContent: 'center', display: 'flex', alignItems: 'center', paddingBottom: 10}}>
                        <div style={{width: '30%'}}>
                            {preview && (
                                <Image
                                    src={preview}
                                    style={{borderRadius: 6, objectFit: "contain"}}
                                />
                            )}
                        </div>
                    </div>

                    <div style={{display: "flex", flexWrap: "wrap", gap: 8}}>
                        {images.map(img => (
                            <div
                                key={img.filename}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 6,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden"
                                }}
                            >
                                <Image
                                    src={img.url}
                                    preview={true}
                                    width="100%"
                                    height="100%"
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                    }}
                                    imgStyle={{
                                        objectFit: "contain",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </Image.PreviewGroup>
            )}
        </>
    );
};

export default AttributesImageContainer;
