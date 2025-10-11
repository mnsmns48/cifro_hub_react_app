import {createRoot} from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import CifrotechMainApp from "./src/CifrotechMainApp.jsx";
import CheckAccess from "./src/Auth/CheckAccess.jsx";
import MiniAppMainComponent from "./src/miniApp-V1/webapp.jsx";


const root = createRoot(document.getElementById('root'));

root.render(
    <Router>
        <Routes>
            <Route path="/webapp" element={<MiniAppMainComponent/>}/>
            <Route path={import.meta.env.VITE_SERVICE_POINT} element={<CheckAccess/>}/>
            <Route path="/*" element={<CifrotechMainApp/>}/>
        </Routes>
    </Router>
);

