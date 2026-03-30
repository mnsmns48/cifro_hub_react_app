import {Badge, Button, Input} from "antd";


export const featuresColumns = (
    typeFilters,
    brandFilters,
    search,
    setSearch,
    noLevelCount,
    onlyNoLevel,
    setOnlyNoLevel,
    descriptionClick,
    noFormulaCount,
    onlyNoFormula,
    setOnlyNoFormula
) => [
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
            <Input value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   allowClear
                   size="small"
                   style={{width: "100%"}}/>
        ),
        dataIndex: "title",
        key: "title",
        width: 200,
        sorter: (a, b) => a.title.localeCompare(b.title),
        render: (_, record) => (
            <Button type="link"
                    style={{padding: 0}}
                    onClick={() => descriptionClick(record)}> {record.title} </Button>)
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
        width: 150,
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
    },
    {
        title: () => (
            <div style={{display: "inline-flex", alignItems: "center"}}>
                <span>Formula</span>

                <Badge
                    count={noFormulaCount}
                    style={{
                        backgroundColor: onlyNoFormula ? "rgba(129,129,129,0.38)" : "#ff0000",
                        cursor: "pointer",
                        marginLeft: 5
                    }}
                    onClick={() => setOnlyNoFormula(!onlyNoFormula)}
                />
            </div>
        ),
        key: "formula",
        width: 150,
        align: "center",
        render: (_, record) =>
            record.formula ? (
                <span style={{
                    backgroundColor: "#e2fc2a",
                    color: "black",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    display: "inline-block",
                    whiteSpace: "nowrap",
                }}>
                {record.formula.name}
            </span>
            ) : (
                <span style={{color: "rgba(129,129,129,0.58)"}}>
                ?
            </span>
            ),
    }


];
