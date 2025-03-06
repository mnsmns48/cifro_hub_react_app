export const getMonthAndYear = (dateStr) => {
    const monthTranslations = {
        January: "Январь",
        February: "Февраль",
        March: "Март",
        April: "Апрель",
        May: "Май",
        June: "Июнь",
        July: "Июль",
        August: "Август",
        September: "Сентябрь",
        October: "Октябрь",
        November: "Ноябрь",
        December: "Декабрь"
    };
    const regexFullDateWithComma = /(\d{4}),?\s?(January|February|March|April|May|June|July|August|September|October|November|December)/;
    const regexMonthYear = /(January|February|March|April|May|June|July|August|September|October|November|December)\s(\d{4})/;
    const regexRussian = /(Сентябрь|Октябрь|Ноябрь|Декабрь|Январь|Февраль|Март|Апрель|Май|Июнь|Июль|Август)\s(\d{4})/;
    let match = dateStr.match(regexFullDateWithComma);
    if (match) {
        const [_, year, month] = match;
        return `${monthTranslations[month]} ${year}`;
    }
    match = dateStr.match(regexMonthYear);
    if (match) {
        const [_, month, year] = match;
        return `${monthTranslations[month]} ${year}`;
    }
    match = dateStr.match(regexRussian);
    if (match) {
        const [_, month, year] = match;
        return `${month} ${year}`;
    }
    return "";
};
