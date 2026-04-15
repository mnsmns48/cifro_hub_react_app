import {useEffect, useState} from "react";
import {Modal, Button, Segmented, Table, Flex, Tooltip, Popconfirm} from "antd";
import {fetchPostData} from "../SchemeAttributes/api.js";
import "./Css/UpdateHubChooseElements.css"
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";
import SmartPhone from "../../../Cifrotech-app/components/products/smartPhone.jsx";
import DependencyModal from "../PriceUpdater/ResolveModelTypeDependencies.jsx";

const styleFn = (info) => {
    if (info.props.vertical) {
        return {
            root: {
                border: "2px solid #676760",
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

    const [selectedByTab, setSelectedByTab] = useState({});


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

                setData(cloned);
                setActive(0);
                const initial = {};
                cloned.forEach((tab, index) => {
                    initial[index] = tab.models
                        .filter(m => m.in_hub)
                        .map(m => m.id);
                });

                setSelectedByTab(initial);
            }

            setLoading(false);
        };

        void load();
    }, []);

    const activeTab = data.length > 0 ? data[active] : null;
    const selectedRowKeys = selectedByTab[active] || [];

    const onRowClick = (record) => {
        setSelectedByTab(prev => {
            const current = prev[active] || [];
            const next = current.includes(record.id)
                ? current.filter(id => id !== record.id)
                : [...current, record.id];

            return {...prev, [active]: next};
        });
    };

    const columns = [
        {
            title: "Цена ОТ",
            align: "center",
            width: 120,
            sorter: (a, b) => {
                const minA = Math.min(...(a.available || []).map(x => x.output_price));
                const minB = Math.min(...(b.available || []).map(x => x.output_price));
                return minA - minB;
            },
            render: (_, record) => {
                const list = record.available || [];
                if (list.length === 0) return "-";

                const minPrice = Math.min(...list.map(item => item.output_price));
                return minPrice.toLocaleString("ru-RU");
            }
        },
        {
            title: "Название",
            dataIndex: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text, record) => (
                <Tooltip
                    placement="right"
                    overlayStyle={{
                        maxWidth: 900,
                        padding: 0,
                    }}
                    title={
                        <div style={{maxWidth: 900}}>
                            <div style={{textAlign: "center", marginBottom: 10}}>
                                <div style={{color: "blue"}}>
                                    {record.source}
                                </div>
                                <div style={{fontWeight: 600}}>
                                    {record.title}
                                </div>
                            </div>
                            <div style={{textAlign: "left", marginBottom: 15}}>
                                <DependencyModal source={record.source} info={record.info} />
                            </div>
                            {record.available?.length ? (
                                <div style={{maxWidth: 900}}>
                                    {[...record.available]
                                        .sort((a, b) => a.output_price - b.output_price)
                                        .map((a, i) => (
                                            <div key={i} style={{marginBottom: 4}}>
                                                <span>{a.title}: </span>
                                                <span style={{color: "#7FFF00", fontWeight: 600}}>
                                            {a.output_price.toLocaleString("ru-RU")} ₽
                                        </span>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div>Нет данных</div>
                            )}
                        </div>
                    }
                >
            <span style={{cursor: "pointer"}}>
                {text}
            </span>
                </Tooltip>
            )
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

            <Modal open={true} onCancel={onClose} footer={null} width={1280} maskClosable={false}>
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
                                    rowSelection={{
                                        selectedRowKeys,
                                        onChange: (keys) =>
                                            setSelectedByTab(prev => ({...prev, [active]: keys})),
                                        preserveSelectedRowKeys: true,
                                    }}
                                    rowClassName={(record) =>
                                        selectedRowKeys.includes(record.id) ? "row-selected" : ""
                                    }
                                    onRow={(record) => ({
                                        onClick: () => onRowClick(record)
                                    })}
                                />
                            )}
                        </div>
                    </Flex>
                    <Popconfirm
                        title="Уверены, что хотите закрыть?"
                        description="Данные не сохранятся"
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={onClose}
                    >
                        <Button type="primary" style={{marginTop: 20}}>
                            Закрыть
                        </Button>
                    </Popconfirm>

                </div>
            </Modal>
        )
    );
}

export default UpdateHubChooseElements;