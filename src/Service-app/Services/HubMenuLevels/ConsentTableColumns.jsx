// import React from "react";
// import { Tag } from "antd";
//
//
// const STATUS_COLOR_MAP = {
//     only_parsing:   "default",  // серый
//     only_hub:       "red",
//     equal:          "blue",
//     hub_higher:     "green",
//     parsing_higher: "orange",
// };
//
//
// function renderPrice(val) {
//     return typeof val === "number"
//         ? `${val.toFixed(2)} ₽`
//         : <span style={{ color: "#999" }}>—</span>;
// }
//
//
// function renderDate(val) {
//     return val
//         ? new Date(val).toLocaleString("ru-RU", {
//             day:   "2-digit",
//             month: "2-digit",
//             year:  "numeric",
//             hour:  "2-digit",
//             minute:"2-digit",
//         })
//         : <span style={{ color: "#999" }}>—</span>;
// }
//
// function getConsentTableColumns() {
//     return [
//         {
//             title: "Origin",
//             dataIndex: "origin",
//             key: "origin",
//             width: 100,
//             sorter: (a, b) => a.origin - b.origin,
//             render: v => <strong>{v}</strong>,
//         },
//         {
//             title: "Название",
//             dataIndex: "title",
//             key: "title",
//             width: 200,
//         },
//         {
//             title: "Статус",
//             dataIndex: "status",
//             key: "status",
//             width: 120,
//             render: status => (
//                 <Tag color={STATUS_COLOR_MAP[status] || "blue"}>
//                     {status.replace(/_/g, " ")}
//                 </Tag>
//             ),
//         },
//         {
//             title: "Гарантия",
//             dataIndex: "warranty",
//             key: "warranty",
//             width: 120,
//             render: text =>
//                 text
//                     ? <Tag color="green">{text}</Tag>
//                     : <span style={{ color: "#999" }}>—</span>,
//         },
//         {
//             title: "Дополнительно",
//             dataIndex: "optional",
//             key: "optional",
//             width: 120,
//             render: text =>
//                 text
//                     ? <Tag color="purple">{text}</Tag>
//                     : <span style={{ color: "#999" }}>—</span>,
//         },
//         {
//             title: "Условия отгрузки",
//             dataIndex: "shipment",
//             key: "shipment",
//             width: 140,
//             render: text =>
//                 text
//                     ? <Tag color="cyan">{text}</Tag>
//                     : <span style={{ color: "#999" }}>—</span>,
//         },
//         {
//             title: "Parsing заголовок",
//             dataIndex: "parsing_line_title",
//             key: "parsing_line_title",
//             width: 200,
//             render: text =>
//                 text
//                     ? <span>{text}</span>
//                     : <span style={{ color: "#999" }}>—</span>,
//         },
//         {
//             title: "Цена (парсинг)",
//             dataIndex: "parsing_input_price",
//             key: "parsing_input_price",
//             align: "right",
//             width: 120,
//             sorter: (a, b) =>
//                 (a.parsing_input_price || 0) - (b.parsing_input_price || 0),
//             render: renderPrice,
//         },
//         {
//             title: "Цена (склад)",
//             dataIndex: "hub_input_price",
//             key: "hub_input_price",
//             align: "right",
//             width: 120,
//             sorter: (a, b) =>
//                 (a.hub_input_price || 0) - (b.hub_input_price || 0),
//             render: renderPrice,
//         },
//         {
//             title: "Разница",
//             dataIndex: "hub_input_price",
//             key: "diff",
//             align: "right",
//             width: 120,
//             sorter: (a, b) => {
//                 const diffA = (a.hub_input_price || 0) - (a.parsing_input_price || 0);
//                 const diffB = (b.hub_input_price || 0) - (b.parsing_input_price || 0);
//                 return diffA - diffB;
//             },
//             render: (_, record) => {
//                 const diff = (record.hub_input_price || 0) - (record.parsing_input_price || 0);
//                 const color = diff === 0
//                     ? "inherit"
//                     : diff > 0
//                         ? "green"
//                         : "orange";
//                 return <span style={{ color }}>{diff.toFixed(2)} ₽</span>;
//             },
//         },
//         {
//             title: "Parsed at",
//             dataIndex: "dt_parsed",
//             key: "dt_parsed",
//             width: 160,
//             sorter: (a, b) =>
//                 new Date(a.dt_parsed || 0) - new Date(b.dt_parsed || 0),
//             render: renderDate,
//         },
//         {
//             title: "Updated at",
//             dataIndex: "hub_updated_at",
//             key: "hub_updated_at",
//             width: 160,
//             sorter: (a, b) =>
//                 new Date(a.hub_updated_at || 0) - new Date(b.hub_updated_at || 0),
//             render: renderDate,
//         },
//         {
//             title: "Profit Range",
//             dataIndex: "profit_range_id",
//             key: "profit_range_id",
//             width: 120,
//             render: id =>
//                 typeof id === "number"
//                     ? <Tag color="magenta">#{id}</Tag>
//                     : <span style={{ color: "#999" }}>—</span>,
//         },
//     ];
// }
//
// export default getConsentTableColumns;



import {formatDate} from "../../../../utils.js";

function getConsentTableColumns() {
    return [
        {
            dataIndex: "origin",
            key: "origin",
            width: 80,
        },
        {
            title: "Название",
            dataIndex: "title",
            key: "title",
            width: 385,
            ellipsis: true,
        },
        // {
        //     title: "Статус",
        //     dataIndex: "status",
        //     key: "status",
        //     width: 100,
        // },
        // {
        //     title: "Гарантия",
        //     dataIndex: "warranty",
        //     key: "warranty",
        //     width: 120,
        //     ellipsis: true,
        // },
        // {
        //     title: "Дополнительно",
        //     dataIndex: "optional",
        //     key: "optional",
        //     width: 120,
        //     ellipsis: true,
        // },
        // {
        //     title: "Линия",
        //     dataIndex: "parsing_line_title",
        //     key: "parsing_line_title",
        //     width: 150,
        //     ellipsis: true,
        //     responsive: ["md"],
        // },
        {
            title: "Парсинг",
            dataIndex: "parsing_input_price",
            key: "parsing_input_price",
            align: "center",
            width: 80,
        },
        {
            title: "Сайт",
            dataIndex: "hub_input_price",
            key: "hub_input_price",
            align: "center",
            width: 80,
        },
        {
            title: "Parsed at",
            dataIndex: "dt_parsed",
            key: "dt_parsed",
            width: 130,
            align: "center",
            ellipsis: true,
            render: (value) => formatDate(value),
            responsive: ["lg"]
        },
        {
            title: "Updated at",
            dataIndex: "hub_updated_at",
            key: "hub_updated_at",
            width: 130,
            align: "center",
            ellipsis: true,
            render: (value) => formatDate(value),
            responsive: ["lg"],
        },
        {
            dataIndex: "profit_range_id",
            key: "profit_range_id",
            width: 30,
            responsive: ["lg"],
        },
    ];
}

export default getConsentTableColumns;