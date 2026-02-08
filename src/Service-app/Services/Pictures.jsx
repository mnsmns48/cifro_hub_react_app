import IconSettings from "./Utils/IconSettings.jsx";
import {ServiceImageBlock} from "./Utils/ServiceImageBlock.jsx";
import {useState} from "react";


const Pictures = () => {
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


export default Pictures;