import {useCallback} from "react";
import {message} from "antd";
import {deleteImageFromS3, getUploadedImages, markImageAsPreview, uploadImageToS3} from "../PriceUpdater/api.js";


export const useImagesActions = (originCode, onUploaded) => {

    const fetchImages = useCallback(async () => {
        try {
            return await getUploadedImages(originCode);
        } catch {
            message.error("Не удалось загрузить изображения");
            return [];
        }
    }, [originCode]);

    const deleteImage = useCallback(async (filename) => {
        try {
            const {images, preview} = await deleteImageFromS3(originCode, filename);
            onUploaded?.({images, preview});
            return {images, preview};
        } catch {
            message.error("Ошибка при удалении");
            return null;
        }
    }, [originCode, onUploaded]);

    const markAsPreview = useCallback(async (filename) => {
        try {
            const {images, preview} = await markImageAsPreview(originCode, filename);
            onUploaded?.({images, preview});
            return {images, preview};
        } catch {
            message.error("Не удалось установить изображение как превью");
            return null;
        }
    }, [originCode, onUploaded]);

    const uploadImage = useCallback(async (file) => {
        try {
            const {images, preview} = await uploadImageToS3(originCode, file);
            onUploaded?.({images, preview});
            return {images, preview};
        } catch {
            message.error("Ошибка загрузки");
            return null;
        }
    }, [originCode, onUploaded]);

    return {
        fetchImages,
        deleteImage,
        markAsPreview,
        uploadImage
    };
};
