import {Input} from "antd";
import {CarOutlined} from "@ant-design/icons";

export const getProductColumns = (brands, search, setSearch) => [
    {
        title: () => (
            <Input value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   allowClear
                   size="small"
                   style={{width: "100%"}}/>
        )
        , dataIndex: "name", key: "name", width: "40%"
    },
    {title: "origin", dataIndex: "productCode", key: "productCode", width: 120},

    {
        dataIndex: "brand",
        key: "brand",
        align: "center",
        width: 120,
        filters: brands.map(b => ({text: b, value: b})),
        filterMultiple: true,
        onFilter: (value, record) => record.brand === value
    },

    {title: "Цена", dataIndex: "price", key: "price", width: 120, align: "center"},
    {title: "Остаток", dataIndex: "amount", key: "amount", width: 100, align: "center"},
    {title: <CarOutlined />, dataIndex: "delivery", key: "delivery", width: 100, align: "center"}
];
