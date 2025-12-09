import nanoreviewAdapter from "./SourceAdapter/nanoreviewAdapter.js";
import {buildDeviceFeatures} from "./FeatureBuilder.jsx";
import gsmarenaAdapter from "./SourceAdapter/gsmarenaAdepter.js";


export function getDeviceFeaturesUI(featuresArray, type_, source) {
    let normalizedData;

    switch (source) {
        case "nanoreview":
            normalizedData = nanoreviewAdapter(featuresArray);
            break;
        case "gsmarena":
            normalizedData = gsmarenaAdapter(featuresArray);
            break;
        default:
            normalizedData = {};
    }

    return buildDeviceFeatures(normalizedData, type_);
}