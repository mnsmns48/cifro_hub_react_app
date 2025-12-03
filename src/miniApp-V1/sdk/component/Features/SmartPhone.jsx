import nanoreview from './description_sources/nanoreview.js'
import gsmarena from './description_sources/gsmarena.js';
import {
    CalculatorOutlined,
    CameraOutlined,
    ClockCircleOutlined, DeploymentUnitOutlined,
    FullscreenOutlined,
    FundProjectionScreenOutlined, PlusCircleOutlined, SettingOutlined,
    ThunderboltOutlined, VideoCameraAddOutlined
} from "@ant-design/icons";

const sourcesMap = {nanoreview, gsmarena};

function shortSmartPhoneSpecification(infoArray, source) {
    const fn = sourcesMap[source];
    if (!fn) return [];
    const shortSpecs = fn(infoArray);
    if (!shortSpecs) return [];

    const result = [];

    if (shortSpecs.month || shortSpecs.year) {
        result.push({
            icon: <ClockCircleOutlined />,
            title: "Дата выхода",
            specs: [
                {value: shortSpecs.month},
                {value: shortSpecs.year}
            ]
        });
    }

    if (shortSpecs.displayType || shortSpecs.displaySize) {
        result.push({
            icon: <FundProjectionScreenOutlined />,
            title: "Дисплей",
            specs: [
                {value: shortSpecs.displayType},
                {value: shortSpecs.displaySize, label: '"'}
            ]
        });
    }

    if (shortSpecs.displayResolution || shortSpecs.displayRefreshRate) {
        result.push({
            icon: <FullscreenOutlined />,
            title: "Картинка",
            specs: [
                {value: shortSpecs.displayResolution, label: " x"},
                {value: shortSpecs.displayRefreshRate, label: " Гц"}
            ]
        });
    }

    if (shortSpecs.batteryCapacity || shortSpecs.batteryMaxPowerCharge) {
        result.push({
            icon: <PlusCircleOutlined />,
            title: "Батарея",
            specs: [
                {value: shortSpecs.batteryCapacity, label: " мАч"},
                {value: shortSpecs.batteryMaxPowerCharge, label: " Вт"}
            ]
        });
    }

    if (shortSpecs.quickCharge) {
        result.push({
            icon: <ThunderboltOutlined />,
            title: "Быстрая зарядка",
            specs: [{value: shortSpecs.quickCharge}]
        });
    } else if (shortSpecs.selfieSpecs) {
        result.push({
            icon: <VideoCameraAddOutlined />,
            title: "Селфи",
            specs: [{value: shortSpecs.selfieSpecs, label: " mpx"}]
        });
    }

    if (shortSpecs.cameraSpecs) {
        result.push({
            icon: <CameraOutlined />,
            title: "Камеры",
            specs: [{value: shortSpecs.cameraSpecs, label: " мpx"}]
        });
    }

    if (shortSpecs.cpu || shortSpecs.cpuMaxClock || shortSpecs.cpuLithographyProcess) {
        result.push({
            icon: <CalculatorOutlined />,
            title: "Процессор",
            specs: [
                {value: shortSpecs.cpu},
                {value: shortSpecs.cpuMaxClock, label: " Мгц"},
                {value: shortSpecs.cpuLithographyProcess, label: " нм"}
            ]
        });
    }

    if (shortSpecs.antutuScore) {
        result.push({
            icon: <SettingOutlined />,
            title: "Тест скорости Antutu",
            specs: [
                {value: shortSpecs.version ? `v${shortSpecs.version}` : null},
                {value: shortSpecs.antutuScore}
            ]
        });
    } else if (shortSpecs.system) {
        result.push({
            icon: <DeploymentUnitOutlined />,
            title: "Система",
            specs: [{value: shortSpecs.system}]
        });
    }

    return result;
}


export default function SmartPhone({ info }) {
    const features_array = Array.isArray(info.info) ? info.info : [];
    const blocks = shortSmartPhoneSpecification(features_array, info.source);

    if (!blocks.length) return null;

    return (
        <div style={{ padding: "8px" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#3a3a3a" }}>
                {blocks.map(({ icon, title, specs }) => (
                    <li key={title} style={{margin: "10px"}}>
                        <strong><span style={{
                            color: '#e2fc2a',
                            background: '#3a3a3a',
                            padding: '6px',
                            borderRadius: '12px',
                        }}>{icon}</span> {title}</strong>{" "}
                        <div style={{display: "inline", lineHeight: 1.9}}>
                            {specs
                                .map((s) => (s?.value ? `${s.value}${s.label || ""}` : null))
                                .filter(Boolean)
                                .join(" ")}
                        </div>

                    </li>
                ))}
            </ul>
        </div>
    );
}
