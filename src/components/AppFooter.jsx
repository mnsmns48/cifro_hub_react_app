import {Layout} from "antd";
import './AppFooter.css'

const {Footer} = Layout;

export default function AppFooter() {
    return (
        <Footer className="footer">
            <a href="/address" className="footer-link">
                п. Ленино, Проспект Ленина 9 ©{new Date().getFullYear()} Цифро Хаб
            </a>
        </Footer>
    )
}