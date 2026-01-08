import {useEffect, useState} from "react";
import {fetchPostData} from "../SchemeAttributes/api.js";
import {Modal, Radio} from "antd";

const AttributesModal = ({open, data, onClose}) => {
    const [loading, setLoading] = useState(false);
    const [allowable, setAllowable] = useState([]);
    const [exists, setExists] = useState([]);

    const loadData = async () => {
        if (!data) return;

        setLoading(true);

        const result = await fetchPostData(
            "service/attributes/attributes_origin_value_check_request",
            {
                origin: data.origin,
                model_id: data.model_id,
                title: data.title
            }
        );

        if (result) {
            setAllowable(result.attributes_allowable ?? []);
            setExists(result.attributes_exists ?? []);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (open) void loadData();
    }, [open]);

    useEffect(() => {
        if (!open || allowable.length === 0) return;

        setExists(prev => {
            const updated = [...prev];

            allowable.forEach(attr => {
                if (attr.attr_value_ids.length === 1) {
                    const singleValue = attr.attr_value_ids[0];

                    const existsForKey = updated.find(e => e.key_id === attr.key_id);

                    if (!existsForKey) {
                        updated.push({
                            key_id: attr.key_id,
                            key: attr.key,
                            attr_value_ids: [singleValue]
                        });
                    }
                }
            });

            return updated;
        });
    }, [allowable, open]);


    return (
        <Modal open={open} onCancel={onClose} width={700} footer={null}>
            {loading && <div>Загрузка...</div>}
            <div style={{paddingBottom: "10px"}}>
                {data?.title ?? ""}
            </div>
            {!loading && allowable.length > 0 && (
                <div>
                    {allowable.map(attr => {
                        const existing = exists.find(e => e.key_id === attr.key_id);

                        return (
                            <div key={attr.key_id} style={{marginBottom: 10, textAlign: "center"}}>
                                <div style={{marginBottom: 6, fontWeight: 600, fontSize: 16}}>
                                    {attr.key}
                                </div>

                                <Radio.Group value={existing?.attr_value_ids?.[0]?.id ?? null}
                                             onChange={(e) => {
                                                 const selectedId = e.target.value;
                                                 const selectedValue = attr.attr_value_ids.find(v => v.id === selectedId);

                                                 setExists(prev =>
                                                     prev.map(ex =>
                                                         ex.key_id === attr.key_id
                                                             ? {...ex, attr_value_ids: [selectedValue]}
                                                             : ex
                                                     )
                                                 );
                                             }}
                                >
                                    <div style={{display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap"}}>
                                        {attr.attr_value_ids.map(v => (
                                            <Radio.Button size={'small'} key={v.id} value={v.id}
                                                          style={{
                                                              borderRadius: 6,
                                                              cursor: "default",
                                                              textAlign: "center"
                                                          }}>
                                                <div style={{display: "flex", flexDirection: "column", lineHeight: 1}}>
                                                    <span style={{fontSize: 16, fontWeight: 600}}>
                                                        {v.value}
                                                    </span>
                                                    <span style={{fontSize: 13, color: "#a8a8a8"}}>
                                                        {v.alias}
                                                    </span>
                                                </div>
                                            </Radio.Button>
                                        ))}
                                    </div>
                                </Radio.Group>
                            </div>
                        );
                    })}
                </div>
            )}
        </Modal>
    );
};

export default AttributesModal;
