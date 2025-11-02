import useTelegram from "./useTelegram.jsx";

function useAppEnvironment() {
    let tgData = useTelegram();

    const defaultData = {
        hasTelegram: false,
        isMobile: /Mobi|Android/i.test(navigator.userAgent),
        insets: {top: 0, bottom: 0, left: 0, right: 0},
        theme: {colorBackground: '#fff'},
        viewportHeight: window.innerHeight,
    };

    return tgData || defaultData;
}

export default useAppEnvironment;