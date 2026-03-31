import {useMemo} from "react";
import {Button, Modal, Tabs} from "antd";

const StebystepComponent = ({comparisonObj: {vsl_list, path_ids}, isOpen, onClose}) => {

    const payload = useMemo(() => ({vsl_list, path_ids}), [vsl_list, path_ids]);

    const items = vsl_list.map(vsl => ({
        key: vsl.id.toString(),
        label: vsl.title,
        children: (
            <div>
                <pre style={{
                    padding: 16,
                    borderRadius: 8,
                    maxHeight: 500,
                    overflow: "auto"
                }}>
                    {JSON.stringify(vsl, null, 4)}
                </pre>
            </div>
        )
    }));

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            width={1280}
            footer={<Button type="primary">Создать</Button>}
        >
            <Tabs
                tabPlacement="left"
                items={items}
            />
        </Modal>
    );
};

export default StebystepComponent;
