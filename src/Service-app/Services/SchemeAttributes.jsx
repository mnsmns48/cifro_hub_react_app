import {AppstoreAddOutlined} from "@ant-design/icons";
import TabAttributes from "./SchemeAttributes/TabAttributes.jsx";



const SchemeAttributes = () => {


    return (
        <>
            <TabAttributes />
        </>
    );
};

SchemeAttributes.componentTitle = "Атрибуты"
SchemeAttributes.componentIcon = <div className="circle-container"><AppstoreAddOutlined className="icon-style"/></div>
export default SchemeAttributes;