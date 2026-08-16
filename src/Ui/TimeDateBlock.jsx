import {ClockCircleOutlined} from "@ant-design/icons";
const TimeDayBlock = ({ isoString }) => {
    if (!isoString) return "";

    const date = new Date(isoString);
    const now = new Date();

    const pad = (n) => String(n).padStart(2, "0");

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();

    const isSameDay = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const dateLabel = isSameDay
        ? "Сегодня"
        : isYesterday
            ? "Вчера"
            : `${day}.${month}.${year}`;

    const dateColor = isSameDay
        ? "#c4e800"
        : isYesterday
            ? "#ff4d4f"
            : "#214255";

    return (
        <div style={styles.wrapper}>
            <ClockCircleOutlined style={{ color: "#c4e800", fontSize: 12 }} />
            <span style={styles.text}>
                {hours}:{minutes} • <span style={{ color: dateColor }}>{dateLabel}</span>
            </span>
        </div>
    );
};

const styles = {
    wrapper: {
        display: "flex",
        alignItems: "center",
        gap: 4,
        maxWidth: 150,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    text: {
        fontSize: "0.75rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
};

export default TimeDayBlock;
