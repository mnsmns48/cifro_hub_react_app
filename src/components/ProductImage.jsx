import {Image} from "antd";


export default function ProductImage({id, title}) {
    return (
    <>
        <Image
            src={`/api2/images/${id}.jpg`} //${import.meta.env.VITE_BACKEND}
            alt={title}
            className="product-image"
            onError={(e) => {
                e.target.src = "/api2/images/10000.jpg";
                e.target.alt = "not_image";
            }}
        />
    </>)
}