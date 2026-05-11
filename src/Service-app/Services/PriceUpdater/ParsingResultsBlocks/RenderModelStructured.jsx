import {useEffect, useState} from "react";
import {Modal, Table, Tooltip, Button} from "antd";
import {fetchPostData} from "../../Common/api.js";
import ResolveModelTypeDependencies from "../../Common/ResolveModelTypeDependencies.jsx";
import Spinner from "../../../../Cifrotech-app/components/Spinner.jsx";
import {QuestionCircleOutlined} from "@ant-design/icons";
import "../../Css/RenderModelStructured.css"
import EmptyState from "../../../../Ui/Empty.jsx";


const RenderModelStructured = ({vsl_id, onClose}) => {
    const [loading, setLoading] = useState(true);
    const [models, setModels] = useState([]);
    const [showPrices, setShowPrices] = useState(false);


    useEffect(() => {
        const load = async () => {
            setLoading(true);

            const payload = {vsl_id};
            const res = await fetchPostData("/service/render_models_structured", payload);

            if (Array.isArray(res)) {
                setModels(res);
            }

            setLoading(false);
        };

        void load();
    }, [vsl_id]);

    useEffect(() => {
        return () => {
            setModels([]);
            setLoading(true);
        };
    }, []);


    const columns = [
        {
            title: "Название",
            dataIndex: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text, record) => (
                <Tooltip
                    placement="right"
                    overlayStyle={{maxWidth: 500, padding: 0}}
                    title={
                        <div style={{maxWidth: 900}}>
                            <div style={{textAlign: "left", marginBottom: 15}}>
                                <ResolveModelTypeDependencies
                                    source={record.source}
                                    info={record.info}
                                />
                            </div>

                            {record.origins?.length ? (
                                <div style={{
                                    maxHeight: 180,
                                    overflowY: "auto",
                                    paddingRight: 6,
                                    marginTop: 6,
                                }}
                                >
                                    {[...record.origins]
                                        .sort((a, b) => a.output_price - b.output_price)
                                        .map((a, i) => (
                                            <div key={i}
                                                 style={{
                                                     display: "flex",
                                                     gap: 6,
                                                     fontSize: 12,
                                                     lineHeight: "16px",
                                                     marginBottom: 2,
                                                     alignItems: "center",
                                                     whiteSpace: "nowrap",
                                                 }}
                                            >
                                                <span style={{color: "#ccc"}}>{a.title}:</span>
                                                <span style={{color: "#7FFF00", fontWeight: 600}}>
                                                    {a.output_price.toLocaleString("ru-RU")} ₽
                                                </span>
                                                <span style={{color: "#999"}}>{a.origin}</span>
                                            </div>
                                        ))}
                                </div>

                            ) : (
                                <div>Нет данных</div>
                            )}
                        </div>
                    }
                >
                    <span style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#222",
                        letterSpacing: "0.2px"
                    }}> {text}
                    </span>

                </Tooltip>
            )
        },
        {
            title: "Цена ОТ",
            align: "left",
            width: 150,
            sorter: (a, b) => {
                const getMin = (rec) => {
                    const list = rec.origins || [];
                    if (!list.length) return 0;
                    return Math.min(...list.map(item =>
                        showPrices ? item.input_price : item.output_price
                    ));
                };

                return getMin(a) - getMin(b);
            },
            render: (_, record) => {
                const list = record.available || [];
                if (list.length === 0) return "-";

                const minPrice = Math.min(...list.map(item =>
                    showPrices ? item.input_price : item.output_price
                ));

                return (
                    <span
                        style={{
                            paddingLeft: 4,
                            fontSize: showPrices ? 14 : 15,
                            color: showPrices ? "#76508f" : "#003e67",
                            fontWeight: showPrices ? 400 : 600
                        }}>
                        {minPrice.toLocaleString("ru-RU")}
                    </span>

                );
            }
        }
    ];

    return loading ? (
        <Spinner/>
    ) : (
        <Modal open={true} onCancel={onClose} footer={null} width={800}>
            <div style={{paddingTop: 25}}>
                <Button onClick={() => setShowPrices(v => !v)} style={{
                    marginBottom: 10,
                    background: showPrices ? "#ff4d4f" : "transparent",
                    color: showPrices ? "white" : "inherit",
                    borderColor: showPrices ? "#ff4d4f" : "transparent"
                }}>
                    <QuestionCircleOutlined/>
                </Button>

                <Table
                    rowKey="id"
                    dataSource={models}
                    locale={{emptyText: <EmptyState/>}}
                    columns={columns}
                    pagination={false}
                    size="small"
                    rowClassName={(_, index) =>
                        index % 2 === 0 ? "row-light" : "row-dark"
                    }

                />
            </div>
        </Modal>
    );
};

export default RenderModelStructured;
