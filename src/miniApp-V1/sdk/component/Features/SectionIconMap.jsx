import {
    FundProjectionScreenOutlined,
    CameraOutlined,
    UngroupOutlined,
    WifiOutlined,
    CalculatorOutlined,
    SaveOutlined,
    SoundOutlined,
    SyncOutlined, FunctionOutlined, ThunderboltOutlined, StarOutlined, HolderOutlined
} from '@ant-design/icons'

export const getSectionIcon = (sectionName) => {
    switch (sectionName) {
        case 'Экран':
        case 'Display':

            return <FundProjectionScreenOutlined/>

        case 'Основная камера':
        case 'Фронтальная камера':
        case 'Camera':
        case 'Main Camera':
        case 'Selfie camera':

            return <CameraOutlined/>

        case 'Дизайн и корпус':
        case 'Design and build':
        case 'Body':

            return <UngroupOutlined/>

        case 'Коммуникации':
        case 'Network':
        case 'Comms':

            return <WifiOutlined/>

        case 'Производительность':
        case 'Performance':
        case 'Platform':

            return <CalculatorOutlined/>

        case 'Звук':
        case 'Sound':
        case 'SOUND':

            return <SoundOutlined/>

        case 'Memory':
        case 'Память':

            return <SaveOutlined/>

        case 'Программное обеспечение':
            return <SyncOutlined/>

        case 'Features':
            return <FunctionOutlined/>

        case 'Battery':
        case 'Батарея':
            return <ThunderboltOutlined/>

        case 'Misc':
            return <StarOutlined/>

        default:
            return <HolderOutlined/>
    }
}


