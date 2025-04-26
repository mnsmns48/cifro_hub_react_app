import {createRoot} from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import CifrotechMainApp from "./src/CifrotechMainApp.jsx";
import CheckAccess from "./src/CheckAccess.jsx";


const root = createRoot(document.getElementById('root'));

root.render(
    <Router>
        <Routes>
            <Route path="/*" element={<CifrotechMainApp/>}/>
            <Route path="/service" element={<CheckAccess/>}/>
        </Routes>
    </Router>
);