import {Menu} from 'antd';
import {useEffect, useState} from "react";
import {LaptopOutlined, NotificationOutlined, UserOutlined} from "@ant-design/icons";
import axios from "axios";


export default function InStockMenu({ onClick }) {
    const [rootMenuItems, setRootMenuItems] = useState([]);
    const fetchRootMenu = () => {
        axios.get(`${import.meta.env.VITE_BACKEND}/api2/`).then((response) => {
            setRootMenuItems(JSON.parse(response.data.root_menu));
        })
    }
    const handleMenuClick = (e) => {onClick(e.key)}

    useEffect(() => {
        fetchRootMenu();
    }, [])


    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{
                height: '100%',
                width: '290px'
            }}
            items={rootMenuItems}
            onSelect={handleMenuClick}
        />
    )
}