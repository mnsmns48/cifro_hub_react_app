import {Button, Tag} from "antd";
import {
    CarryOutOutlined,
    LinkOutlined,
    PictureOutlined, QuestionOutlined
} from "@ant-design/icons";

const cell = (content) => (
    <div
        style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
        }}
    >
        {content}
    </div>
);


export const getUnidentifiedOriginsColumns = (filters, filtersState, modelColumnTitle, attrsColumnTitle) => [
    {
        dataIndex: "origin",
        key: "origin",
        width: 105,
        render: (_, record) => {
            if (record.children) {
                return {
                    children: cell(
                        <strong style={{
                            background: "#ececec", borderRadius: "5px", padding: "7px"
                        }}>
                            {record.vsl_title}
                        </strong>
                    ),
                    props: {colSpan: 999},

                };
            }

            return cell(
                <span style={{color: "#555"}}>
                {record.origin}
            </span>
            );
        }
    }
    ,
    {
        dataIndex: "title",
        key: "title",
        width: "40%",
        render: (_, record) => {
            if (record.children) {
                return {props: {colSpan: 0}};
            }
            return record.title;
        }
    },
    {
        title: "Цена",
        dataIndex: "price",
        key: "price",
        align: "center",
        render: (_, record) => {
            if (record.children) {
                return {props: {colSpan: 0}};
            }
            return record.price ?? "—";
        }
    },
    {
        title: modelColumnTitle,
        dataIndex: "feature",
        key: "feature",
        width: "20%",
        align: "center",
        filters: filters.features,
        filteredValue: filtersState.feature || null,
        onFilter: () => true,
        render: (_, record) => {
            if (record.children) {
                return {props: {colSpan: 0}};
            }
            return record.feature ?? <Button type="text" icon={<QuestionOutlined style={{color: "#919191"}}/>}/>;
        }
    },
    {
        title: "Тип",
        dataIndex: "type_",
        key: "type_",
        filters: filters.types,
        filteredValue: filtersState.type_ || null,
        onFilter: () => true,
        render: (_, record) => {
            if (record.children) {
                return {props: {colSpan: 0}};
            }
            return record.type_?.type ?? "—";
        }
    },
    {
        title: "Бренд",
        dataIndex: "brand",
        key: "brand",
        filters: filters.brands,
        filteredValue: filtersState.brand || null,
        onFilter: () => true,
        render: (_, record) => {
            if (record.children) {
                return {props: {colSpan: 0}};
            }
            return record.brand?.brand ?? "—";
        }
    },
    {
        title: attrsColumnTitle,
        dataIndex: "attributes",
        key: "attributes",
        width: 80,
        align: "center",
        render: (_, record) => {
            if (record.children) {
                return {props: {colSpan: 0}};
            }

            const a = record.attributes;
            const hasAttributes =
                a?.model_id &&
                Array.isArray(a.attr_value_ids) &&
                a.attr_value_ids.length > 0;

            return (
                <Button
                    type="text"
                    icon={<LinkOutlined/>}
                    style={{
                        color: hasAttributes ? "#52c41a" : "#dcdcdc",
                        fontSize: hasAttributes ? 18 : 14,
                        border: hasAttributes
                            ? "1px solid #52c41a"
                            : "1px solid transparent",
                        borderRadius: 9
                    }}
                />
            );
        }
    },
    {
        title: <PictureOutlined style={{opacity: 0.7, fontSize: 20}}/>,
        dataIndex: "have_images",
        key: "have_images",
        align: "center",
        filters: [
            {text: "Есть фото", value: true},
            {text: "Нет фото", value: false}
        ],
        filteredValue: filtersState.have_images || null,
        onFilter: () => true,
        render: (_, record) => {
            if (record.children) {
                return {props: {colSpan: 0}};
            }

            return record.have_images ? (
                <Tag color="green">
                    <PictureOutlined/>
                </Tag>
            ) : "";
        }
    },
    {
        title: <CarryOutOutlined style={{opacity: 0.7, fontSize: 20}}/>,
        dataIndex: "model_in_hub",
        key: "model_in_hub",
        align: "center",
        filters: [
            {text: "Есть в хабе", value: true},
            {text: "Нет в хабе", value: false}
        ],
        filteredValue: filtersState.model_in_hub || null,
        onFilter: () => true,
        render: (_, record) => {
            if (record.children) {
                return {props: {colSpan: 0}};
            }

            return record.model_in_hub ? (
                <Tag color="green">
                    <CarryOutOutlined/>
                </Tag>
            ) : "";
        }
    }

];