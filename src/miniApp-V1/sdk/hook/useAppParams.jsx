import {useContext} from "react";
import {AppParamsContext} from "../context.js";


export default function useAppParams() {
    return useContext(AppParamsContext);
}