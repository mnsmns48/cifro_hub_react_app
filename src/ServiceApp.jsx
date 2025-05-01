import React, {useState} from 'react';
import {Tabs} from 'antd';
import './ServiceApp.css'

const modules = import.meta.glob('./Services/*.jsx');

const services = Object.keys(modules).map((path, index) => {
    const ComponentName = path.split('/').pop().replace('.jsx', '')
    const Component = React.lazy(modules[path]);
    return {
        label: ComponentName,
        key: String(index + 1),
        children: <React.Suspense fallback={<div>Loading...</div>}><Component/></React.Suspense>
    };
});


const ServiceApp = () => {
    const [tabPosition] = useState('left');
    return <Tabs tabPosition={tabPosition} items={services} centered={true}/>
};
export default ServiceApp;