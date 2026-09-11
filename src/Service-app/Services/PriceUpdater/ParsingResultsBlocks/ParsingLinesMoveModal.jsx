import {useEffect, useState} from "react";
import {Modal, Input, Table, Button, notification} from "antd";
import {fetchGetData, fetchPostData} from "../../Common/api";

const ParsingLinesMoveModal = ({isOpen, onClose, data, vendorID, currentVslID}) => {
    const [vslList, setVslList] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        if (!isOpen) return;

        (async () => {
            const resp = await fetchGetData(`/service/get_vsl/${vendorID}`);
            const list = Array.isArray(resp?.vsl) ? resp.vsl : [];
            setVslList(list);
        })();


        setSelectedRowKeys([]);
    }, [isOpen, vendorID]);

    const filtered = search.trim()
        ? vslList.filter(v =>
            v.title.toLowerCase().includes(search.toLowerCase())
        )
        : vslList;

    const handleMove = async () => {
        if (!selectedRowKeys.length) return;

        const targetVslId = selectedRowKeys[0];

        if (targetVslId === currentVslID) {
            notification.warning({
                message: "Перемещение невозможно",
                description: "Вы выбрали тот же ParsingLine. Перемещение не требуется."
            });
            return;
        }

        const resp = await fetchPostData("/service/move_to_other_parsing_line", {
            origins: data.origins,
            vsl_id: targetVslId
        });

        if (resp?.status === "error") {
            notification.error({
                message: "Ошибка перемещения",
                description: resp.message ?? "Неизвестная ошибка"
            });
            return;
        }

        notification.success({
            message: "Успешно",
            description: `Перемещено строк: ${resp?.moved ?? 0}`
        });

        if (data.refreshParsingResult) {
            await data.refreshParsingResult();
        }

        onClose();
    };


    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            title={
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Button type="primary" disabled={!selectedRowKeys.length} onClick={handleMove}>
                        Переместить
                    </Button>
                </div>
            }
            footer={null}
            width={600}
        >

            <Input
                placeholder="Поиск по названию..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
                style={{marginBottom: 12}}
            />

            <Table dataSource={filtered}
                   rowKey="id"
                   size="small"
                   pagination={false}
                   rowSelection={{
                       type: "radio",
                       selectedRowKeys,
                       onChange: (keys) => setSelectedRowKeys(keys)
                   }}
                   columns={[{title: "Название", dataIndex: "title", width: 250, ellipsis: true}]}
            />

        </Modal>
    );
};

export default ParsingLinesMoveModal;
