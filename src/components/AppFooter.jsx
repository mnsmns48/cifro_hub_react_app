import {Layout} from "antd";
import './AppFooter.css'

const {Footer} = Layout;

export default function AppFooter() {
    return (
        <Footer className='footer'>
            п. Ленино, Проспект Ленина 9 ©{new Date().getFullYear()} Цифро Хаб
        </Footer>
    )
}