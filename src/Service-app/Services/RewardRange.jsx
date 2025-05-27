import {Button} from 'antd'
import {PlusOutlined} from "@ant-design/icons";

const RewardRange = () => {


    return (
        <div className='action_parser_main'>
            <h1>Reward Range</h1>
            <Button type="primary" icon={<PlusOutlined />} style={{ marginTop: 10 }}>
                Создать
            </Button>
        </div>
    )
}
export default RewardRange;