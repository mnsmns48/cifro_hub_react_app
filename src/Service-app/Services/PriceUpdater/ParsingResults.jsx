import {Table} from "antd";

const formatDate = (isoString) => {
    const date = new Date(isoString);
    date.setHours(date.getHours() + 3);
    return date.toISOString().slice(0, 16).replace("T", " ");
};


const ParsingResults = ({result}) => {
    return (
        <>
            <div>
                <p><strong>Категория:</strong> {result.category}</p>
                <p><strong>Дата и время:</strong> {formatDate(result.datetime_now)}</p>
            </div>
            <Table
                dataSource={result.data}
                columns={[
                    {
                        title: "Изображение",
                        dataIndex: "pic",
                        key: "pic",
                        render: (text, record) => <img src={text} alt={record.title} width="50"/>
                    },
                    {title: "Название", dataIndex: "title", key: "title"},
                    {title: "Цена", dataIndex: "input_price", key: "input_price"},
                    {title: "Доставка", dataIndex: "shipment", key: "shipment"},
                    {title: "Гарантия", dataIndex: "warranty", key: "warranty"},
                    {title: "Дополнительно", dataIndex: "optional", key: "optional"}
                ]}
                rowKey="title"
                pagination={{pageSize: 25}}
            />
        </>
    )
}


export default ParsingResults;