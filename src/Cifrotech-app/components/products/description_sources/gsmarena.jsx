import {createShortSmartPhoneSpecification, monthsMap, sanitizeInputNumber} from "../../../../../utils.js";
import {RenderShortSpecs} from "../smartPhone.jsx";

const processCameraSpecs = (item) => {
    const regex = /(\d+(\.\d+)?)\s*MP/g;
    const megapixels = [];
    let match;
    while ((match = regex.exec(item)) !== null) {
        megapixels.push(match[1]);
    }
    return megapixels.length > 1 ? megapixels.join(' + ') : megapixels[0] || null;
};


const gsmarenaReleaseDate = (features_array) => {
    const getReleaseDate = (item) => {
        const releaseDate = item['Launch']?.['Status'] || null;
        return releaseDate ? extractReleaseDate(releaseDate) : null;
    };
    const extractReleaseDate = (dateStr) => {
        const match = dateStr.match(/Released (\d+), (\w+)/);
        if (match) {
            const year = match[1];
            const month = monthsMap[match[2]];
            return {month, year};
        }
        return null;
    };
    let releaseDate;
    for (const item of features_array) {
        if (!releaseDate) {
            releaseDate = getReleaseDate(item);
        }
        if (releaseDate) {
            break;
        }
    }
    return releaseDate ? {...releaseDate} : null;
}


const gsmarenaDisplay = (features_array) => {
    const getDisplay = (item) => {
        const displayTypeAndRefreshRate = item['Display']?.['Type'] || null;
        return displayTypeAndRefreshRate ? extractTypeAndRefreshRate(displayTypeAndRefreshRate) : null;
    };
    const extractTypeAndRefreshRate = (item) => {
        const match = item.match(/^(.*?),.*?(\d+Hz)/);
        if (match) {
            return {
                displayType: match[1].trim(),
                displayRefreshRate: sanitizeInputNumber(match[2])
            };
        }
        return null;
    };
    const getDisplaySize = (item) => {
        const displaySize = item['Display']?.['Size'] || null;
        return displaySize ? extractSize(displaySize) : null;
    };
    const extractSize = (item) => {
        const regex = /^([\d.]+) inches/;
        const match = item.match(regex);
        if (match) {
            return match[1];
        }
        return null;
    };
    const getDisplayResolution = (item) => {
        const displayResolution = item['Display']?.['Resolution'] || null;
        return displayResolution ? extractResolution(displayResolution) : null;
    };
    const extractResolution = (item) => {
        const match = item.match(/^(\d+)\s*x\s*(\d+)/);
        if (match) {
            return `${match[2]} x ${match[1]}`;
        }
        return null;
    };
    let displayType;
    let displaySize;
    let displayResolution;
    let displayRefreshRate;
    for (const item of features_array) {
        if (!displayType || !displayRefreshRate) {
            const displayData = getDisplay(item);
            if (displayData) {
                displayType = displayData.displayType || displayType;
                displayRefreshRate = displayData.displayRefreshRate || displayRefreshRate;
            }
        }
        if (!displaySize) {
            displaySize = getDisplaySize(item);
        }
        if (!displayResolution) {
            displayResolution = getDisplayResolution(item);
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

const gsmarenaBattery = (features_array) => {
    const parseBatteryCapacity = (item) => {
        const capacityMatch = item.match(/(\d{3,4})\s?mAh/i);
        return capacityMatch ? `${capacityMatch[1]}` : null;
    };
    const parseBatteryMaxPower = (item) => {
        const batteryMaxPower = item.match(/\b(\d{1,3})W\b/i);
        return batteryMaxPower ? `${batteryMaxPower[1]}` : null;
    };
    const getBatteryCapacity = (item) => {
        const batteryCapacity = item['Battery']?.['Type'] || null;
        return batteryCapacity ? parseBatteryCapacity(batteryCapacity) : null;
    };
    const getBatteryMaxPower = (item) => {
        const batteryMaxPower = item['Battery']?.['Charging'] || null;
        return batteryMaxPower ? parseBatteryMaxPower(batteryMaxPower) : null;
    };
    let batteryCapacity;
    let batteryMaxPowerCharge;
    for (const item of features_array) {
        if (!batteryCapacity) {
            batteryCapacity = getBatteryCapacity(item);
        }
        if (!batteryMaxPowerCharge) {
            batteryMaxPowerCharge = getBatteryMaxPower(item);

        }
        if (batteryCapacity && batteryMaxPowerCharge) {
            break;
        }
    }
    return batteryCapacity || batteryMaxPowerCharge ? {
        batteryCapacity,
        batteryMaxPowerCharge,
    } : null;
};


const gsmarenaQuickCharge = (features_array) => {
    const parseQuickCharge = (item) => {
        const quickChargeMatch = item.match(/(\d+%) in (\d+ min)/);
        return quickCharge = quickChargeMatch ? `${quickChargeMatch[1]} за ${quickChargeMatch[2].replace("min", "минут")}`
            : null;
    };
    const getQuickCharge = (item) => {
        const quickCharge = item['Battery']?.['Charging'] || null;
        return quickCharge ? parseQuickCharge(quickCharge) : null;
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


const gsmarenaCamera = (features_array) => {
    const getCamera = (item) => {
        const cameraSpecs =
            item['Main Camera']?.['Single'] ||
            item['Main Camera']?.['Dual'] ||
            item['Main Camera']?.['Triple'] ||
            item['Main Camera']?.['Quad'] || null
        return cameraSpecs ? processCameraSpecs(cameraSpecs) : null
    }
    let cameraSpecs;
    for (const item of features_array) {
        if (!cameraSpecs) {
            cameraSpecs = getCamera(item);
        }
        if (cameraSpecs) {
            break;
        }
    }
    return cameraSpecs ? {cameraSpecs} : null
}

const gsmarenaSelfie = (features_array) => {
    const getCamera = (item) => {
        const selfieSpecs =
            item['Selfie camera']?.['Single'] ||
            item['Selfie camera']?.['Dual'] || null
        return selfieSpecs ? processCameraSpecs(selfieSpecs) : null
    }

    let selfieSpecs;
    for (const item of features_array) {
        if (!selfieSpecs) {
            selfieSpecs = getCamera(item);
        }
        if (selfieSpecs) {
            break;
        }
    }
    return selfieSpecs ? {selfieSpecs} : null
}


const gsmarenaCPU = (features_array) => {
    const getCPU = (item) => {
        const cpuInfo = item['Platform']?.['Chipset'] || null;
        if (cpuInfo) {
            const match = cpuInfo.match(/^(.+?)\s*\((\d+)\s*nm\)/);
            if (match) {
                const [, cpu, cpuLithographyProcess] = match;
                return {cpu, cpuLithographyProcess};
            }
        }
        return null;
    };
    let cpuSpecs = null;
    for (const item of features_array) {
        if (!cpuSpecs) {
            cpuSpecs = getCPU(item);
        }
        if (cpuSpecs) {
            break;
        }
    }
    return cpuSpecs;
};


const gsmarenaAntutu = (features_array) => {
    const extractAntutuScore = (input) => {
        const antutuSectionRegex = /AnTuTu:\s*(.*)/g;
        let antutuSectionMatch;
        if ((antutuSectionMatch = antutuSectionRegex.exec(input)) !== null) {
            const antutuSection = antutuSectionMatch[1];
            const numbersRegex = /(\d+)\s*\(v(\d+)\)/g;
            let maxScore = 0;
            let maxVersion = 0;
            let match;
            while ((match = numbersRegex.exec(antutuSection)) !== null) {
                const score = parseInt(match[1], 10);
                const version = parseInt(match[2], 10);
                if (version > maxVersion || (version === maxVersion && score > maxScore)) {
                    maxScore = score;
                    maxVersion = version;
                }
            }
            return maxScore > 0 ? {antutuScore: maxScore, version: maxVersion} : null;
        }
        return null;
    };
    const getAntutuScore = (item) => {
        const performanceData = item['Tests']?.['Performance'] || null;
        return performanceData ? extractAntutuScore(performanceData) : null;
    };
    let maxAntutuResult = null;
    for (const item of features_array) {
        const antutuResult = getAntutuScore(item);
        if (antutuResult) {
            if (
                !maxAntutuResult ||
                antutuResult.version > maxAntutuResult.version ||
                (antutuResult.version === maxAntutuResult.version && antutuResult.antutuScore > maxAntutuResult.antutuScore)
            ) {
                maxAntutuResult = antutuResult;
            }
        }
    }
    return maxAntutuResult;
};


const gsmarenaSystem = (features_array) => {
    const getSystem = (item) => {
        const system = item['Platform']?.['OS'] || null;
        return system ? cleanSystemString(system) : null;
    }
    const cleanSystemString = (str) => {
        return str.replace(/,\s*up.*?upgrades,\s*/g, ', ');
    };
    let system;
    for (const item of features_array) {
        if (!system) {
            system = getSystem(item);
        }
        if (system) {
            break;
        }
    }
    return system ? {system} : null
}


const gsmarenaShortSmartPhoneSpecification = (features_array) => {
    return createShortSmartPhoneSpecification(
        features_array,
        gsmarenaReleaseDate,
        gsmarenaDisplay,
        gsmarenaBattery,
        gsmarenaQuickCharge,
        gsmarenaCamera,
        gsmarenaCPU,
        gsmarenaSelfie,
        gsmarenaAntutu,
        gsmarenaSystem
    );
};


export default function gsmarena({features_array}) {
    return (
        <RenderShortSpecs
            features_array={features_array}
            shortSpecificationFn={gsmarenaShortSmartPhoneSpecification}
        />
    );
}