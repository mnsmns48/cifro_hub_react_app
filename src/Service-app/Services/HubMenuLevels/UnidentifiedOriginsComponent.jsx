import {useEffect, useState} from "react";
import {Modal, Table} from "antd";
import {fetchPostData} from "../SchemeAttributes/api.js";
import {getUnidentifiedOriginsColumns} from "./unidentifiedOriginsColumns.jsx";


const UnidentifiedOriginsComponent = ({comparisonObj: {vsl_list, path_ids}, isOpen, onClose}) => {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);

    const handleOpenOrigin = (originId) => {
        console.log("Открыть origin:", originId);
    };

    useEffect(() => {
        if (!isOpen) return;

        const loadData = async () => {
            setLoading(true);

            const payload = {vsl_list, path_ids};

            const data = await fetchPostData(
                "/service/fetch_unidentified_origins",
                payload
            );

            if (data && Array.isArray(data.origins)) {
                const grouped = [];
                let counter = 0;

                const vslMap = Object.fromEntries(vsl_list.map(v => [v.id, v.title]));

                let currentVsl = null;

                for (const item of data.origins) {
                    if (item.vsl_id !== currentVsl) {
                        currentVsl = item.vsl_id;

                        grouped.push({
                            key: `vsl-${currentVsl}`,
                            isGroup: true,
                            vsl_id: currentVsl,
                            vsl_title: vslMap[currentVsl] ?? `VSL ${currentVsl}`
                        });
                    }

                    grouped.push({
                        key: counter++,
                        ...item
                    });
                }

                setRows(grouped);
            }


            setLoading(false);
        };

        void loadData();
    }, [isOpen, vsl_list, path_ids]);

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            width={1280}
            footer={null}
        >
            <Table
                columns={
                    getUnidentifiedOriginsColumns({onOpenOrigin: handleOpenOrigin})}
                dataSource={rows}
                loading={loading}
                pagination={false}
                bordered
            />
        </Modal>
    );
};

export default UnidentifiedOriginsComponent;
