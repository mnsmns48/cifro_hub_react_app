import {useState, useEffect} from "react";
import {getFetch} from "../../api.js";
import {AppServicePicsContext} from "../context.js";

const loadServiceImages = async () => {
    return await getFetch(
        `${import.meta.env.VITE_TG_MINI_APP_PREFIX}/get_no_img_pic`
    );
};

export default function ServicePicProvider({children}) {
    const [images, setImages] = useState(null);

    useEffect(() => {
        const fetchParams = async () => {
            try {
                const data = await loadServiceImages();
                setImages(data);
            } catch (err) {
                console.error("Ошибка загрузки:", err);
            }
        };

        void fetchParams();
    }, []);


    return (
        <AppServicePicsContext.Provider value={images}>
            {children}
        </AppServicePicsContext.Provider>
    );
}