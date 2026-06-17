import {useState} from "react";
import CategoriesTree from "./CategoriesTree.jsx";

const CatalogContent = ({vendorId, vendorFunction, contractorId, deliveryLocationId}) => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <>
            <CategoriesTree
                vendorId={vendorId}
                vendorFunction={vendorFunction}
                onSelectCategory={setSelectedCategory}
            />
        </>
    )
}
export default CatalogContent;