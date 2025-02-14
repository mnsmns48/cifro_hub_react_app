import {Layout} from "antd";


const {Footer} = Layout;

export default function AppFooter() {
    return (
        <Footer style={{textAlign: 'center'}}>
            п. Ленино, Проспект Ленина 9 ©{new Date().getFullYear()} Цифро Хаб
        </Footer>
    )
}