import {Layout} from "antd";
import axios from "axios";
import {useEffect, useState} from "react";
import ProductList from "./ProductList.jsx";
import './AppContent.css'

const {Content} = Layout;

export default function AppContent({contentDataId}) {
    const [contentData, setContentData] = useState({});
    const fetchContentData = () => {
        axios.get(`${import.meta.env.VITE_BACKEND}/api2/${contentDataId}`).then((response) => {
            setContentData(JSON.parse(response.data.items));
        })
    }
    useEffect(() => {
        fetchContentData()
    }, [contentDataId]);
    return (
        <Content>
            <ProductList content={contentData}/>
        </Content>
    )
}