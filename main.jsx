import {createRoot} from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import CifrotechMainApp from "./src/CifrotechMainApp.jsx";
import ServiceApp from "./src/Cifrotech-app/ServiceApp.jsx";


const root = createRoot(document.getElementById('root'));

root.render(
    <Router>
        <Routes>
            <Route path="/*" element={<CifrotechMainApp/>}/>
            <Route path="/service" element={<ServiceApp/>}/>
        </Routes>
    </Router>
);