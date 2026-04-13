import {useEffect, useState} from "react";
import {Modal, Button, Segmented, Table, Flex} from "antd";
import {fetchPostData} from "../SchemeAttributes/api.js";
import "./Css/UpdateHubChooseElements.css"

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
    const [data, setData] = useState({});   // теперь словарь
    const [active, setActive] = useState(null);

    useEffect(() => {
        const load = async () => {
            const payload = {vsl_list, path_ids};
            const res = await fetchPostData("/service/fetch_hub_routes", payload);

            if (res && Object.keys(res).length > 0) {
                setData(res);

                // первый ключ словаря
                const firstKey = Number(Object.keys(res)[0]);
                setActive(firstKey);
            }
        };

        void load();
    }, []);

    const activeTab = active !== null ? data[active] : null;

    const columns = [
        {
            title: "",
            width: 40,
            render: (_, r) => r.in_hub ? "✓" : "",
        },
        { title: "Название", dataIndex: "title" },
        {
            title: "Тип",
            render: (_, r) => r.type_.type,
        },
        {
            title: "Бренд",
            render: (_, r) => r.brand.brand,
        },
    ];


    return (
        <Modal open={true} onCancel={onClose} footer={null} width={1280}>
            <div style={{paddingTop: 25}}>
                <Flex gap="small">
                    {Object.keys(data).length > 0 && (
                        <Segmented
                            value={active}
                            onChange={setActive}
                            options={Object.entries(data).map(([path_id, payload]) => {
                                const route = payload.route;
                                const last = route[route.length - 1];

                                return {
                                    value: Number(path_id),
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
                            />

                        )}
                    </div>
                </Flex>

                <Button type="primary" onClick={onClose} style={{marginTop: 20}}>
                    Закрыть
                </Button>
            </div>
        </Modal>
    );
};

export default UpdateHubChooseElements;
