import './ProductFeatures.css';
import SmartPhone from "./products/smartPhone.jsx";


const ProductFeatures = ({info}) => {
    if (!info.product_type) {
        return <div>Описание будет добавлено позже</div>; // Если product_type отсутствует
    }
    const renderComponent = () => {
        switch (info.product_type) {
            case "phone":
                return <SmartPhone info={info}/>;
            default:
                return <div>Описание будет добавлено позже</div>;
        }
    };
    return (
        <div className="specificity-product">
            {renderComponent()}
        </div>
    )
}

export default ProductFeatures;