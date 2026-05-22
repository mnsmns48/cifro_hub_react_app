// ApproveOriginsWithoutPicsView.jsx

import {Table} from "antd";


const ApproveOriginsWithoutPicsView = ({
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

export default ApproveOriginsWithoutPicsView;