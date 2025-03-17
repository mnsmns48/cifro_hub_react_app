import {Layout} from "antd";
import axios from "axios";
import {useEffect, useState} from "react";
import ProductList from "./ProductList.jsx";
import './AppContent.css'
import {useParams} from "react-router-dom";

const {Content} = Layout;
export default function AppContent({contentDataId, endpoint}) {
    const [contentData, setContentData] = useState({});
    const params = useParams();
    const categoryId = params.id || contentDataId;

    const fetchContentData = () => {
        if (!categoryId) return;
        
        axios.get(`${import.meta.env.VITE_BACKEND}/api2/${categoryId}`)
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
    }, [categoryId]);

    return (
        <Content>
            <ProductList content={contentData} endpoint={endpoint}/>
        </Content>
    );
}
