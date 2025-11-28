import ParamsProvider from "./sdk/hook/ParamsProvider.jsx";
import ThemeProvider from "./sdk/theme/ThemeProvider.jsx";
import RootWebapp from "./RootWebapp.jsx";


const WebApp = () => {
    return (
        <ThemeProvider>
            <ParamsProvider>
                <RootWebapp/>
            </ParamsProvider>
        </ThemeProvider>
    )
}

export default WebApp

