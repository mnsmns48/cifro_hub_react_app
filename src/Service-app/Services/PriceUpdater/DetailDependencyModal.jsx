import {Typography, Divider, Spin} from "antd";
import MyModal from "../../../Ui/MyModal.jsx";
import {useEffect} from "react";

const { Text, Title } = Typography;

const DependencyModal = ({ open, onClose, data }) => {



    if (!data) {
        return (
            <MyModal
                isOpen={open}
                onConfirm={onClose}
                onCancel={onClose}
                title={<div style={{ textAlign: "center" }}>Детали зависимости</div>}
                content={<Text type="secondary">Нет данных</Text>}
                footer={null}
            />
        );
    }

    const pros = data.pros_cons?.advantage || [];
    const cons = data.pros_cons?.disadvantage || [];


    let parsedInfo = [];


    console.log("DEBUG перед проверкой: data.info =", data.info, "Тип:", typeof data.info);
    if (typeof data.info === "string" && data.info.trim() !== "") {
        console.log("DEBUG: Условие выполнено, начинаю JSON.parse");
        parsedInfo = JSON.parse(data.info);
        console.log("✅ Parsed info:", parsedInfo);
    } else if (Array.isArray(data.info)) {
        parsedInfo = data.info;
        console.log("INFO: data.info уже массив");
    } else {
        console.log("INFO: data.info не удовлетворяет условиям");
    }




    return (
        <MyModal
            isOpen={open}
            onConfirm={onClose}
            onCancel={onClose}
            title={
                <div style={{ textAlign: "center" }}>
                    {data?.title || "Детали"}
                </div>
            }
            content={
                data ? (
                    <div style={{ maxHeight: "65vh", overflowY: "auto", paddingRight: 8 }}>
                        <Text type="secondary">
                            {data.brand} · {data.product_type}
                        </Text>

                        {parsedInfo.length > 0 ? (
                            parsedInfo.map((section, i) => {
                                const sectionTitle = Object.keys(section)[0];
                                const entries = section[sectionTitle];
                                return (
                                    <div key={`section-${i}`} style={{ marginTop: 18 }}>
                                        <Title level={5}>{sectionTitle}</Title>
                                        <ul style={{ paddingLeft: 20 }}>
                                            {Object.entries(entries).map(([label, value], idx) => (
                                                <li key={`entry-${sectionTitle}-${idx}`}>
                                                    <strong>{label}:</strong> {value}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })
                        ) : (
                            <Text type="secondary" style={{ display: "block", marginTop: 16 }}>
                                Нет подробностей в разделе info. <br />
                                <Text type="warning" style={{ fontSize: 12 }}>
                                    Проверь консоль на наличие ошибки при парсинге.
                                </Text>
                            </Text>
                        )}


                        {(pros.length > 0 || cons.length > 0) && <Divider />}

                        {pros.length > 0 && (
                            <div style={{ marginTop: 12 }}>
                                <Title level={5}>Преимущества</Title>
                                <ul style={{ paddingLeft: 20 }}>
                                    {pros.map((p, i) => (
                                        <li key={`pro-${i}`}>{p}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {cons.length > 0 && (
                            <div style={{ marginTop: 12 }}>
                                <Title level={5}>Недостатки</Title>
                                <ul style={{ paddingLeft: 20 }}>
                                    {cons.map((c, i) => (
                                        <li key={`con-${i}`}>{c}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                        <Spin tip="Загрузка данных..." />
                    </div>
                )
            }
            footer={null}
        />
    );
};

export default DependencyModal;
