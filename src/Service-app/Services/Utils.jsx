import {PictureOutlined} from "@ant-design/icons";
import IconSettings from "./Utils/IconSettings.jsx";
import {ServiceImageBlock} from "./Utils/ServiceImageBlock.jsx";
import {useState} from "react";


const Utils = () => {
    const [serviceImageBlockIsOpen, setServiceImageBlockIsOpen] = useState(false);


    return (
        <>
            <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                <ServiceImageBlock isOpen={serviceImageBlockIsOpen} setIsOpen={setServiceImageBlockIsOpen}/>
                <IconSettings/>
            </div>
        </>
    );
};

Utils.componentTitle = "Изображения"
Utils.componentIcon = <div className="circle-container"><PictureOutlined className="icon-style"/></div>
export default Utils;