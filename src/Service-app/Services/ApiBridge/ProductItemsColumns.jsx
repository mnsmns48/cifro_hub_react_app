export const getProductColumns = (brands, selectedBrands) => [
    {title: "Название", dataIndex: "name", key: "name", width: "40%"},

    {title: "Код", dataIndex: "productCode", key: "productCode", width: 120},

    {
        title: "Бренд",
        dataIndex: "brand",
        key: "brand",
        width: 120,

        filters: brands.map(b => ({text: b, value: b})),
        filterMultiple: true,

        filteredValue: selectedBrands
    },

    {title: "Цена", dataIndex: "price", key: "price", width: 120},
    {title: "Остаток", dataIndex: "amount", key: "amount", width: 100},
    {title: "Доставка", dataIndex: "delivery", key: "delivery", width: 100}
];
