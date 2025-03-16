import {Menu} from 'antd';
import React, {useEffect, useState} from "react";
import {LaptopOutlined, NotificationOutlined, UserOutlined} from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

export default function HubMenu({onClick, endpoint = 'hub'}) {
    const navigate = useNavigate();
    const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
        const key = String(index + 1);
        return {
            key: `Key ХАБ menu ${key}`,
            icon: React.createElement(icon),
            label: `Label ХАБ menu ${key}`,
            children: new Array(4).fill(null).map((_, j) => {
                const subKey = index * 4 + j + 1;
                return {
                    key: subKey,
                    label: `Label Children ХАБ menu${subKey}`,
                };
            }),
        };
    });

    const handleMenuClick = (e) => {
        onClick?.(e.key);
        navigate(`/${endpoint}/${e.key}`);
    };

    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{
                height: '100%'
            }}
            items={items2}
            onSelect={handleMenuClick}
        />
    )
}