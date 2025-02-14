import {Layout} from "antd";
import SideMenu from "./SideMenu.jsx";


const {Sider} = Layout;

export default function AppSider() {
    return (
        <Sider style={{textAlign: 'center'}}>
            <SideMenu />
        </Sider>

    )
}