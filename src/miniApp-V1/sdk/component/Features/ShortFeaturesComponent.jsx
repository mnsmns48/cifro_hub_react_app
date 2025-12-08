import {shortSmartPhoneSpecification} from "./FeatureMap.jsx";

const specMap = {
    phone: shortSmartPhoneSpecification,
    tablet: shortSmartPhoneSpecification,
    watch: shortSmartPhoneSpecification
}

export default function ShortFeaturesComponent({type_, info}) {

    const features_array = Array.isArray(info.info) ? info.info : [];

    const getSpecs = specMap[type_];
    if (!getSpecs)
        return null;

    const blocks = getSpecs(features_array, info.source, type_);
    if (!blocks.length)
        return null;


    return (
        <div style={{padding: "8px"}}>
            <ul style={{listStyle: "none", padding: 0, margin: 0, color: "#3a3a3a"}}>
                {blocks.map(({icon, title, specs}) => (
                    <li key={title} style={{margin: "10px"}}>
                        <strong><span style={{
                            color: '#e2fc2a',
                            background: '#3a3a3a',
                            padding: '6px',
                            borderRadius: '12px',
                        }}>{icon}</span> {title}</strong>{" "}
                        <div style={{display: "inline", lineHeight: 1.9}}>
                            {specs
                                .map((s) => (s?.value ? `${s.value}${s.label || ""}` : null))
                                .filter(Boolean)
                                .join(" ")}
                        </div>

                    </li>
                ))}
            </ul>
        </div>
    );
}
