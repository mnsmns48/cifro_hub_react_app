import { useEffect, useState } from "react";

const TelegramDebugPanel = () => {
    const [logs, setLogs] = useState([]);
    const [tgData, setTgData] = useState(null);
    const [system, setSystem] = useState({});

    const addLog = (msg) => {
        setLogs((prev) => [...prev, `${new Date().toISOString()} → ${msg}`]);
    };

    const dumpAll = () => {
        if (!window.Telegram?.WebApp) return;
        const tg = window.Telegram.WebApp;
        addLog("📦 FULL DUMP ↓");
        addLog(JSON.stringify({
            version: tg.version,
            platform: tg.platform,
            colorScheme: tg.colorScheme,
            themeParams: tg.themeParams,
            initData: tg.initData,
            initDataUnsafe: tg.initDataUnsafe,
            isExpanded: tg.isExpanded,
            viewportHeight: tg.viewportHeight,
            backgroundColor: tg.backgroundColor,
            headerColor: tg.headerColor,
        }, null, 2));
    };

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg) {
            addLog("❌ Telegram.WebApp NOT FOUND");
            return;
        }

        addLog("✅ Telegram.WebApp detected");
        addLog(`platform: ${tg.platform}`);
        addLog(`version: ${tg.version}`);
        addLog(`colorScheme: ${tg.colorScheme}`);

        setTgData({
            initData: tg.initData,
            initDataUnsafe: tg.initDataUnsafe,
            themeParams: tg.themeParams,
        });

        setSystem({
            isExpanded: tg.isExpanded,
            viewportHeight: tg.viewportHeight,
            backgroundColor: tg.backgroundColor,
            headerColor: tg.headerColor,
        });

        const safe = (fn, name) => {
            try {
                fn();
                addLog(`✅ ${name} called`);
            } catch (e) {
                addLog(`❌ ${name} FAILED: ${e.message}`);
            }
        };

        safe(() => tg.ready(), "tg.ready()");
        safe(() => tg.setBackgroundColor(tg.themeParams?.bg_color || "#fff"), "setBackgroundColor");
        safe(() => tg.setHeaderColor("bg_color"), "setHeaderColor(bg_color)");

        setTimeout(() => {
            if (!tg.isExpanded) {
                safe(() => tg.expand(), "expand()");
            } else {
                addLog("ℹ️ expand() skipped — already expanded");
            }
        }, 150);

        const onThemeChanged = () => {
            addLog("🎨 themeChanged event fired");
            addLog(`new colorScheme: ${tg.colorScheme}`);
            addLog(`updated themeParams: ${JSON.stringify(tg.themeParams)}`);
        };

        const onViewportChanged = ({ isStateStable }) => {
            addLog(`📐 viewportChanged — stable=${isStateStable} height=${tg.viewportHeight}`);
            setSystem((s) => ({ ...s, viewportHeight: tg.viewportHeight }));
        };

        tg.onEvent?.("themeChanged", onThemeChanged);
        tg.onEvent?.("viewportChanged", onViewportChanged);

        addLog("📌 Subscribed to themeChanged & viewportChanged");

        return () => {
            tg.offEvent?.("themeChanged", onThemeChanged);
            tg.offEvent?.("viewportChanged", onViewportChanged);
        };
    }, []);

    return (
        <div style={{
            fontSize: 12,
            padding: 10,
            background: "#000000E6",
            color: "lime",
            height: "55vh",
            overflowY: "auto",
            zIndex: 999999,
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            whiteSpace: "pre-wrap"
        }}>
            <b>📍 Telegram Debug Panel</b>
            <button onClick={dumpAll} style={{ float: "right", fontSize: 10 }}>Dump All</button>
            <br /><br />

            {tgData && (
                <>
                    <b>initData:</b> {tgData.initData || "null"}<br />
                    <b>initDataUnsafe:</b> {JSON.stringify(tgData.initDataUnsafe, null, 2)}<br />
                    <b>themeParams:</b> {JSON.stringify(tgData.themeParams, null, 2)}<br /><br />
                </>
            )}

            {system && (
                <>
                    <b>🧩 System UI:</b><br />
                    isExpanded: {String(system.isExpanded)}<br />
                    viewportHeight: {system.viewportHeight}<br />
                    backgroundColor: {system.backgroundColor}<br />
                    headerColor: {system.headerColor}<br /><br />
                </>
            )}

            {logs.map((l, i) => <div key={i}>{l}</div>)}
        </div>
    );
};

export default TelegramDebugPanel;