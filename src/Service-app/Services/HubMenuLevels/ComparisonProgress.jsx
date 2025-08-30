import {useEffect} from "react";
import {Progress} from "antd";
import {ClockCircleOutlined, CheckCircleOutlined} from "@ant-design/icons";
import {progressStreamManager} from "./ProgressStreamManager.js";

const ComparisonProgress = ({id, progress_obj, progressState, setProgressMap, duration}) => {
    useEffect(() => {
        if (!progress_obj || progressState?.status === "done") return;

        const update = (state) => {
            setProgressMap(prev => ({
                ...prev,
                [id]: state
            }));
        };

        progressStreamManager.subscribe(progress_obj, update);

        return () => {
            progressStreamManager.unsubscribe(progress_obj, update);
        };
    }, [id, progress_obj]);


    if (!progressState || progressState.status === "pending") {
        return (
            <span style={{color: "#999", display: "flex", alignItems: "center", gap: 6}}>
                <ClockCircleOutlined/>
                Ожидает обновления
            </span>
        );
    }

    if (progressState.status === "in_progress") {
        return (
            <Progress
                percent={progressState.percent}
                strokeLinecap="butt"
                size="small"
            />
        );
    }

    if (progressState.status === "done") {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ color: "#52c41a", display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircleOutlined />
                    Готово
                </span>
                {duration && (
                    <span style={{ fontWeight: 600, color: "#333", fontSize: "13px" }}>
                        {duration.toFixed(1)} сек
                    </span>
                )}
            </div>
        );
    }

    return null;
};

export default ComparisonProgress;