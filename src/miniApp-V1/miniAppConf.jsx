import {HomeOutlined, TruckOutlined} from "@ant-design/icons";

const prefix = import.meta.env.VITE_TG_MINI_APP_PREFIX


export const miniAppConfig = {
    hub: {
        AppBar: {key: "hub", title: "Быстро доставим", icon: <TruckOutlined/>, default: true},
        Content: {endpointMenu: `${prefix}/hub_levels`, endpointProducts: `${prefix}/products_by_path_ids`},
    },
    home: {
        AppBar: {key: "home", title: "Наличие", icon: <HomeOutlined/>}
    }

}
