import {Row, Col, Collapse} from "antd";
import PathTable from "./PathTable.jsx";
import {tableConfig} from "./tableconf.js";
import {useState} from "react";

const IconSettings = () => {
    const [hubConfigIsOpen, setHubConfigIsOpen] = useState(false);
    const [homeConfigIsOpen, setHomeConfigIsOpen] = useState(false);

    const hubConfig = tableConfig["hub"];
    const homeConfig = tableConfig["home"];

    return (
        <Collapse >
            <Collapse.Panel header="Иконки пунктов меню" key="1" style={{fontFamily: 'TT Firs Neue'}}>
                <Row gutter={10} justify="center">
                    <Col span={12}>
                        <Collapse onChange={(keys) => setHubConfigIsOpen(keys.length > 0)}>
                            <Collapse.Panel header={hubConfig.title} key="hub">
                                <PathTable config={hubConfig} isOpen={hubConfigIsOpen}/>
                            </Collapse.Panel>
                        </Collapse>
                    </Col>

                    <Col span={11}>
                        <Collapse onChange={(keys) => setHomeConfigIsOpen(keys.length > 0)}>
                            <Collapse.Panel header={homeConfig.title} key="home">
                                <PathTable config={homeConfig} isOpen={homeConfigIsOpen}/>
                            </Collapse.Panel>
                        </Collapse>
                    </Col>

                </Row>

            </Collapse.Panel>
        </Collapse>
    );
};

export default IconSettings;
