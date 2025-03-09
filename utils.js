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


export const createShortSmartPhoneSpecification = (features_array, ...shortSpecificationFunctions) => {
    return shortSpecificationFunctions.reduce((specs, fn) => {
        return {
            ...specs,
            ...fn(features_array)
        };
    }, {});
};