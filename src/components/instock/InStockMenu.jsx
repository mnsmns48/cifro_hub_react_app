import { useNavigate } from 'react-router-dom';
import {Menu} from 'antd';
import {useEffect, useState} from "react";
import {LaptopOutlined, NotificationOutlined, UserOutlined} from "@ant-design/icons";
import axios from "axios";
import './InStock.css'

export default function InStockMenu({onClick, endpoint = 'instock'}) {
    const navigate = useNavigate();
    const [rootMenuItems, setRootMenuItems] = useState([]);
    const fetchRootMenu = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api2/`);
            if (response.data && response.data.root_menu) {
                const parsedMenuItems = JSON.parse(response.data.root_menu);
                setRootMenuItems(parsedMenuItems);
                const priorityOrder = ["Смартфоны", "Планшеты", "Кнопочные телефоны"];
                const sortedItems = [...parsedMenuItems].sort((a, b) => {
                    const aIndex = priorityOrder.indexOf(a.label);
                    const bIndex = priorityOrder.indexOf(b.label);
                    if (aIndex !== -1 && bIndex !== -1) {
                        return aIndex - bIndex;
                    }
                    if (aIndex !== -1) return -1;
                    if (bIndex !== -1) return 1;
                    return a.label.localeCompare(b.label);
                });
                setRootMenuItems(sortedItems);
            }
        } catch (error) {
            console.error("Error root menu:", error);
        }
    };
    const handleMenuClick = (e) => {
        onClick(e.key);
        navigate(`/${endpoint}/${e.key}`);
    }
    
    const openMenu = (e) => {
        if (Array.isArray(e) && e.length > 0) {
            const lastElement = e[e.length - 1];
            onClick(lastElement);
            navigate(`/${endpoint}/${lastElement}`);
        }

    }

    useEffect(() => {
        fetchRootMenu();
    }, [])


    return (
        <Menu
            mode="inline"
            items={rootMenuItems}
            onClick={handleMenuClick}
            onOpenChange={openMenu}
            className="side-menu"
        />
    )
}