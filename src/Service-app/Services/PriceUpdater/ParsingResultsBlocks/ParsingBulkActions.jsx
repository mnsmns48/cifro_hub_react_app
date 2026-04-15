import {Button, Popconfirm} from "antd";
import {
    WarningOutlined,
    ShareAltOutlined,
    PlusSquareOutlined,
    ClearOutlined,
    RestOutlined
} from "@ant-design/icons";

const ParsingBulkActions = ({
                                selectedCount,
                                onDelete,
                                onAddDependence,
                                onAddToHub,
                                onClearMedia,
                                onRemoveFromHub
                            }) => {
    if (!selectedCount) return null;

    return (
        <div style={{display: "flex", gap: 10, marginBottom: 15}}>
            <Popconfirm
                title="Вы уверены, что хотите удалить выбранные позиции?"
                onConfirm={onDelete}
                okText="Да"
                cancelText="Нет"
                placement="left"
            >
                <Button
                    danger
                    className="fixed-hub-button fixed-hub-button-delete"
                >
                    Удалить навсегда ({selectedCount}){" "}
                    <WarningOutlined/>
                </Button>
            </Popconfirm>

            <Button
                onClick={onAddDependence}
                className="fixed-hub-button fixed-hub-button-dependency"
            >
                Зависимость ({selectedCount}) <ShareAltOutlined/>
            </Button>

            <Button
                onClick={onAddToHub}
                className="fixed-hub-button fixed-hub-button-add"
            >
                Добавить в Хаб ({selectedCount}) <PlusSquareOutlined/>
            </Button>

            <Popconfirm
                title="Очистить медиа у выбранных позиций?"
                description="Будут удалены картинки и превью."
                okText="Да, очистить"
                cancelText="Отмена"
                onConfirm={onClearMedia}
            >
                <Button
                    className="fixed-hub-button fixed-hub-button-clear-media"
                    icon={<ClearOutlined/>}
                >
                    Очистить медиа ({selectedCount})
                </Button>
            </Popconfirm>

            <Button
                onClick={onRemoveFromHub}
                className="fixed-hub-button fixed-hub-button-remove"
            >
                Убрать из хаба ({selectedCount}) <RestOutlined/>
            </Button>
        </div>
    );
};

export default ParsingBulkActions;
