import {
    CalculatorOutlined,
    CameraOutlined,
    ClockCircleOutlined,
    DeploymentUnitOutlined,
    FullscreenOutlined,
    ThunderboltOutlined,
    PlusCircleOutlined, SettingOutlined, FundProjectionScreenOutlined, EyeOutlined, SaveOutlined, ScanOutlined
} from "@ant-design/icons";

const baseFeatures = {
    releaseDate: {
        title: "Дата выхода",
        icon: ClockCircleOutlined,
        fields: [
            {key: "month"},
            {key: "year"}
        ]
    },

    display: {
        title: "Экран",
        icon: FundProjectionScreenOutlined,
        fields: [
            {key: "displayType"},
            {key: "displaySize", label: '"'}
        ]
    },

    displayResolution: {
        title: "Разрешение",
        icon: FullscreenOutlined,
        sourceKey: "display",
        fields: [
            {key: "displayResolution"}
        ]
    },

    displayRefreshRate: {
        title: "Частота обновления",
        icon: EyeOutlined,
        sourceKey: "display",
        fields: [
            {key: "displayRefreshRate", label: " Hz"}
        ]
    },

    battery: {
        title: "Батарея",
        icon: PlusCircleOutlined,
        fields: [
            {key: "batteryCapacity", label: " мАч"},
            {key: "batteryMaxPowerCharge", label: " Вт"}
        ]
    },

    quickCharge: {
        title: "Быстрая зарядка",
        icon: ThunderboltOutlined,
        fields: [
            {key: "quickCharge"}
        ]
    },

    camera: {
        title: "Камеры",
        icon: CameraOutlined,
        fields: [
            {key: "cameraSpecs", label: " mpx"}
        ]
    },

    memory: {
        title: "Память",
        icon: SaveOutlined,
        fields: [
            {key: "memorySpecs"}
        ]
    },

    selfie: {
        title: "Сэлфи",
        icon: CameraOutlined,
        fields: [
            {key: "selfieSpecs", label: " mpx"}
        ]
    },

    cpu: {
        title: "Процессор",
        icon: CalculatorOutlined,
        fields: [
            {key: "cpu"},
            {key: "cpuMaxClock", label: " Мгц"},
            {key: "cpuLithographyProcess", label: " нм"}
        ]
    },

    watchCpu: {
        title: "Процессор",
        icon: CalculatorOutlined,
        fields: [
            {key: "cpuWatchSpecs"},
            {key: "cpuName"}
        ]
    },

    antutuScore: {
        title: "Тест скорости Antutu",
        icon: SettingOutlined,
        fields: [
            {key: "antutuScore"}
        ]
    },

    system: {
        title: "Система",
        icon: DeploymentUnitOutlined,
        fields: [
            {key: "system"}
        ]
    },

    sensors: {
        title: "Датчики",
        icon: ScanOutlined,
        fields: [
            {key: "sensorsSpecs"}
        ]
    }
};


const deviceFeatureMap = {
    phone: [
        "releaseDate",
        "display",
        "displayResolution",
        "displayRefreshRate",
        "battery",
        "quickCharge",
        "camera",
        "selfie",
        "cpu",
        "antutuScore",
        "system"
    ],

    tablet: [
        "releaseDate",
        "display",
        "displayResolution",
        "displayRefreshRate",
        "battery",
        "quickCharge",
        "camera",
        "selfie",
        "cpu",
        "antutuScore",
        "system"
    ],

    watch: [
        "releaseDate",
        "display",
        "displayResolution",
        "battery",
        "watchCpu",
        "memory",
        "system",
        "sensors"
    ]
};

export function buildDeviceFeatures(normalizedData, type_) {
    if (!normalizedData) return [];

    const keys = deviceFeatureMap[type_];
    if (!keys) return [];

    const blocks = [];

    for (const featureKey of keys) {
        const featureConfig = baseFeatures[featureKey];
        const sourceKey = featureConfig.sourceKey || featureKey;
        const featureData = normalizedData[sourceKey];

        if (!featureConfig || !featureData) continue;

        const specs = [];

        for (const field of featureConfig.fields) {
            const val = featureData[field.key];

            if (val !== null && val !== undefined) {
                specs.push({
                    label: field.label || "",
                    value: val
                });
            }
        }

        if (specs.length) {
            blocks.push({
                icon: <featureConfig.icon/>,
                title: featureConfig.title,
                specs
            });
        }
    }

    return blocks;
}