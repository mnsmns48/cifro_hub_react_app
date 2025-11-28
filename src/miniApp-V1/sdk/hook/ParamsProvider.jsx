import {useState, useEffect} from "react";
import {getFetch} from "../../api.js";
import {AppParamsContext} from "../context.js";

const loadServiceImages = async () => {
    return await getFetch(
        `${import.meta.env.VITE_TG_MINI_APP_PREFIX}/get_no_img_pic`
    );
};

export default function ParamsProvider({children}) {
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
        <AppParamsContext.Provider value={images}>
            {children}
        </AppParamsContext.Provider>
    );
}