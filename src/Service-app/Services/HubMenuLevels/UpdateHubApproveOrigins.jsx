import {Button, Modal} from "antd";

const UpdateHubApproveOrigins = ({ selectedByTab, onCloseParent, onCloseApproveOrigins }) => (
    <Modal
        open={true}
        closable={false}
        footer={null}
        width={1280}
    >
        <Button onClick={onCloseApproveOrigins}>Отмена</Button>
        {/*<Button onClick={onCloseParent}>*/}
        {/*    Закрыть родителя*/}
        {/*</Button>*/}

        <pre>{JSON.stringify(selectedByTab, null, 2)}</pre>

    </Modal>
);



export default UpdateHubApproveOrigins;

