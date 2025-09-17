import TimeDayBlock from "../../../Ui/TimeDateBlock.jsx";
import {updateParsingItem} from "../PriceUpdater/api.js";
import PriceBlock from "../../../Ui/PriceBlock.jsx";


const getConsentTableColumns = (setTabsData, isRetail) => {

    const getPriceFields = (record) => {
        const hubPrice = isRetail ? record.hub_output_price : record.hub_input_price;
        const parsingPrice = isRetail ? record.parsing_output_price : record.parsing_input_price;
        return {hubPrice, parsingPrice};
    };

    return [
        {
            title: "Код",
            dataIndex: "origin",
            key: "origin",
            width: 90,
            render: (text, record) => (
                <a href={record.url} target="_blank" rel="noopener noreferrer"
                   style={{
                       color: "#0c152c",
                       boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                       borderRadius: '5px',
                       padding: '4px 8px',
                       fontWeight: 'bold'
                   }}>
                    {text}
                </a>
            )
        },
        {
            dataIndex: "title",
            key: "title",
            width: 340,
            ellipsis: true,
            render: (text, record) => (
                <div
                    contentEditable
                    tabIndex={0}
                    suppressContentEditableWarning
                    style={{cursor: "text"}}
                    onBlur={async (e) => {
                        const newVal = e.target.innerText.trim();
                        if (!newVal || newVal === text) return;
                        setTabsData((prevTabs) =>
                            prevTabs.map((tab) => ({
                                ...tab,
                                items: tab.items.map((item) =>
                                    item.origin === record.origin
                                        ? {...item, title: newVal}
                                        : item
                                ),
                            }))
                        );

                        const res = await updateParsingItem(record.origin, {title: newVal});
                        if (!res?.is_ok) console.error("Ошибка:", res?.message);
                    }}
                >
                    {text}
                </div>
            ),
        },
        {
            title: "Склад",
            dataIndex: "optional",
            key: "optional",
            width: 120,
            render: (text) => (
                <div style={{ fontSize: 10, color: "#141640" }}>
                    {text}
                </div>
            )
        },
        {
            title: "Обновлено на Хабе",
            dataIndex: "hub_updated_at",
            key: "hub_updated_at",
            width: 100,
            align: "center",
            render: (value) => <TimeDayBlock isoString={value}/>,
            responsive: ["lg"],
        },
        {
            title: "Цена на Хабе",
            dataIndex: "hub_input_price",
            key: "hub_input_price",
            align: "center",
            render: (_, record) => {
                const {hubPrice, parsingPrice} = getPriceFields(record);
                return (
                    <PriceBlock
                        value={hubPrice}
                        referencePrice={parsingPrice}
                        status={record.status}
                    />
                );
            },
            width: 70,
        },
        {
            title: "Последний парсинг",
            dataIndex: "dt_parsed",
            key: "dt_parsed",
            width: 100,
            align: "center",
            render: (value) => <TimeDayBlock isoString={value}/>,
            responsive: ["lg"]
        },
        {
            title: "Цена при парсинге",
            dataIndex: "parsing_input_price",
            key: "parsing_input_price",
            align: "center",
            render: (_, record) => {
                const {hubPrice, parsingPrice} = getPriceFields(record);
                return (
                    <PriceBlock
                        value={parsingPrice}
                        referencePrice={hubPrice}
                        status={record.status}
                    />
                );
            },
            width: 70,
        },
    ];
}

export default getConsentTableColumns;