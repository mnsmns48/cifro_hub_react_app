import {Layout} from "antd";
import axios from "axios";
import {useEffect, useState} from "react";
import ProductList from "./ProductList.jsx";
import './AppContent.css'
import {useParams} from "react-router-dom";

const {Content} = Layout;
export default function AppContent({contentDataId, endpoint, collapsed}) {
    const [contentData, setContentData] = useState({});
    const params = useParams();
    const categoryId = params.id || contentDataId;
    const fetchContentData = async () => {
        const apiEndpoint = categoryId
            ? `/api2/${categoryId}` //${import.meta.env.VITE_BACKEND}
            : `/api2/root`; //${import.meta.env.VITE_BACKEND}

        axios.get(apiEndpoint)
            .then((response) => {
                let data = response.data;
                if (Array.isArray(data)) {
                    setContentData(data);
                    return;
                }
                data = data?.items || {};
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

    const productProps = {
        content: contentData,
        endpoint,
        collapsed
    };

    useEffect(() => {
        fetchContentData();
    }, [categoryId]);

    return (
        <Content>
            <ProductList {...productProps} />
        </Content>
    );
}
