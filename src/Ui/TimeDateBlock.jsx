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
            <div style={styles.time}>{`${hours}:${minutes}`}</div>
            <div style={{ ...styles.dateBase, color: dateColor }}>{dateLabel}</div>
        </div>
    );
};

const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '4px',
        backgroundColor: '#e0e0e0',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        padding: '0 6px'
    },
    time: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#222',
    },
    dateBase: {
        fontSize: '1rem',
        fontWeight: 'bold',
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
