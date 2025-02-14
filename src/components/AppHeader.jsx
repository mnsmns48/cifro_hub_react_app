import {Layout, } from "antd";
import logo from '/logo-cifro-hub.svg'
import InStockButton from "./InStockButton.jsx";

const {Header} = Layout;


export default function AppHeader() {
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
                <span style={{color: 'white', fontFamily: "Urfa", fontSize: 'clamp(10px, 3vw, 30px)'}}>ЦИФРО ХАБ</span>
            </div>
            <InStockButton/>
        </Header>
    );
}
