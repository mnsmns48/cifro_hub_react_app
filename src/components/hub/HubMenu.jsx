import {Menu} from 'antd';
import React, {useEffect, useState} from "react";
import {LaptopOutlined, NotificationOutlined, UserOutlined} from "@ant-design/icons";
import axios from "axios";


export default function HubMenu() {
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