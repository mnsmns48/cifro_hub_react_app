import {Table} from "antd";

export default function OriginsWithoutPics({
                                               items,
                                               columns,
                                               onOpenImageModal
                                           }) {
    if (!items || items.length === 0) {
        return (
            <div style={{padding: 16, textAlign: "center", opacity: 0.6}}>
                Все выбранные позиции имеют фотографии
            </div>
        );
    }

    const dataSource = items.map(item => ({
        ...item.originRef,
        _model: item.modelRef,
        _path: item.pathRef
    }));

    const enhancedColumns = columns.map(col => {
        if (col.dataIndex === "pics" && !col.render) {
            return {
                ...col,
                render: (_, record) => (
                    <div
                        style={{cursor: "pointer", color: "#1677ff"}}
                        onClick={() => onOpenImageModal(record.origin)}
                    >
                        Нет фото
                    </div>
                )
            };
        }
        return col;
    });

    return (
        <Table
            rowKey="origin"
            dataSource={dataSource}
            columns={enhancedColumns}
            pagination={false}
            size="small"
            className="approve-origins-table"
            rowSelection={{
                preserveSelectedRowKeys: true,
                columnWidth: "2%",
                onChange: () => {
                },
                renderCell: () => null
            }}
            rowClassName={() => "row-no-pics"}
        />
    );
}
