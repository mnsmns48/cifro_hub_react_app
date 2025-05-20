import { Progress } from "antd";
import { useEffect, useState } from "react";

const ParsingProgress = ({ progress_obj }) => {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [totalTasks, setTotalTasks] = useState(0);
    const [messagesCount, setMessagesCount] = useState(0);

    useEffect(() => {
        const eventSource = new EventSource(`/progress/${progress_obj}`);

        eventSource.onmessage = (event) => {
            console.log('totalTasks', totalTasks)
            const data = event.data.trim();

            if (data.startsWith("data: COUNT=")) {
                const count = parseInt(data.split("=")[1], 10);
                console.log('count!!', count);
                setTotalTasks(count);
                return;
            }

            setMessagesCount((prev) => {
                const newCount = prev + 1;
                setMessage(data);

                if (totalTasks) {
                    setProgress(Math.min(Math.round((newCount / totalTasks) * 100), 100));
                }
                return newCount;
            });

            if (data.includes("END")) {
                eventSource.close();
            }
        };

        return () => eventSource.close();
    }, [progress_obj, totalTasks]);

    useEffect(() => {
        console.log('messagesCount, totalTasks, progress', messagesCount, totalTasks, progress)
        if (totalTasks) {
            setProgress(Math.min(Math.round((messagesCount / totalTasks) * 100), 100));
        }
    }, [messagesCount, totalTasks]);

    return (
        <div>
            <Progress percent={progress}
                      status={progress < 100 ? "active" : "success"}
                      strokeColor={progress < 100 ? "#FFD700" : undefined} />
            <div style={{ marginTop: "10px", minHeight: "20px" }}>{message}</div>
        </div>
    );
};

export default ParsingProgress;
