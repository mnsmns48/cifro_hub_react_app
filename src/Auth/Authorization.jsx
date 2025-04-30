import './Auth.css';
import {Modal, Button} from "antd";
import axios from "axios";
import {useState} from "react";


export default function Authorization() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        try {
            const params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);
            const response = await axios.post('/login', params, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            });
            if (response.status === 200 || response.status === 204) {
                window.location.reload();
            }
        } catch {
            setModalContent("Неверный логин или пароль");
            setIsModalVisible(true);
            event.target.reset();
        }
    }

    const handleOk = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="wrapper">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Логин</label>
                    <input type="text" id="username" name="username"/><br/>
                    <label htmlFor="password">Пароль</label>
                    <input type="password" id="password" name="password"/><br/>
                    <input type="submit" value="Войти" className="button"/>
                </form>
            </div>
            <Modal title="Ошибка" open={isModalVisible}
                   footer={[<Button key="ok" type="primary" onClick={handleOk}>Закрыть</Button>]}>
                <p>{modalContent}</p>
            </Modal>
        </div>
    );
}
