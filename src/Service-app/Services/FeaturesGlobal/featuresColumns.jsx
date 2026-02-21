import {Badge, Input} from "antd";


export const featuresColumns = (typeFilters,
                                brandFilters,
                                search,
                                setSearch,
                                noLevelCount,
                                onlyNoLevel,
                                setOnlyNoLevel) => [
    {
        title: "Тип",
        dataIndex: ["type", "type"],
        key: "type",
        width: 60,
        filters: typeFilters,
        onFilter: (value, record) => record.type.id === value,
    },
    {
        title: "Бренд",
        dataIndex: ["brand", "brand"],
        key: "brand",
        width: 80,
        filters: brandFilters,
        onFilter: (value, record) => record.brand.id === value,
    },
    {
        title: () => (
            <Input placeholder="Поиск по названию"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   allowClear
                   size="small"
                   style={{width: "100%"}}/>
        ),
        dataIndex: "title",
        key: "title",
        width: 200,
        sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
        title: () => (
            <div style={{display: "inline-flex", alignItems: "center"}}>
                <span>Hub</span>

                <Badge
                    count={noLevelCount}
                    style={{
                        backgroundColor: onlyNoLevel ? "rgba(129,129,129,0.38)" : "#ff0000",
                        cursor: "pointer",
                        marginLeft: 5
                    }}
                    onClick={() => setOnlyNoLevel(!onlyNoLevel)}
                />
            </div>

        ),
        key: "hub_level",
        width: 100,
        align: "center",
        render: (_, record) =>
            record.hub_level ? (
                <span style={{
                    backgroundColor: "rgba(22,119,255,0.73)",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    display: "inline-block",
                    whiteSpace: "nowrap",
                }}>
            {record.hub_level.label}
        </span>
            ) : (
                <span style={{color: "rgba(129,129,129,0.58)"}}>
                ?
            </span>
            ),
    }
];
