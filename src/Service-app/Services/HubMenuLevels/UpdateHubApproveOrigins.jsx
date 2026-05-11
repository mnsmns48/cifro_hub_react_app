import {useEffect, useState} from "react";
import {Segmented, Table, Flex, Button, Modal} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {fetchPostData} from "../Common/api.js";
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";
import "./Css/UpdateHubApproveOrigins.css"
import OriginImageViewer from "../Common/OriginImageViewer.jsx";
import {buildApproveOriginsColumns} from "./UpdateHubApproveOriginsColumns.jsx";

const DeepViewer = ({data, indent = 0}) => {
    if (data === null || data === undefined) {
        return <div style={{marginLeft: indent}}>null</div>;
    }

    if (typeof data !== "object") {
        return <div style={{marginLeft: indent}}>{String(data)}</div>;
    }

    if (Array.isArray(data)) {
        return (
            <div style={{marginLeft: indent}}>
                {data.map((item, i) => (
                    <DeepViewer key={i} data={item} indent={indent + 12}/>
                ))}
            </div>
        );
    }

    return (
        <div style={{marginLeft: indent}}>
            {Object.entries(data).map(([key, value]) => (
                <div key={key} style={{marginBottom: 6}}>
                    <div style={{color: "#7FFF00", fontWeight: 600}}>
                        {key}:
                    </div>
                    <DeepViewer data={value} indent={indent + 12}/>
                </div>
            ))}
        </div>
    );
};


const UpdateHubApproveOrigins = ({objForUpdate, onCloseParent, onCloseApproveOrigins}) => {
    // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    // const [loading, setLoading] = useState(false);
    // const [dataForUpdate, setDataForUpdate] = useState([]);
    // const [selectedPathId, setSelectedPathId] = useState(null);
    // const [selectedFeatureId, setSelectedFeatureId] = useState(null);
    // const [openedImageModalView, setOpenedImageModalView] = useState(null);
    //
    //
    // useEffect(() => {
    //     setLoading(true);
    //     const load = async () => {
    //         try {
    //             const payload = {
    //                 items: Array.from(objForUpdate.values()).map(entry => ({
    //                     path_id: entry.path_id, models_ids: entry.models
    //                 }))
    //             };
    //
    //             const resp = await fetchPostData("/service/approve_origins_for_update", payload);
    //             setDataForUpdate(resp);
    //
    //
    //             if (resp.length > 0) {
    //                 setSelectedPathId(resp[0].path.id);
    //
    //                 if (resp[0].products.length > 0) {
    //                     setSelectedFeatureId(resp[0].products[0].id);
    //                 }
    //             }
    //         } finally {
    //             setLoading(false);
    //
    //         }
    //     };
    //
    //     void load();
    //
    // }, [objForUpdate]);
    //
    //
    // useEffect(() => {
    //     if (!loading && dataForUpdate.length > 0) {
    //         const validPaths = dataForUpdate.filter(p => p.products.length > 0);
    //         if (validPaths.length > 0) {
    //             if (!validPaths.some(p => p.path.id === selectedPathId)) {
    //                 setSelectedPathId(validPaths[0].path.id);
    //                 setSelectedFeatureId(validPaths[0].products[0].id);
    //             }
    //         }
    //     }
    // }, [dataForUpdate]);
    //
    //
    // const rowSelection = {
    //     selectedRowKeys,
    //     onChange: (newSelectedRowKeys) => {
    //         setSelectedRowKeys(newSelectedRowKeys);
    //     },
    // };
    //
    // const selectedPath = dataForUpdate.find((p) => p.path.id === selectedPathId);
    // const features = selectedPath ? selectedPath.products : [];
    // const selectedFeature = features.find((f) => f.id === selectedFeatureId);
    //
    // useEffect(() => {
    //     if (selectedFeature && selectedFeature.items) {
    //         const allKeys = selectedFeature.items.map(item => item.origin);
    //         setSelectedRowKeys(allKeys);
    //     }
    // }, [selectedFeature]);
    //
    //
    // const columns = buildApproveOriginsColumns({
    //     setOpenedImageModalView,
    //     selectedFeature,
    // });
    //
    //
    // const handleImagesUpdated = ({images}, origin) => {
    //     setOpenedImageModalView(prev =>
    //         prev && prev.origin === origin
    //             ? {...prev, images}
    //             : prev
    //     );
    //
    //     setDataForUpdate(prev =>
    //         prev.map(path => ({
    //             ...path,
    //             products: path.products.map(prod => ({
    //                 ...prod,
    //                 items: prod.items.map(item =>
    //                     item.origin === origin
    //                         ? {...item, pics: images}
    //                         : item
    //                 )
    //             }))
    //         }))
    //     );
    // };


    return (
        <>
            <Modal open closable={false} footer={null} width={1650} onCancel={onCloseApproveOrigins}>
                <div
                    style={{
                        background: "#111",
                        color: "#eee",
                        padding: 16,
                        borderRadius: 8,
                        maxHeight: 700,
                        overflowY: "auto",
                        fontSize: 12,
                        lineHeight: "16px"
                    }}
                >
                    <DeepViewer data={objForUpdate} />
                </div>


                {/*{loading ? (*/}
                {/*    <div>*/}
                {/*        <Spinner/>*/}
                {/*    </div>*/}
                {/*) : (*/}
                {/*    <div style={{padding: 16}}>*/}
                {/*<div style={{marginBottom: 8, textAlign: "left"}}>*/}
                {/*    <Button icon={<CloseOutlined/>} type="primary" onClick={onCloseApproveOrigins}>*/}
                {/*        Закрыть*/}
                {/*    </Button>*/}
                {/*</div>*/}

                {/*<Flex gap={16} align="flex-end" style={{marginBottom: 20}}>*/}
                {/*    <div className="vertical-segmented">*/}
                {/*        <Segmented*/}
                {/*            vertical*/}
                {/*            size="small"*/}
                {/*            value={selectedPathId}*/}
                {/*            onChange={(val) => {*/}
                {/*                setSelectedPathId(val);*/}
                {/*                const backendPath = dataForUpdate.find(p => p.path.id === val);*/}
                {/*                if (backendPath && backendPath.products.length > 0) {*/}
                {/*                    setSelectedFeatureId(backendPath.products[0].id);*/}
                {/*                }*/}
                {/*            }}*/}
                {/*            options={Array.from(objForUpdate.values())*/}
                {/*                .filter(entry => {*/}
                {/*                    const backendPath = dataForUpdate.find(p => p.path.id === entry.path_id);*/}
                {/*                    return backendPath && backendPath.products.length > 0;*/}
                {/*                })*/}
                {/*                .map(entry => ({*/}
                {/*                    value: entry.path_id,*/}
                {/*                    label: entry.route.map(r => r.label).join(" - "),*/}
                {/*                    icon: entry.route.at(-1)?.icon && (*/}
                {/*                        <img src={entry.route.at(-1).icon} width={18}/>*/}
                {/*                    )*/}
                {/*                }))*/}
                {/*            }*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*    <div className="vertical-segmented">*/}
                {/*        <Segmented*/}
                {/*            vertical*/}
                {/*            size="small"*/}
                {/*            value={selectedFeatureId}*/}
                {/*            onChange={setSelectedFeatureId}*/}
                {/*            options={features.map(f => ({label: f.title, value: f.id}))}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</Flex>*/}

                {/*{selectedFeature && (*/}
                {/*    <Table*/}
                {/*        rowKey="origin"*/}
                {/*        dataSource={selectedFeature.items}*/}
                {/*        columns={columns}*/}
                {/*        pagination={false}*/}
                {/*        size="small"*/}
                {/*        rowSelection={rowSelection}*/}
                {/*        rowClassName={(record) => {*/}
                {/*            const noPreview = !(record.pics || []).some(p => p.is_preview);*/}
                {/*            const noPics = !record.pics || record.pics.length === 0;*/}
                {/*            const noPhoto = noPreview && noPics;*/}
                {/*            const isSelected = selectedRowKeys.includes(record.origin);*/}
                {/*            if (noPhoto && isSelected) return "row-no-photo-selected";*/}
                {/*            if (noPhoto) return "row-no-photo";*/}

                {/*            return "";*/}
                {/*        }}*/}
                {/*    />*/}

                {/*)}*/}
                {/*    </div>*/}
                {/*)}*/}
            </Modal>
            {/*{openedImageModalView && openedImageModalView.origin && (*/}
            {/*    <OriginImageViewer*/}
            {/*        origin={openedImageModalView.origin}*/}
            {/*        images={openedImageModalView.images}*/}
            {/*        title={openedImageModalView.title}*/}
            {/*        onClose={() => setOpenedImageModalView(null)}*/}
            {/*        onUploaded={handleImagesUpdated}*/}
            {/*    />*/}
            {/*)}*/}
        </>
    );
}

export default UpdateHubApproveOrigins;