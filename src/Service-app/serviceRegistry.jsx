import {
    AppstoreAddOutlined, BarChartOutlined, BuildOutlined,
    DollarOutlined,
    FileSearchOutlined, FunctionOutlined, IdcardOutlined,
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
        key: "PriceUpdater",
        title: "Сбор данных",
        icon: makeIcon(FileSearchOutlined),
        loader: () => import("./Services/PriceUpdater.jsx"),
    },
    {
        key: "FeaturesGlobal",
        title: "Модели продуктов",
        icon: makeIcon(IdcardOutlined),
        loader: () => import("./Services/FeaturesGlobal.jsx"),
    },
    {
        key: "SpecsBuilder",
        title: "Шаблонизатор описаний",
        icon: makeIcon(BuildOutlined),
        loader: () => import("./Services/SpecsBuilder.jsx"),
    },
    {
        key: "SchemeAttributes",
        title: "Атрибуты",
        icon: makeIcon(AppstoreAddOutlined),
        loader: () => import("./Services/AttributesScheme.jsx"),
    },
    {
        key: "Formulas",
        title: "Формулы",
        icon: makeIcon(FunctionOutlined),
        loader: () => import("./Services/SchemeAttributes/FormulaList.jsx"),
    },
    {
        key: "Analytics",
        title: "Аналитика",
        icon: makeIcon(BarChartOutlined),
        loader: () => import("./Services/SchemeAttributes/Analytics.jsx"),
    },
    {
        key: "RewardRangeSettings",
        title: "Вознаграждение",
        icon: makeIcon(DollarOutlined),
        loader: () => import("./Services/RewardRangeSettings.jsx"),
    },
    {
        key: "Pictures",
        title: "Изображения",
        icon: makeIcon(PictureOutlined),
        loader: () => import("./Services/Pictures.jsx"),
    },
    {
        key: "Vendors",
        title: "Поставщики",
        icon: makeIcon(TruckOutlined),
        loader: () => import("./Services/Vendors.jsx"),
    },

];
