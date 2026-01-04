import {AppstoreAddOutlined} from "@ant-design/icons";
import AttributesMain from "./SchemeAttributes/AttributesMain.jsx";


const SchemeAttributes = () => {

    return (
        <>
            <AttributesMain/>
        </>
    );
};

SchemeAttributes.componentTitle = "Атрибуты"
SchemeAttributes.componentIcon = <div className="circle-container"><AppstoreAddOutlined className="icon-style"/></div>
export default SchemeAttributes;