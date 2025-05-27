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
                rowSelection={rowSelection}
                dataSource={result.data}
                rowKey="origin"
                columns={[
                    {
                        title: "Изображение",
                        dataIndex: "pic",
                        key: "pic",
                        render: (text, record) => (
                            <Image
                                width={50}
                                src={text || "/10000.png"}
                                // preview={{scale: 2}}
                                alt={record.title}
                            />
                        )
                    },
                    {
                        title: "Название",
                        dataIndex: "title",
                        key: "title",
                        render: (text) => <span style={{fontSize: "10px"}}>{text}</span>
                    },
                    {title: "Цена", dataIndex: "input_price", key: "input_price"},
                    {title: "Доставка", dataIndex: "shipment", key: "shipment"},
                    {title: "Гарантия", dataIndex: "warranty", key: "warranty"},
                    {title: "Дополнительно", dataIndex: "optional", key: "optional"}
                ]}
            />
        </>
    )
}


export default ParsingResults;