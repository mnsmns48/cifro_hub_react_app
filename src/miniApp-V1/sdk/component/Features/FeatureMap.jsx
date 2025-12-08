import SmartPhone from "./SmartPhone.jsx";


const FeatureMap = ({ type, info }) => {
    if (type === 'phone') {
        return <SmartPhone info={info} />
    }

    // if (type === 'watch') {
    //     return <SmartWatch info={info} />
    // }

    return null
}

export default FeatureMap;