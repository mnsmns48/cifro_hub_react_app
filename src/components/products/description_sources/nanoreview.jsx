import {monthsMap} from "../../../../utils.js";

const nanoreviewReleaseDate = (features_array) => {
    let releaseDate;
    for (const item of features_array) {
        switch (true) {
            case !!item['Другое']?.['Дата выхода']:
                releaseDate = item['Другое']['Дата выхода'];
                break;
            case !!item['Other']?.['Release date']:
                releaseDate = item['Other']['Release date'];
                break;
        }
    }
    const regex = /(?:([а-яА-Я]+)\s(\d{4})|([a-zA-Z]+)\s(\d{4}))/;
    const match = releaseDate.match(regex);
    if (match) {
        const russianMonth = match[1];
        const year = match[2] || match[4];
        const normalizedMonth = russianMonth ? monthsMap[russianMonth] : monthsMap[match[3]];
        return releaseDate ? {month: normalizedMonth, year: year} : null;
    }
}


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
        return item['Экран']?.['Частота обновления'] || item['Display']?.['Refresh rate'] || null
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
        return item['Батарея']?.['Объем'] || item['Battery']?.['Capacity'] || null;
    };
    const getBatteryMaxPowerCharge = (item) => {
        return item['Батарея']?.['Макс. мощность зарядки'] || item['Battery']?.['Max charge power'] || null;
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

    let quickCharge;
    for (const item of features_array) {
        if (!quickCharge) {
            quickCharge = getQuickCharge(item);
        }
        if (quickCharge) {
            break;
        }
    }
    return quickCharge ? {quickCharge} : null
}

const nanoreviewCamera = (features_array) => {
    const convertCameraSpecs = (str) => {
        const regex = /(\d+)\s*MP/g;
        const types = str.match(/(\w+):/g);

        let result = '';
        let index = 0;

        for (const match of str.matchAll(regex)) {
            const typeInitial = types[index] ? types[index][0] : '';
            const megapixels = match[1];

            result += `${typeInitial}: ${megapixels}MP `;
            index++;
        }
        return result.trim()
    }
    const getCamera = (item) => {
        const cameraSpecs = item['Основная камера']?.['Количество объективов'] || item['Main camera']?.['Lenses'] || null;
        return cameraSpecs ? convertCameraSpecs(cameraSpecs) : null
    }
    let Camera;
    for (const item of features_array) {
        if (!Camera) {
            Camera = getCamera(item);
        }
        if (Camera) {
            break;
        }
    }
    return Camera ? {Camera} : null
}

const nanoreviewCPU = (features_array) => {
    const extractLithographyProcess = (str) => {
        const match = str.match(/(\d+)\s*(nanometers|нанометров)/i);
        return match ? `${match[1]} нм` : null;
    }
    const getCPU = (item) => {
        return item['Производительность']?.['Чипсет'] || item['Performance']?.['Chipset'] || null;
    }
    const getCPUMaxClock = (item) => {
        return item['Производительность']?.['Макс. частота'] || item['Performance']?.['Max clock'] || null;
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
    const getAntutu = (item) => {
        return item['Производительность']?.['Total score'] || item['Performance']?.['Total score'] || null;
    }
    let Antutu;
    for (const item of features_array) {
        if (!Antutu) {
            Antutu = getAntutu(item);
        }
        if (Antutu) {
            break;
        }
    }
    return Antutu ? {Antutu} : null
}


export default function nanoreview({features_array}) {
    const releaseDateObj = nanoreviewReleaseDate(features_array)
    const displayObj = nanoreviewDisplay(features_array)
    const batteryObj = nanoreviewBattery(features_array)
    const quickChargeObj = nanoreviewQuickCharge(features_array)
    const cameraObj = nanoreviewCamera(features_array)
    const cpuObj = nanoreviewCPU(features_array)
    const antutuObj = nanoreviewAntutu(features_array)
    return (
        <>
        {displayObj && (
            <div>
                Дисплей:
                {displayObj.displayType && ` ${displayObj.displayType}`}
                {displayObj.displaySize && ` ${displayObj.displaySize}"`}
                {displayObj.displayResolution && ` ${displayObj.displayResolution}`}
                {displayObj.displayRefreshRate && ` ${displayObj.displayRefreshRate}`}
            </div>
        )}
        {batteryObj && (
            <div>
                АКБ:
                {batteryObj.batteryCapacity && ` ${batteryObj.batteryCapacity}`}
                {batteryObj.batteryMaxPowerCharge && ` ${batteryObj.batteryMaxPowerCharge}`}
            </div>
        )}
        {quickChargeObj && (
            <div>
                Быстрая зарядка: {quickChargeObj.quickCharge}
            </div>
        )}
            {cameraObj && (
                <div>
                    Камеры: {cameraObj.Camera}
                </div>
            )}
            {cpuObj && (
                <div>
                    {cpuObj.cpu && ` ${cpuObj.cpu}`}
                    {cpuObj.cpuMaxClock && ` ${cpuObj.cpuMaxClock}`}
                    {cpuObj.cpuLithographyProcess && ` ${cpuObj.cpuLithographyProcess}`}
                </div>
            )}
            {antutuObj && (
                <div>
                    Оценка производительности Antutu: {antutuObj.Antutu}
                </div>
            )}
            {releaseDateObj?.month && releaseDateObj?.year && (
                <div>
                    Дата выхода: {releaseDateObj.month} {releaseDateObj.year}
                </div>
            )}
        </>
    )
}
