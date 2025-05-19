import { Progress } from "antd";
import { useEffect, useState } from "react";

const ParsingProgress = ({ parsing_id }) => {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [totalTasks, setTotalTasks] = useState(null);
    const [messagesCount, setMessagesCount] = useState(0);

    useEffect(() => {
        const eventSource = new EventSource(`/progress/${parsing_id}`);

        eventSource.onmessage = (event) => {
            const data = event.data.trim();
            console.log("Получено событие:", data);

            if (data.startsWith("data: COUNT=")) {
                const count = parseInt(data.split("=")[1], 10);
                setTotalTasks(count);
                console.log("Установлено количество задач:", count);


                setMessagesCount((prev) => {
                    setProgress(Math.round((prev / count) * 100));
                    return prev;
                });
                return;
            }

            setMessagesCount((prev) => {
                const newCount = prev + 1;
                setMessage(data);
                console.log(`Обработано сообщений: ${newCount}`);


                if (totalTasks) {
                    const newProgress = Math.round((newCount / totalTasks) * 100);
                    console.log(`Обновлен прогресс: ${newProgress}%`);
                    setProgress(Math.min(newProgress, 100));
                }
                return newCount;
            });

            if (data.includes("END")) {
                console.log("Парсинг завершен, закрытие EventSource");
                eventSource.close();
            }
        };

        return () => eventSource.close();
    }, [parsing_id, totalTasks]);

    return (
        <div>
            <Progress percent={progress} status={progress < 100 ? "active" : "success"} strokeColor={progress < 100 ? "#FFD700" : undefined} />
            <div style={{ marginTop: "10px", minHeight: "20px" }}>{message}</div>
        </div>
    );
};

export default ParsingProgress;
