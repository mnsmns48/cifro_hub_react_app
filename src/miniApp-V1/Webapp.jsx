import ServicePicProvider from "./sdk/hook/ServicePicProvider.jsx";
import ThemeProvider from "./sdk/theme/ThemeProvider.jsx";
import AppEnvironmentProvider from "./sdk/hook/useAppEnvironment.jsx";

import RootWebapp from "./RootWebapp.jsx";


const WebApp = () => {
    return (
        <ThemeProvider>
            <ServicePicProvider>
                <AppEnvironmentProvider>
                    <RootWebapp/>
                </AppEnvironmentProvider>
            </ServicePicProvider>
        </ThemeProvider>
    )
}

export default WebApp

