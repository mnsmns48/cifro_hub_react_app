import {Menu} from 'antd';
import React from "react";
import {LaptopOutlined, NotificationOutlined, UserOutlined} from "@ant-design/icons";


export default function InStockMenu() {
    const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
        const key = String(index + 1);
        return {
            key: `Key In Stock menu ${key}`,
            icon: React.createElement(icon),
            label: `Label In Stock menu ${key}`,
            children: new Array(4).fill(null).map((_, j) => {
                const subKey = index * 4 + j + 1;
                return {
                    key: subKey,
                    label: `Label Children In Stock menu${subKey}`,
                };
            }),
        };
    });

    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{
                height: '100%'
            }}
            items={items2}
        />
    )
}