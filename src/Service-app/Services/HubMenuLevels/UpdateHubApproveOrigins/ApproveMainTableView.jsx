import {Col, Row, Segmented, Table} from "antd";
import {buildInteractiveRowSelection, getOriginRowClassName} from "../UpdateHubApproveOrigins.jsx";


const ApproveMainTableView = ({
                                         data,
                                         paths,

                                         selectedPath,
                                         selectedModel,

                                         selectedPathId,
                                         selectedModelId,

                                         setSelectedPathId,
                                         setSelectedModelId,

                                         selectedRowKeys,
                                         setSelectedRowKeys,

                                         columns
                                     }) => {

    return (
        <Row gutter={16} wrap>

            <Col
                xs={24}
                sm={24}
                md={8}
                lg={6}
                xl={6}
                xxl={6}
            >

                <Segmented
                    vertical
                    size="small"
                    value={selectedPathId}
                    onChange={(val) => {

                        setSelectedPathId(val);

                        const backendPath = data.find(
                            p => p.path_id === val
                        );

                        if (
                            backendPath
                            &&
                            backendPath.models.length > 0
                        ) {
                            setSelectedModelId(
                                backendPath.models[0].id
                            );
                        }
                    }}
                    options={
                        paths
                            .filter(entry => {

                                const backendPath =
                                    data.find(
                                        p => p.path_id === entry.path_id
                                    );

                                return (
                                    backendPath
                                    &&
                                    backendPath.models.length > 0
                                );

                            })
                            .map(entry => ({
                                value: entry.path_id,
                                label: entry.route
                                    .map(r => r.label)
                                    .join(" - "),
                                icon: entry.route.at(-1)?.icon && (
                                    <img
                                        src={entry.route.at(-1).icon}
                                        width={18}
                                    />
                                )
                            }))
                    }
                    styles={{
                        item: {
                            justifyContent: "flex-start"
                        },
                        label: {
                            textAlign: "left"
                        }
                    }}
                />
            </Col>


            <Col
                xs={24}
                sm={24}
                md={16}
                lg={18}
                xl={18}
                xxl={18}
            >

                <div style={{marginBottom: 12}}>

                    <Segmented
                        vertical
                        size="small"
                        value={selectedModelId}
                        onChange={setSelectedModelId}
                        options={
                            (selectedPath?.models || [])
                                .map(m => ({
                                    label: m.title,
                                    value: m.id
                                }))
                        }
                        styles={{
                            item: {
                                justifyContent: "flex-start"
                            },
                            label: {
                                textAlign: "left"
                            }
                        }}
                    />
                </div>


                {selectedModel && (

                    <Table
                        rowKey="origin"
                        dataSource={selectedModel.origins}
                        columns={columns}
                        pagination={false}
                        size="small"
                        className="approve-origins-table"
                        rowSelection={
                            buildInteractiveRowSelection({
                                selectedRowKeys,
                                setSelectedRowKeys
                            })
                        }
                        rowClassName={(record) => {

                            return getOriginRowClassName(
                                record,
                                selectedRowKeys
                            );

                        }}
                    />
                )}
            </Col>
        </Row>
    );
};

export default ApproveMainTableView;