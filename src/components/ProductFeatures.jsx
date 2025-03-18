import SmartPhone from "./products/smartPhone.jsx";


const ProductFeatures = ({info}) => {
    if (!info?.product_type) return null;

    const renderComponent = () => {
        switch (info.product_type) {
            case "phone":
                return <SmartPhone info={info}/>;
            default:
                return null;
        }
    };

    return (
        <div className="specificity-product">{renderComponent()}</div>
    );
};

export default ProductFeatures;