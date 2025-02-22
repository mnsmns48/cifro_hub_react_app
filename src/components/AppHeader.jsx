import {Button, ConfigProvider, Layout, Space,} from "antd";
import logo from '/logo-cifro-hub.svg'
import {createStyles} from "antd-style";
import {AntDesignOutlined} from "@ant-design/icons";
import './AppHeader.css'

const {Header} = Layout;


export default function AppHeader({onMainSwitchBtnClick, toggleButtonText}) {
    return (
        <Header style={{
            backgroundColor: '#00111a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: '10px',
        }}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <img src={logo} alt="Logo" style={{maxHeight: '59px', paddingRight: '8px'}}/>
                <span className="logo">ЦИФРО ХАБ</span>
            </div>
            <MainSwitchBtn onClick={onMainSwitchBtnClick} toggleButtonText={toggleButtonText}/>
        </Header>
    );
}


function MainSwitchBtn({onClick, toggleButtonText}) {
    const useStyle = createStyles(({prefixCls, css}) => ({
        linearGradientButton: css`
            &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
                > span {
                    position: relative;
                }

                &::before {
                    content: '';
                    background: linear-gradient(135deg, #6253e1, #04befe);
                    position: absolute;
                    inset: -1px;
                    opacity: 1;
                    transition: all 0.3s;
                    border-radius: inherit;
                }

                &:hover::before {
                    opacity: 0;
                }
            }
        `,
    }));

    const {styles} = useStyle();
    return (
        <ConfigProvider
            button={{
                className: styles.linearGradientButton,
            }}
        >
            <Space>
                <Button type="primary" size="large" icon={<AntDesignOutlined/>} onClick={onClick}>
                    {toggleButtonText}
                </Button>
            </Space>
        </ConfigProvider>
    );
};