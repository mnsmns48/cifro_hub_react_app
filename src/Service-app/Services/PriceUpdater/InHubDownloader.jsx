import { List, Button } from "antd";
import MyModal from "../../../Ui/MyModal.jsx";
import {formatDate} from "../../../../utils.js";

const InHubDownloader = ({
                             dtObj,
                             isOpen,
                             items,
                             onCancel,
                             onConfirm
                         }) => {
    return (
        <MyModal
            isOpen={isOpen}
            onCancel={onCancel}
            onConfirm={onConfirm}
            title="Добавить в Хаб"
            content={
                <List
                    size="small"
                    bordered
                    dataSource={items}
                    renderItem={item => (
                        <List.Item
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                fontSize: 12
                            }}
                        >
                            <strong>{item.origin}</strong>
                            <span>{item.title}</span>
                            <strong>{item.output_price}</strong>
                            <span>{formatDate(dtObj)}</span>
                        </List.Item>
                    )}
                />
            }
            footer={
                <>
                    <Button onClick={onCancel}>Отмена</Button>
                    <Button type="primary" onClick={onConfirm}>
                        Добавить
                    </Button>
                </>
            }
            danger={false}
            closable={true}
        />
    );
};

export default InHubDownloader;
