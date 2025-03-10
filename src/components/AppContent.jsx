import {Layout} from "antd";
import axios from "axios";
import {useEffect, useState} from "react";
import ProductList from "./ProductList.jsx";
import './AppContent.css'

const {Content} = Layout;
export default function AppContent({contentDataId}) {
    const [contentData, setContentData] = useState({});

    const fetchContentData = () => {
        axios.get(`/api2/${contentDataId}`) //${import.meta.env.VITE_BACKEND}
            .then((response) => {
                const data = response.data?.items || {};
                if (data && typeof data === 'string') {
                    try {
                        setContentData(JSON.parse(data));
                    } catch (e) {
                        console.error("Failed to parse JSON:", e);
                        setContentData({});
                    }
                } else if (typeof data === 'object') {
                    setContentData(data);
                } else {
                    console.error("Unexpected data type:", typeof data);
                    setContentData({});
                }
            })
            .catch((error) => {
                console.error("Error fetching content data:", error);
                setContentData({});
            });

    };

    useEffect(() => {
        fetchContentData();
    }, [contentDataId]);

    return (
        <Content>
            <ProductList content={contentData}/>
        </Content>
    );
}
