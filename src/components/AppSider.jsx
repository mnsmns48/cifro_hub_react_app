import {Layout} from "antd";
import HubMenu from "./hub/HubMenu.jsx";
import InStockMenu from "./instock/InStock.jsx";
import {useState} from "react";


const {Sider} = Layout;

export default function AppSider({ showInStockMenu }) {
    return (
        <Sider style={{ textAlign: 'center' }}>
            {showInStockMenu ? <InStockMenu /> : <HubMenu />}
        </Sider>
    );
}