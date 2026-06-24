import {ClockCircleOutlined} from "@ant-design/icons";

const TimeDayBlock = ({ isoString }) => {
    if (!isoString) {
        return "";
    }
    const date = new Date(isoString);
    const now = new Date();

    const pad = (num) => String(num).padStart(2, '0');

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();

    const isSameDay = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    let dateLabel = `${day}-${month}-${year}`;
    let dateColor = styles.dateDefault.color;

    if (isSameDay) {
        dateLabel = 'Сегодня';
        dateColor = styles.dateToday.color;
    } else if (isYesterday) {
        dateLabel = 'Вчера';
        dateColor = styles.dateYesterday.color;
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.time}>
                <ClockCircleOutlined style={{ color: "#999" }} />
                &nbsp;&nbsp;{hours}:{minutes}
            </div>

            <div style={{ ...styles.dateBase, color: dateColor }}>
                {dateLabel}
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2px 4px",
        margin: "2px 0",
        backgroundColor: "#939393",
        borderRadius: "4px",
        lineHeight: 1.2,
    },
    time: {
        fontSize: "0.75rem",

        color: "#333",
        display: "flex",
        alignItems: "center",
    },
    dateBase: {
        fontSize: "0.75rem",
        marginTop: "1px",
    },
    dateToday: {
        color: "#c4e800",
    },
    dateYesterday: {
        color: "#ff4d4f",
    },
    dateDefault: {
        color: "#214255",
    },
};

export default TimeDayBlock;
