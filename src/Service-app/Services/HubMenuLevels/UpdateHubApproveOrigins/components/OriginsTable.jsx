
import { Table } from "antd";

export default function OriginsTable({
                                         origins,
                                         columns,
                                         selectedRowKeys,
                                         onSelectChange,
                                         onOpenImageModal
                                     }) {
    if (!origins || origins.length === 0) return null;

    const enhancedColumns = columns.map(col => {
        if (col.dataIndex === "pics" && !col.render) {
            return {
                ...col,
                render: (_, record) => (
                    <div
                        style={{ cursor: "pointer", color: "#1677ff" }}
                        onClick={() => onOpenImageModal(record.origin)}
                    >
                        {Array.isArray(record.pics) && record.pics.length > 0
                            ? `Фото (${record.pics.length})`
                            : "Нет фото"}
                    </div>
                )
            };
        }
        return col;
    });

    return (
        <Table
            rowKey="origin"
            dataSource={origins}
            columns={enhancedColumns}
            pagination={false}
            size="small"
            className="approve-origins-table"
            rowSelection={{
                selectedRowKeys,
                onChange: onSelectChange,
                preserveSelectedRowKeys: true,
                columnWidth: "2%"
            }}
            rowClassName={(record) => {
                const isSelected = selectedRowKeys.includes(record.origin);
                const hasPics = Array.isArray(record.pics) && record.pics.length > 0;

                if (isSelected && !hasPics) return "row-selected-no-pics";
                if (isSelected) return "row-selected";
                return "";
            }}
        />
    );
}
