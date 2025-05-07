import React, {useState} from 'react';
import {Spin, Tabs} from 'antd';
import './ServiceApp.css'

const modules = import.meta.glob('./Service-app/Services/*.jsx');

const services = Object.keys(modules).map((path, index) => {
    const ComponentName = path.split('/').pop().replace('.jsx', '')
    const Component = React.lazy(modules[path]);
    return {
        label: ComponentName,
        key: String(index + 1),
        children: <React.Suspense fallback={<div><Spin/></div>}><Component/></React.Suspense>
    };
});


const ServiceApp = () => {
    const [tabPosition] = useState('left');
    return <Tabs tabPosition={tabPosition} items={services}/>
};
export default ServiceApp;