import {useEffect, useState} from "react";
import {Select, Table} from "antd";
import {fetchGetData} from "./api.js";

const TabAttributeValues = () => {
    const [keys, setKeys] = useState([]);
    const [values, setValues] = useState([]);
    const [selectedKey, setSelectedKey] = useState(null);

    useEffect(() => {
        fetchGetData("/service/attributes/get_attr_values").then((res) => {
            setKeys(res.keys);
            setValues(res.values);
        });
    }, []);

    const filtered = selectedKey
        ? values.filter(v => v.key === selectedKey)
        : [];

    const columns = [{dataIndex: "value", key: "value"}, {dataIndex: "alias", key: "alias"}];

    return (
        <div>
            <Select
                placeholder="Выберите ключ"
                style={{width: 300, marginBottom: 16}}
                onChange={setSelectedKey}
                options={keys.map(k => ({label: k.key, value: k.key}))}
            />

            <Table
                columns={columns}
                dataSource={filtered}
                rowKey="id"
                pagination={false}
                showHeader={false}
            />
        </div>
    );
};

export default TabAttributeValues;
