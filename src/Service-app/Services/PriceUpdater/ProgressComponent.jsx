import { useEffect, useState } from "react";
import { Progress } from "antd";

const ProgressComponent = () => {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState(""); // Показываем последнее сообщение
    const [totalTasks, setTotalTasks] = useState(null);
    const [messagesCount, setMessagesCount] = useState(0); // Счетчик полученных сообщений

    useEffect(() => {
        const eventSource = new EventSource("/service/progress");

        eventSource.onmessage = (event) => {
            if (event.data.startsWith("COUNT=")) {
                setTotalTasks(parseInt(event.data.split("=")[1], 10));
                return;
            }

            // Обновляем количество сообщений и сразу же показываем новое сообщение
            setMessagesCount(prev => {
                const newCount = prev + 1;
                setMessage(event.data); // Показываем текущее сообщение
                if (totalTasks !== null) {
                    const newProgress = Math.round((newCount / totalTasks) * 100);
                    setProgress(Math.min(newProgress, 100));
                }
                return newCount;
            });

            if (event.data.includes("END")) {
                eventSource.close();
            }
        };

        return () => eventSource.close();
    }, [totalTasks]); // Следим за изменением `totalTasks`

    return (
        <div>
            <Progress percent={progress} status={progress < 100 ? "active" : "success"} />
            <div style={{ marginTop: "10px", minHeight: "20px" }}>{message}</div> {/* Показываем последнее сообщение */}
        </div>
    );
};

export default ProgressComponent;
