import {Select} from "antd";



//Реализация для выбора:

// const VendorSourceSelector = ({list, onChange}) => {
//     return (
//         <Select defaultValue={list.length > 0 ? list[0].value : undefined}
//                 defaultOpen={true} options={list}
//                 showSearch style={{width: '100%'}}
//                 placeholder="Кого парсим?"
//                 onChange={onChange}/>
//     );
// };
//
// export default VendorSourceSelector;





import { useState, useEffect } from 'react';


const VendorSourceSelector = ({ list, onChange }) => {
    const [value, setValue] = useState(
        list.length > 0 ? list[0].value : undefined
    );

    useEffect(() => {
        if (list.length > 0) {
            setValue(list[0].value);
            onChange(list[0].value);
        }
    }, [list, onChange]);

    const handleChange = (val) => {
        setValue(val);
        onChange(val);
    };

    return (
        <Select
            value={value}
            options={list}
            showSearch
            style={{ width: '100%' }}
            placeholder="Кого парсим?"
            onChange={handleChange}
        />
    );
};

export default VendorSourceSelector;
