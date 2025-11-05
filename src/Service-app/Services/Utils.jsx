import {ToolOutlined} from "@ant-design/icons";
import {Col, Row} from "antd";
import IconSettings from "./Utils/IconSettings.jsx";

const Utils = () => {



    return (
        <Row>
            <Col span={11}>
                <IconSettings title='Цифрохаб' />
            </Col>

            <Col span={1}>

            </Col>

            <Col span={11}>
                {/*<IconSettings title='Цифротех' />*/}
            </Col>
        </Row>

    );
};

Utils.componentTitle = "Обслуживание"
Utils.componentIcon = <div className="circle-container"><ToolOutlined className="icon-style"/></div>
export default Utils;