import {CapsuleTabs} from 'antd-mobile'


function ContentArea({theme, menuActiveTab}) {


    return (
        <>
            <CapsuleTabs defaultActiveKey='1'>
                <CapsuleTabs.Tab
                    key='1'
                    title={
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src='https://www.cimbali.com/sites/default/files/styles/image_for_link_ricette/public/espresso_italiano-box.jpg'
                                alt='Espresso'
                                style={{ width: 40, height: 40, borderRadius: 8 }}
                            />
                            <div style={{ fontSize: 12, marginTop: 4 }}>Espresso</div>
                        </div>
                    }
                >
                    Espresso
                </CapsuleTabs.Tab>

                <CapsuleTabs.Tab
                    key='2'
                    title={
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src='https://www.nestleprofessional.ru/sites/default/files/styles/450px_width/public/2025-04/LATTE%20MACCHIATO_1.jpg'
                                alt='Latte'
                                style={{ width: 40, height: 40, borderRadius: 8 }}
                            />
                            <div style={{ fontSize: 12, marginTop: 4 }}>Latte</div>
                        </div>
                    }
                >
                    Latte
                </CapsuleTabs.Tab>

                <CapsuleTabs.Tab
                    key='3'
                    title={
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src='https://i.pinimg.com/474x/cf/92/59/cf92597c53a2394b9fdd32d7a34f7aca.jpg'
                                alt='Cappuccino'
                                style={{ width: 40, height: 40, borderRadius: 8 }}
                            />
                            <div style={{ fontSize: 12, marginTop: 4 }}>Cappuccino</div>
                        </div>
                    }
                >
                    Cappuccino
                </CapsuleTabs.Tab>

                <CapsuleTabs.Tab
                    key='4'
                    title={
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src='https://patisson.shop/wp-content/uploads/2019/09/%D0%A7%D0%B0%D0%B9_%D0%B2_%D0%B0%D1%81%D1%81%D0%BE%D1%80%D1%82%D0%B8%D0%BC%D0%B5%D0%BD%D1%82%D0%B5.jpeg'
                                alt='Tea'
                                style={{ width: 40, height: 40, borderRadius: 8 }}
                            />
                            <div style={{ fontSize: 12, marginTop: 4 }}>Чай</div>
                        </div>
                    }
                >
                    Чай
                </CapsuleTabs.Tab>
            </CapsuleTabs>
        </>
    )
}

export default ContentArea;