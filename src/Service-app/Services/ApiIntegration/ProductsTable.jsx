import {Table} from "antd";

const ProductsTable = ({products}) => {
    if (!products || products.length === 0) {
        return <div style={{marginTop: 20}}>Нет товаров</div>;
    }

    const columns = [
        {
            title: "Название",
            dataIndex: "name",
            key: "name",
            width: "40%",
            render: (text) => <span style={{fontWeight: 500}}>{text}</span>
        },
        {
            title: "Код",
            dataIndex: "productCode",
            key: "productCode",
            width: 120
        },
        {
            title: "Бренд",
            dataIndex: "brand",
            key: "brand",
            width: 120
        },
        {
            title: "Цена",
            dataIndex: "price",
            key: "price",
            width: 120,
            render: (value) => (
                <span>{Number(value).toLocaleString("ru-RU")} ₽</span>
            )
        },
        {
            title: "Остаток",
            dataIndex: "amount",
            key: "amount",
            width: 100
        },
        {
            title: "Доставка",
            dataIndex: "delivery",
            key: "delivery",
            width: 100
        }
    ];

    return (
        <div style={{marginTop: 20}}>
            <h4>Товары</h4>
            <Table
                dataSource={products}
                columns={columns}
                rowKey="productCode"
            />
        </div>
    );
};

export default ProductsTable;
