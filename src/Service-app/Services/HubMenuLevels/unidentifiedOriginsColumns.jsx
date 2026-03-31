import {Tag} from "antd";

export const getUnidentifiedOriginsColumns = ({ onOpenOrigin }) => [
    {
        title: "Origin",
        dataIndex: "origin",
        key: "origin",
        width: 120,
        render: (_, record) => {
            if (record.isGroup) {
                return {
                    children: <strong style={{ fontSize: 16 }}>{record.vsl_title}</strong>,
                    props: { colSpan: 8 }
                };
            }
            return (
                <a onClick={() => onOpenOrigin?.(record.origin)}>
                    {record.origin}
                </a>
            );
        }
    },
    {
        dataIndex: "title",
        key: "title",
        render: (_, record) => record.isGroup ? { props: { colSpan: 0 } } : record.title
    },
    {
        title: "Цена",
        dataIndex: "price",
        key: "price",
        render: (_, record) => record.isGroup ? { props: { colSpan: 0 } } : (record.price ?? "—")
    },
    {
        title: "Модель",
        dataIndex: "feature",
        key: "feature",
        render: (_, record) => record.isGroup ? { props: { colSpan: 0 } } : (record.feature ?? "—")
    },
    {
        title: "Тип",
        dataIndex: "type_",
        key: "type_",
        render: (_, record) => record.isGroup ? { props: { colSpan: 0 } } : (record.type_?.type ?? "—")
    },
    {
        title: "Бренд",
        dataIndex: "brand",
        key: "brand",
        render: (_, record) => record.isGroup ? { props: { colSpan: 0 } } : (record.brand?.brand ?? "—")
    },
    {
        title: "Атрибуты",
        dataIndex: "have_attributes",
        key: "have_attributes",
        render: (_, record) => record.isGroup ? { props: { colSpan: 0 } } :
            (record.have_attributes?.length
                ? record.have_attributes.map(a => <Tag key={a.id}>{a.value}</Tag>)
                : "—")
    },
    {
        title: "Изображения?",
        dataIndex: "have_images",
        key: "have_images",
        render: (_, record) => record.isGroup ? { props: { colSpan: 0 } } :
            (record.have_images ? <Tag color="green">Да</Tag> : <Tag color="red">Нет</Tag>)
    }
];
