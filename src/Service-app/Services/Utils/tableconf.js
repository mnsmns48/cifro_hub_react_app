import {loadingImage, UpdateOrDeleteImage} from "./api.js";

export const tableConfig = {
    cifrohub: {
        endpoint: "/service/initial_hub_levels_with_preview",
        keyMap: {},
        uploadHandler: (code, file) => loadingImage(code, file, "/service/loading_hub_one_image"),
        updateHandler: (payload) => UpdateOrDeleteImage(payload, "/service/update_or_delete_hub_image")
    },
    cifrotech: {
        endpoint: "/service/initial_cifrotech_levels",
        keyMap: {name: "label", parent: "parent_id", code: "id"},
        uploadHandler: (code, file) => loadingImage(code, file, "/service/loading_ctech_one_image")
    }
};