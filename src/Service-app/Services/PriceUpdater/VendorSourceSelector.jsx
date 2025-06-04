import {Select} from "antd";


const VendorSourceSelector = ({list, onChange}) => {
    return (
        <Select defaultValue={list.length > 0 ? list[0].value : undefined}
                defaultOpen={true} options={list}
                showSearch style={{width: '100%'}}
                placeholder="Кого парсим?"
                optionFilterProp="label"
                onChange={onChange}/>
    );
};

export default VendorSourceSelector;