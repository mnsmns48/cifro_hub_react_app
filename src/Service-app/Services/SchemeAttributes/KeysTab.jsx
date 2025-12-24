import {useEffect, useState} from "react";
import {fetchGetData} from "./api.js";

const KeysTab = () => {

    const [keys, setKeys] = useState([]);
    useEffect(() => {
        fetchGetData("/service/get_attr_keys").then((data) => {
            setKeys(data);
        });
    }, []);
    return (<div><h3>Список ключей атрибутов</h3>
        <ul> {keys.map((key) => (<li key={key}>{key}</li>))} </ul>
    </div>);
}

export default KeysTab;