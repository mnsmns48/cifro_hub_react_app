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
             <div style={styles.time}><ClockCircleOutlined style={{color: '#999999'}}/>&nbsp;&nbsp;{`${hours}:${minutes}`}</div>
            <div style={{ ...styles.dateBase, color: dateColor }}>{dateLabel}</div>
        </div>
    );
};

const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '30px',
        backgroundColor: 'rgba(109,123,154,0.36)',
        boxShadow: '0 2px 2px rgba(0,22,0,100)',
        margin: '3px'
    },
    time: {
        fontSize: '0,7em',
        color: '#222',
    },
    dateBase: {
        fontSize: '0.8rem',
    },
    dateToday: {
        color: '#e2fc2a',
    },
    dateYesterday: {
        color: '#ff4d4f',
    },
    dateDefault: {
        color: '#214255',
    },
};

export default TimeDayBlock;
