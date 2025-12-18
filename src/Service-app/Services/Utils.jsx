import {PictureOutlined} from "@ant-design/icons";
import {Col, Row} from "antd";
import IconSettings from "./Utils/IconSettings.jsx";
import {ServiceImageBlock} from "./Utils/ServiceImageBlock.jsx";


const Utils = () => {


    return (
        <>
            <div style={{paddingBottom: 20}}>
                <ServiceImageBlock/>
            </div>
            <Row>
                <Col span={11}>
                    <IconSettings table='hub'/>
                </Col>

                <Col span={1}>

                </Col>

                <Col span={11}>
                    <IconSettings table='home'/>
                </Col>
            </Row>
        </>
    );
};

Utils.componentTitle = "Изображения"
Utils.componentIcon = <div className="circle-container"><PictureOutlined className="icon-style"/></div>
export default Utils;