import {Table} from "antd";
import {buildReadonlyRowSelection, getOriginRowClassName} from "./utils.js";


const ApproveWithoutPicsView = ({
                                           dataSource,
                                           columns,
                                           selectedRowKeys
                                       }) => {

    return (
        <Table
            rowKey="origin"
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            size="small"
            rowSelection={
                buildReadonlyRowSelection({
                    selectedRowKeys
                })
            }
            rowClassName={(record) => {
                return getOriginRowClassName(
                    record,
                    selectedRowKeys
                );
            }}
        />
    );
};

export default ApproveWithoutPicsView;