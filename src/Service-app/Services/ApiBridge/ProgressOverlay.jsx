const ProgressOverlay = ({progress}) => {
    if (!progress) return null;

    return (
        <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.85)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10
        }}>
            <div style={{
                width: "60%",
                height: 12,
                background: "#eee",
                borderRadius: 6,
                overflow: "hidden",
                marginBottom: 10
            }}>
                <div style={{
                    width: `${progress.percent}%`,
                    height: "100%",
                    background: "#1890ff",
                    transition: "width 0.3s ease"
                }}/>
            </div>


            <div style={{fontSize: 12, color: "#666"}}>
                Страница {progress.page} из {progress.pages} •
                Получено {progress.total_items}
            </div>
            {progress.eta > 0 && (
                <div style={{fontSize: 16, fontWeight: 600}}>
                    Осталось {progress.eta} сек
                </div>
            )}

        </div>
    );
};

export default ProgressOverlay;
