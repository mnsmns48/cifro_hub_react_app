export const monthsMap = {
    'Январь': 'Январь',
    'Февраль': 'Февраль',
    'Март': 'Март',
    'Апрель': 'Апрель',
    'Май': 'Май',
    'Июнь': 'Июнь',
    'Июль': 'Июль',
    'Август': 'Август',
    'Сентябрь': 'Сентябрь',
    'Октябрь': 'Октябрь',
    'Ноябрь': 'Ноябрь',
    'Декабрь': 'Декабрь',
    'January': 'Январь',
    'February': 'Февраль',
    'March': 'Март',
    'April': 'Апрель',
    'May': 'Май',
    'June': 'Июнь',
    'July': 'Июль',
    'August': 'Август',
    'September': 'Сентябрь',
    'October': 'Октябрь',
    'November': 'Ноябрь',
    'December': 'Декабрь'
};


export const sanitizeInputNumber = (item) => {
    const numberMatch = item.match(/-?\d+(?:[.,]\d+)?/);
    return numberMatch ? numberMatch[0].replace(",", ".") : null;
};


export const createShortSmartPhoneSpecification = (
    features_array,
    releaseDateFn,
    displayFn,
    batteryFn,
    quickChargeFn,
    cameraSpecsFn,
    cpuSpecsFn,
    antutuScoreFn
) => {
    const releaseDateObj = releaseDateFn(features_array);
    const displayObj = displayFn(features_array);
    const batteryObj = batteryFn(features_array);
    const quickCharge = quickChargeFn(features_array)
    const cameraSpecs = cameraSpecsFn(features_array)
    const cpuSpecs = cpuSpecsFn(features_array)
    const antutuScore = antutuScoreFn(features_array)
    return {
        ...releaseDateObj,
        ...displayObj,
        ...batteryObj,
        ...quickCharge,
        ...cameraSpecs,
        ...cpuSpecs,
        ...antutuScore
    };
};