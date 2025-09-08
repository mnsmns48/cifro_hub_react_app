import {FallOutlined, RiseOutlined} from "@ant-design/icons";

const PriceDiffStatusColorMap = {
    only_parsing: "#999999",
    only_hub: "#999999",
    equal: "#222222",
    hub_higher: "#B1BC12FF",
    parsing_higher: "#c41d1d",
};

function getPriceColorByStatus(status) {
    return PriceDiffStatusColorMap[status] || PriceDiffStatusColorMap.equal;
}


const PriceBlock = ({value, status}) => {
    if (!value) {
        return ""
    }

    const renderStatusIcon = () => {
        if (status === "hub_higher") {
            return <FallOutlined style={styles.iconFall}/>;
        }
        if (status === "parsing_higher") {
            return <RiseOutlined style={styles.iconRise}/>;
        }
        return null;
    }

    const formatted = Number(value);
    const color = getPriceColorByStatus(status);

    return (
        <div style={styles.wrapper}>
            <div style={{...styles.priceBase, color}}>{formatted}</div>
            {renderStatusIcon()}
        </div>
    );
};

const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '20px',
        backgroundColor: '#d5e4fa',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        padding: '4px 8px',
        minWidth: 70,
    },
    priceBase: {
        fontSize: '0.91rem',
        fontWeight: 'bold',
    },
    iconRise: {
        fontSize: "0.9rem",
        color: "#c41d1d",
        marginTop: 2,
    },
    iconFall: {
        fontSize: "0.9rem",
        color: "#B1BC12FF",
        marginTop: 2,
    },
};

export default PriceBlock;
