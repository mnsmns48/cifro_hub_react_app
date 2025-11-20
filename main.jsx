import {createRoot} from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import CifrotechMainApp from "./src/CifrotechMainApp.jsx";
import CheckAccess from "./src/Auth/CheckAccess.jsx";
import MainMiniApp from "./src/miniApp-V1/mainMiniApp.jsx";
import ThemeProvider from "./src/miniApp-V1/sdk/theme/ThemeProvider.jsx";
import ParamsProvider from "./src/miniApp-V1/sdk/hook/ParamsProvider.jsx";


const root = createRoot(document.getElementById('root'));

root.render(
    <Router>
        <Routes>
            <Route path="/webapp"
                   element={<ThemeProvider><ParamsProvider><MainMiniApp/></ParamsProvider></ThemeProvider>} />
            <Route path={import.meta.env.VITE_SERVICE_POINT} element={<CheckAccess/>}/>
            <Route path="/*" element={<CifrotechMainApp/>}/>
        </Routes>
    </Router>
);

