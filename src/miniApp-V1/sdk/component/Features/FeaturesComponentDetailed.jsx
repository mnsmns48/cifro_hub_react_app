import {getSectionIcon} from "./SectionIconMap.jsx";

function SidebarItem({sectionName, isActive, onClick, theme}) {
    return (
        <div
            onClick={onClick}
            style={{
                flexDirection: "column",
                padding: "6px",
                cursor: "pointer",
                display: "flex",
                background: isActive ? "black" : "transparent",
                color: isActive ? theme.colorLightGreen : "#333",
            }}
        >
            {getSectionIcon(sectionName)}
        </div>
    );
}

function SidebarContainer({info, currentKey, setActiveKey, theme}) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "#296fd5",
                overflowX: "auto",
                borderRadius: "14px",
            }}
        >
            {info.map((section) => {
                const sectionName = Object.keys(section)[0];
                const isActive = currentKey === sectionName;

                return (
                    <SidebarItem
                        key={sectionName}
                        sectionName={sectionName}
                        isActive={isActive}
                        theme={theme}
                        onClick={() => setActiveKey(sectionName)}
                    />
                );
            })}
        </div>
    );
}

function SectionTable({values}) {
    return (
        <table style={{width: "100%", color: "#3a3a3a"}}>
            <tbody>
            {Object.entries(values).map(([key, value]) => (
                <tr key={key}>
                    <td
                        style={{
                            fontWeight: "bold",
                            padding: "6px 8px",
                            width: "40%",
                            verticalAlign: "top",
                        }}
                    >
                        {key}
                    </td>
                    <td style={{padding: "6px 8px"}}>{value}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

function FeaturesComponentDetailed({info, activeKey, setActiveKey, theme}) {
    const firstSectionName = info.length > 0 ? Object.keys(info[0])[0] : "";
    const currentKey = activeKey || firstSectionName;

    const activeSection = info.find(
        (section) => Object.keys(section)[0] === currentKey
    );

    const [, activeValues] = activeSection
        ? Object.entries(activeSection)[0]
        : ["", {}];

    return (
        <>
            <div style={{ display: "flex", width: "100%", padding: "12px 0 0 18px" }}>
                <div style={{ alignSelf: "flex-start" }}>
                    <SidebarContainer
                        info={info}
                        currentKey={currentKey}
                        setActiveKey={setActiveKey}
                        theme={theme}
                    />
                </div>

                <div style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
                    <SectionTable values={activeValues} />
                </div>
            </div>
        </>
    );
}

export default FeaturesComponentDetailed;