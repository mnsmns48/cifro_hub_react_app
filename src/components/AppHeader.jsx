import {Button, ConfigProvider, Layout, Space,} from "antd";
import logo from '/logo-cifro-hub.svg'
import {createStyles} from "antd-style";
import {AntDesignOutlined} from "@ant-design/icons";

const {Header} = Layout;


export default function AppHeader({onInStockButtonClick}) {
    return (
        <Header style={{
            backgroundColor: '#00111a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: '10px',
            height: '85px',
            borderRadius: '25px',
        }}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <img src={logo} alt="Logo" style={{maxHeight: '59px', paddingRight: '8px'}}/>
                <span style={{color: 'white', fontFamily: "Urfa", fontSize: 'clamp(10px, 3vw, 30px)'}}>ЦИФРО ХАБ</span>
            </div>
             {/*<InStockButton onClick={onInStockButtonClick}/>*/}
        </Header>
    );
}


function InStockButton({onClick}) {
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
                <Button type="primary" size="medium" icon={<AntDesignOutlined/>} onClick={onClick}>
                    КАТАЛОГ НАЛИЧИЯ
                </Button>
            </Space>
        </ConfigProvider>
    );
}