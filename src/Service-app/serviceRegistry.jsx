import {
    AppstoreAddOutlined,
    DollarOutlined,
    FileSearchOutlined, IdcardOutlined,
    PictureOutlined,
    PrinterOutlined,
    StarOutlined,
    TruckOutlined
} from "@ant-design/icons";


const makeIcon = (IconComponent) => (
    <div className="circle-container">
        <IconComponent className="icon-style"/>
    </div>
);

export const serviceRegistry = [
    {
        key: "BillPrinter",
        title: "Товарный чек",
        icon: makeIcon(PrinterOutlined),
        loader: () => import("./Services/BillPrinter.jsx"),
    },
    {
        key: "HubMenuLevels",
        title: "Хаб",
        icon: makeIcon(StarOutlined),
        loader: () => import("./Services/HubMenuLevels.jsx"),
    },
    {
        key: "Pictures",
        title: "Изображения",
        icon: makeIcon(PictureOutlined),
        loader: () => import("./Services/Pictures.jsx"),
    },
    {
        key: "PriceUpdater",
        title: "Данные",
        icon: makeIcon(FileSearchOutlined),
        loader: () => import("./Services/PriceUpdater.jsx"),
    },
    {
        key: "SchemeAttributes",
        title: "Атрибуты",
        icon: makeIcon(AppstoreAddOutlined),
        loader: () => import("./Services/SchemeAttributes.jsx"),
    },
    {
        key: "FeaturesGlobal",
        title: "Описания продуктов",
        icon: makeIcon(IdcardOutlined),
        loader: () => import("./Services/FeaturesGlobal.jsx"),
    },
    {
        key: "RewardRangeSettings",
        title: "Вознаграждение",
        icon: makeIcon(DollarOutlined),
        loader: () => import("./Services/RewardRangeSettings.jsx"),
    },
    {
        key: "Vendors",
        title: "Поставщики",
        icon: makeIcon(TruckOutlined),
        loader: () => import("./Services/Vendors.jsx"),
    },

];
