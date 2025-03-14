import {Menu} from 'antd';
import {useEffect, useState} from "react";
import {LaptopOutlined, NotificationOutlined, UserOutlined} from "@ant-design/icons";
import axios from "axios";
import './InStock.css'

export default function InStockMenu({onClick}) {
    const [rootMenuItems, setRootMenuItems] = useState([]);
    const fetchRootMenu = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api2/`);
            if (response.data && response.data.root_menu) {
                const parsedMenuItems = JSON.parse(response.data.root_menu);
                setRootMenuItems(parsedMenuItems);
            }
        } catch (error) {
            console.error("Error root menu:", error);
        }
    };

    const handleMenuClick = (e) => {
        onClick(e.key)
    }

    useEffect(() => {
        fetchRootMenu();
    }, [])


    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            items={rootMenuItems}
            onSelect={handleMenuClick}
            className="side-menu"

        />
    )
}