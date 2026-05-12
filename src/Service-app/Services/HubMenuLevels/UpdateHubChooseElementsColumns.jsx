import {Tooltip} from "antd";
import ResolveModelTypeDependencies from "../Common/ResolveModelTypeDependencies.jsx";

export const buildHubChooseElementsColumns = () => {
    return [
        {
            title: "Цена ОТ",
            align: "center",
            width: 120,
            sorter: (a, b) => {
                const minA = Math.min(...(a.origins || []).map(x => x.output_price));
                const minB = Math.min(...(b.origins || []).map(x => x.output_price));
                return minA - minB;
            },
            render: (_, record) => {
                const list = record.origins || [];
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
                    style={{
                        maxWidth: 900,
                        padding: 0,
                    }}
                    title={
                        <div style={{maxWidth: 900}}>

                            <div style={{textAlign: "left", marginBottom: 15}}>
                                <ResolveModelTypeDependencies source={record.source} info={record.info}/>
                            </div>
                            {record.origins?.length ? (
                                <div style={{maxWidth: 900}}>
                                    {[...record.origins]
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
}