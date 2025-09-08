import TimeDayBlock from "../../../Ui/TimeDateBlock.jsx";
import {updateParsingItem} from "../PriceUpdater/api.js";

function getConsentTableColumns(setTabsData) {
    return [
        {
            title: "origin",
            dataIndex: "origin",
            key: "origin",
            width: 80,
        },
        {
            dataIndex: "title",
            key: "title",
            width: 365,
            ellipsis: true,
            render: (text, record) => (
                <div
                    contentEditable
                    tabIndex={0}
                    suppressContentEditableWarning
                    style={{ cursor: "text" }}
                    onBlur={async (e) => {
                        const newVal = e.target.innerText.trim();
                        if (!newVal || newVal === text) return;
                        setTabsData((prevTabs) =>
                            prevTabs.map((tab) => ({
                                ...tab,
                                items: tab.items.map((item) =>
                                    item.origin === record.origin
                                        ? { ...item, title: newVal }
                                        : item
                                ),
                            }))
                        );

                        const res = await updateParsingItem(record.origin, { title: newVal });
                        if (!res?.is_ok) console.error("Ошибка:", res?.message);
                    }}
                >
                    {text}
                </div>
            ),
        },
        {
            title: "Hub last updated",
            dataIndex: "hub_updated_at",
            key: "hub_updated_at",
            width: 100,
            align: "center",
            ellipsis: true,
            render: (value) => <TimeDayBlock isoString={value} />,
            responsive: ["lg"],
        },
        {
            title: "Hub Price Now",
            dataIndex: "hub_input_price",
            key: "hub_input_price",
            align: "center",
            width: 70,
        },
        {
            title: "Последний парсинг",
            dataIndex: "dt_parsed",
            key: "dt_parsed",
            width: 100,
            align: "center",
            render: (value) => <TimeDayBlock isoString={value} />,
            responsive: ["lg"]
        },
        {
            title: "Парсинг Price Now",
            dataIndex: "parsing_input_price",
            key: "parsing_input_price",
            align: "center",
            width: 70,
        },
        {
            title: "Профиль",
            dataIndex: "profit_range_id",
            key: "profit_range_id",
            width: 59,
            responsive: ["md"],
        },
    ];
}

export default getConsentTableColumns;