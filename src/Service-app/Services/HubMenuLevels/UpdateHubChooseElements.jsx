import {useEffect, useState} from "react";
import {Modal, Button, Segmented, Table, Flex, Spin} from "antd";
import {fetchPostData} from "../SchemeAttributes/api.js";
import "./Css/UpdateHubChooseElements.css"
import {DatabaseOutlined} from "@ant-design/icons";
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";

const styleFn = (info) => {
    if (info.props.vertical) {
        return {
            root: {
                border: "1px solid #77BEF0",
                padding: 4,
                width: 350,
            },
            icon: {
                color: "#676760",
            },
            item: {
                textAlign: "start",
            },
        };
    }
    return {};
};

const UpdateHubChooseElements = ({vsl_list, path_ids, onClose}) => {
    const [loading, setLoading] = useState(true);

    const [data, setData] = useState([]);
    const [active, setActive] = useState(0);

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            const payload = {vsl_list, path_ids};
            const res = await fetchPostData("/service/resolve_models_for_comparison", payload);

            if (Array.isArray(res) && res.length > 0) {
                const cloned = res.map(item => ({
                    ...item,
                    models: item.models.map(m => ({...m}))
                }));
                console.log("cloned---", cloned)
                setData(cloned);
                setActive(0);
            }

            setLoading(false);
        };

        void load();
    }, []);


    const onRowClick = (record) => {
        const newData = [...data];
        const tab = newData[active];

        for (let i = 0; i < tab.models.length; i++) {
            if (tab.models[i].id === record.id) {
                tab.models[i].in_hub = !tab.models[i].in_hub;
                break;
            }
        }

        setData(newData);
    };


    const activeTab = data.length > 0 ? data[active] : null;

    const columns = [
        {
            title: "",
            width: 40,
            render: (_, r) => r.in_hub ? "✓" : "",
        },
        {title: "Название", dataIndex: "title"},
        {
            title: "Модель",
            align: "center",
            width: 90,
            render: (_, record) => (
                <Button
                    size="small"
                    onClick={() => {
                        Modal.info({
                            title: record.title,
                            content: (
                                <pre style={{whiteSpace: "pre-wrap"}}>
                            {JSON.stringify(record.info, null, 2)}
                        </pre>
                            ),
                            width: 600,
                        });
                    }}
                    icon={<DatabaseOutlined/>}
                />
            ),
        },
        {
            title: "От",
            align: "center",
            width: 120,
            render: (_, record) => {
                const list = record.available || [];
                if (list.length === 0) {
                    return "-";
                }

                const price = list[0].output_price;
                return price.toLocaleString("ru-RU");
            }
        },

        {
            title: "Тип",
            align: "center",
            render: (_, r) => r.type_.type,
        },
        {
            title: "Бренд",
            align: "center",
            render: (_, r) => r.brand.brand,
        },


    ];

    return (
        loading ? (
            <Spinner/>
        ) : (
            <Modal open={true} onCancel={onClose} footer={null} width={1280}>
                <div style={{paddingTop: 25}}>
                    <Flex gap="small">
                        {data.length > 0 && (
                            <Segmented
                                value={active}
                                onChange={setActive}
                                options={data.map((item, index) => {
                                    const route = item.route;
                                    const last = route[route.length - 1];

                                    return {
                                        value: index,
                                        label: route.map((r) => r.label).join(" - "),
                                        icon: last?.icon ? (
                                            <img
                                                src={last.icon}
                                                alt={last.label}
                                                style={{width: 18, height: 18, objectFit: "contain"}}
                                            />
                                        ) : null,
                                    };
                                })}
                                styles={styleFn}
                                vertical
                                size="small"
                            />
                        )}

                        <div style={{flex: 1}}>
                            {activeTab && (
                                <Table
                                    rowKey="id"
                                    dataSource={activeTab.models}
                                    columns={columns}
                                    pagination={false}
                                    size="small"
                                    rowClassName={(record) => record.in_hub ? "row-selected" : ""}
                                    onRow={(record) => ({
                                        onClick: () => onRowClick(record)
                                    })}
                                />

                            )}
                        </div>
                    </Flex>

                    <Button type="primary" onClick={onClose} style={{marginTop: 20}}>
                        Закрыть
                    </Button>
                </div>
            </Modal>
        )
    );
};

export default UpdateHubChooseElements;
