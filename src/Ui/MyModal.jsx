import {Modal} from 'antd';
import './Ui.css'

const MyModal = ({
                     isOpen,
                     onConfirm,
                     onCancel,
                     title,
                     content,
                     danger = false,
                     closable = false,
                     footer = undefined,
                     width = 600
                 }) => {
    return (
        <Modal open={isOpen}
               onOk={onConfirm}
               onCancel={onCancel}
               width={width}
               title={title}
               okButtonProps={{danger}}
               closable={closable}
               footer={<div className="button-footer">{footer}</div>}>
            <div className='modal'>{content}</div>
        </Modal>
    );
};

export default MyModal;