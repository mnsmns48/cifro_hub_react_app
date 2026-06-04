import {Button} from "antd";
import {CloseOutlined, EditOutlined, SaveOutlined} from "@ant-design/icons";

export const getActionsColumn = (options = {}) => {
    const {
        onEdit = () => {
        },
        onSave = () => {
        },
        onCancel = () => {
        }
    } = options;

    return {
        key: "actions",
        width: 110,
        render: (_, record) => (
            <div >
                <Button size="small" type="text" onClick={() => onEdit(record)}>
                    <EditOutlined />
                </Button>
                <Button size="small" type="text" onClick={() => onSave(record)}>
                    <SaveOutlined />
                </Button>
                <Button size="small" type="text" danger onClick={() => onCancel(record)}>
                    <CloseOutlined />
                </Button>
            </div>
        )
    };
};