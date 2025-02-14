import {Layout} from "antd";


const {Content} = Layout;

export default function AppContent() {
    return (
        <Content
            style={{
                padding: '0 30px',
                minHeight: 320,
            }}
        >
            Здесь будет контент
        </Content>
    )
}