import {CapsuleTabs} from "antd-mobile";


export default function CapsuleTabsMenu({ theme, data = [] }) {
    if (!Array.isArray(data) || data.length === 0) {
        return null;
    }

    return (
        <CapsuleTabs
            style={{
                backgroundColor: theme?.colorBorder || "#fff",
                padding: "8px 0",
            }}
        >
            {data.map((item) => (
                <CapsuleTabs.Tab
                    key={item.id}
                    title={
                        <div style={{ textAlign: "center" }}>
                            <img
                                src={item.icon}
                                alt={item.label}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 8,
                                    objectFit: "cover",
                                }}
                            />
                            <div
                                style={{
                                    fontSize: 12,
                                    marginTop: 4,
                                    color: theme?.colorText || "#000",
                                }}
                            >
                                {item.label}
                            </div>
                        </div>
                    }
                >
                    {/* Можно отрендерить содержимое таба, например label или описание */}
                    <div style={{ padding: 12 }}>
                        <strong>{item.label}</strong> — контент вкладки.
                    </div>
                </CapsuleTabs.Tab>
            ))}
        </CapsuleTabs>
    );
}