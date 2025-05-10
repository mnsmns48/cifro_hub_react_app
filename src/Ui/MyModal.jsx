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
                     footer = undefined
                 }) => {
    return (
        <Modal open={isOpen}
               onOk={onConfirm}
               onCancel={onCancel}
               title={title}
               okButtonProps={{danger}}
               closable={closable}
               footer={<div className="button-footer">{footer}</div>}>
            <p className='modal'>{content}</p>
        </Modal>
    );
};

export default MyModal;