import {createShortSmartPhoneSpecification, monthsMap, sanitizeInputNumber} from "../utils.js";

const nanoreviewReleaseDate = (features_array) => {
    let releaseDate;

    for (const item of features_array) {
        if (item?.['Другое']?.['Дата выхода']) {
            releaseDate = item['Другое']['Дата выхода'];
            break;
        }
        if (item?.['Other']?.['Release date']) {
            releaseDate = item['Other']['Release date'];
            break;
        }
    }

    if (typeof releaseDate !== 'string') return null;

    const regex = /(?:([а-яА-Я]+)\s(\d{4})|([a-zA-Z]+)\s(\d{4}))/;
    const match = releaseDate.match(regex);
    if (!match) return null;

    const russianMonth = match[1];
    const year = match[2] || match[4];
    const normalizedMonth = russianMonth ? monthsMap[russianMonth] : monthsMap[match[3]];

    return {month: normalizedMonth, year};
};


const nanoreviewDisplay = (features_array) => {
    const getDisplayType = (item) => {
        return item['Экран']?.['Тип'] || item['Display']?.['Type'] || null;
    };
    const getDisplaySize = (item) => {
        const size = item['Экран']?.['Размер'] || item['Display']?.['Size'] || null;
        return size ? extractNumericValue(size) : null;
    };
    const getDisplayResolution = (item) => {
        const resolution = item['Экран']?.['Разрешение'] || item['Display']?.['Resolution'] || null;
        return resolution ? extractResolution(resolution) : null;
    };

    const getDisplayRefreshRate = (item) => {
        const displayRefreshRate = item['Экран']?.['Частота обновления'] || item['Display']?.['Refresh rate'] || null
        return displayRefreshRate ? sanitizeInputNumber(displayRefreshRate) : null;
    }
    const extractNumericValue = (str) => {
        const match = str.match(/(\d+\.\d+)/);
        return match ? match[1] : null;
    };
    const extractResolution = (str) => {
        const match = str.match(/(\d+)\s*x\s*(\d+)/);
        return match ? `${match[2]} x ${match[1]}` : null;
    }
    let displayType;
    let displaySize;
    let displayResolution;
    let displayRefreshRate;
    for (const item of features_array) {
        if (!displayType) {
            displayType = getDisplayType(item);
        }
        if (!displaySize) {
            displaySize = getDisplaySize(item);
        }
        if (!displayResolution) {
            displayResolution = getDisplayResolution(item);
        }
        if (!displayRefreshRate) {
            displayRefreshRate = getDisplayRefreshRate(item);
        }
        if (displayType && displaySize && displayResolution && displayRefreshRate) {
            break;
        }
    }
    return displayType || displaySize || displayResolution || displayRefreshRate ? {
        displayType,
        displaySize,
        displayResolution,
        displayRefreshRate
    } : null;
};


const nanoreviewBattery = (features_array) => {
    const getBatteryCapacity = (item) => {
        const batteryCapacity = item['Батарея']?.['Объем'] || item['Battery']?.['Capacity'] || null;
        return batteryCapacity ? sanitizeInputNumber(batteryCapacity) : null;
    };
    const getBatteryMaxPowerCharge = (item) => {
        const batteryMaxPowerCharge = item['Батарея']?.['Макс. мощность зарядки'] || item['Battery']?.['Max charge power'] || null;
        return batteryMaxPowerCharge ? sanitizeInputNumber(batteryMaxPowerCharge) : null;
    };
    let batteryCapacity;
    let batteryMaxPowerCharge;
    for (const item of features_array) {
        if (!batteryCapacity) {
            batteryCapacity = getBatteryCapacity(item);
        }
        if (!batteryMaxPowerCharge) {
            batteryMaxPowerCharge = getBatteryMaxPowerCharge(item);
        }
        if (batteryCapacity && batteryMaxPowerCharge) {
            break;
        }
    }
    return batteryCapacity || batteryMaxPowerCharge ? {
        batteryCapacity,
        batteryMaxPowerCharge
    } : null;
};


const nanoreviewQuickCharge = (features_array) => {
    const getQuickCharge = (item) => {
        const quickCharge = item['Батарея']?.['Быстрая зарядка'] || item['Battery']?.['Fast charging'] || null;
        return quickCharge ? translateToRussian(quickCharge) : null;
    };
    const translateToRussian = (str) => {
        if (str.includes('Yes')) {
            return str.replace('Yes', 'Да').replace('in', 'за').replace('min', 'минут');
        }
        return str;
    };
    const extractBracketsContent = (str) => {
        const match = str.match(/\((.*?)\)/);
        return match ? match[1] : null;
    };
    let quickCharge = "Нет";
    for (const item of features_array) {
        const quickChargeValue = getQuickCharge(item);
        if (quickChargeValue && quickChargeValue.startsWith("Да")) {
            quickCharge = extractBracketsContent(quickChargeValue) || "Нет";
            break;
        }
    }
    return {quickCharge};
};

const nanoreviewCamera = (features_array) => {
    const convertCameraSpecs = (str) => {
        const regex = /(\d+)\s*MP/g;
        const megapixels = [];

        for (const match of str.matchAll(regex)) {
            megapixels.push(match[1]);
        }
        return megapixels.join(' + ');
    };
    const getCamera = (item) => {
        const cameraSpecs = item['Основная камера']?.['Количество объективов'] || item['Main camera']?.['Lenses'] || null;
        return cameraSpecs ? convertCameraSpecs(cameraSpecs) : null;
    };
    let cameraSpecs = null;
    for (const item of features_array) {
        if (!cameraSpecs) {
            cameraSpecs = getCamera(item);
        }
        if (cameraSpecs) {
            break;
        }
    }
    return cameraSpecs ? {cameraSpecs} : null;
};

const nanoreviewCPU = (features_array) => {
    const extractLithographyProcess = (str) => {
        const match = str.match(/(\d+)\s*(nanometers|нанометров)/i);
        return match ? match[1] : null;
    }
    const getCPU = (item) => {
        return item['Производительность']?.['Чипсет'] || item['Performance']?.['Chipset'] || null;
    }
    const getCPUMaxClock = (item) => {
        const maxClock = item['Производительность']?.['Макс. частота'] || item['Performance']?.['Max clock'] || null;
        return maxClock ? sanitizeInputNumber(maxClock) : null
    }
    const getCPULithographyProcess = (item) => {
        const process = item['Производительность']?.['Размер транзистора'] || item['Performance']?.['Lithography process'] || null;
        return process ? extractLithographyProcess(process) : null;
    }
    let cpu;
    let cpuMaxClock;
    let cpuLithographyProcess;
    for (const item of features_array) {
        if (!cpu) {
            cpu = getCPU(item);
        }
        if (!cpuMaxClock) {
            cpuMaxClock = getCPUMaxClock(item);
        }
        if (!cpuLithographyProcess) {
            cpuLithographyProcess = getCPULithographyProcess(item);
        }
        if (cpu && cpuMaxClock && cpuLithographyProcess) {
            break;
        }
    }
    return cpu || cpuMaxClock || cpuLithographyProcess ? {cpu, cpuMaxClock, cpuLithographyProcess} : null;
}

const nanoreviewAntutu = (features_array) => {
    const getAntutuScore = (item) => {
        return item['Производительность']?.['Total score'] || item['Performance']?.['Total score'] || null;
    }
    let antutuScore;
    for (const item of features_array) {
        if (!antutuScore) {
            antutuScore = getAntutuScore(item);
        }
        if (antutuScore) {
            break;
        }
    }
    return antutuScore ? {antutuScore} : null
}


const nanoreviewShortSmartPhoneSpecification = (features_array) => {
    return createShortSmartPhoneSpecification(
        features_array,
        nanoreviewReleaseDate,
        nanoreviewDisplay,
        nanoreviewBattery,
        nanoreviewQuickCharge,
        nanoreviewCamera,
        nanoreviewCPU,
        nanoreviewAntutu
    );
};


export default function nanoreview(features_array) {
    return nanoreviewShortSmartPhoneSpecification(features_array);
}