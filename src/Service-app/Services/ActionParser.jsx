import '../Service-utils/ActionParser.css'
import {Button, Checkbox, Form, Input} from 'antd';

const onFinish = values => {
    console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
};


const ActionParser = () => {
    return (
        <div className='action_parser_main'>
            <h2>Получить актуальные цены</h2>
            <Form name="basic" labelCol={{span: 8}} wrapperCol={{span: 16}} style={{maxWidth: 600}}
                  initialValues={{remember: true}} onFinish={onFinish} onFinishFailed={onFinishFailed}
                  autoComplete="off">
                <Form.Item label="Source" name="vendor_source" rules={[{required: true, message: 'Выбор обязателен'}]}>
                    <Input/>
                </Form.Item>

                <Form.Item label="Link" name="link">
                    <Input/>
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" label={null}>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" onClick={() => alert('Парсинг!')}> Parsing </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default ActionParser;