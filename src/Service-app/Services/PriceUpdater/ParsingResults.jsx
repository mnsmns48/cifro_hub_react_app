import {Table, Image, Button} from "antd";
import '../Css/ParsingResults.css'
import {useState} from "react";

const formatDate = (isoString) => {
    const date = new Date(isoString);
    date.setHours(date.getHours() + 3);
    return date.toISOString().slice(0, 16).replace("T", " ");
};


const ParsingResults = ({result}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => {
            setSelectedRowKeys(keys);
        }
    };

    const toggleSelection = () => {
        if (selectedRowKeys.length > 0) {
            setSelectedRowKeys([]);
        } else {
            const allKeys = result.data.map((item) => item.origin); // Выбор всех
            setSelectedRowKeys(allKeys);
        }
    };

    return (
        <>
            <div>
                <p><strong>Категория:</strong> {result.category.map((item, index) => <span key={index}>{item} </span>)}
                </p>
                <p><strong>Дата и время:</strong> {formatDate(result.datetime_now)}</p>
            </div>
            <Button onClick={toggleSelection} style={{marginBottom: 10}}>
                {selectedRowKeys.length > 0 ? "Снять выделение" : "Выбрать все"}
            </Button>
            <Table
                className="parsing-result-table"
                rowSelection={rowSelection}
                dataSource={result.data}
                tableLayout="fixed"
                rowKey="origin"
                columns={[
                    {
                        title: "Изображение",
                        dataIndex: "preview",
                        align: "center",
                        key: "preview",
                        render: (text, record) => (
                            <Image
                                width={60}
                                src={text || "/10000.png"}
                                alt={record.title}
                            />
                        )
                    },
                    {title: "Название", dataIndex: "title", key: "title", width: 200},
                    {title: "+", dataIndex: "input_price", key: "input_price", align: "center",
                        render: (text) => <span style={{color: "grey"}}>{text}</span>},
                    {title: "Цена"},
                    {title: "Доставка", dataIndex: "shipment", key: "shipment", align: "center"},
                    {title: "Гарантия", dataIndex: "warranty", key: "warranty", align: "center"},
                    {title: "Дополнительно", dataIndex: "optional", key: "optional"}
                ]}
            />
        </>
    )
}


export default ParsingResults;