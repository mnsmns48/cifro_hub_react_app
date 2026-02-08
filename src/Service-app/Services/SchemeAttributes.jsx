import {AppstoreAddOutlined} from "@ant-design/icons";
import AttributesMain from "./SchemeAttributes/AttributesMain.jsx";


const SchemeAttributes = () => {

    return (
        <>
            <AttributesMain/>
        </>
    );
};


export const meta = {
    title: "Атрибуты",
    icon: (
        <div className="circle-container">
            <AppstoreAddOutlined className="icon-style"/>
        </div>
    ),
};

export default SchemeAttributes;