import {FallOutlined, RiseOutlined} from "@ant-design/icons";
import {Tooltip} from "antd";

const PriceDiffStatusColorMap = {
    only_parsing: "#999999",
    only_hub: "#999999",
    equal: "#222222",
    hub_higher: "#ed8000",
    parsing_higher: "#86a305",
};

function getPriceColorByStatus(status) {
    return PriceDiffStatusColorMap[status] || PriceDiffStatusColorMap.equal;
}


const PriceBlock = ({value, status, referencePrice}) => {
    if (!value) {
        return ""
    }

    const price = Number(value);
    const color = getPriceColorByStatus(status);

    const diff = referencePrice !== undefined && referencePrice !== null
        ? Number(value) - Number(referencePrice)
        : null;

    const renderStatusIcon = () => {
        if (status === "hub_higher" && diff !== null) {
            return (
                <Tooltip title={`−${Math.abs(diff).toFixed(2)}`}>
                    <FallOutlined style={styles.iconFall}/>
                </Tooltip>
            );
        }
        if (status === "parsing_higher" && diff !== null) {
            return (
                <Tooltip title={`+${Math.abs(diff).toFixed(2)}`}>
                    <RiseOutlined style={styles.iconRise}/>
                </Tooltip>
            );
        }
        return null;
    };

    return (
        <div style={styles.wrapper}>
            <div style={{...styles.priceBase, color}}>{price}</div>
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
        marginTop: 2,
    },
    iconFall: {
        fontSize: "0.9rem",
        marginTop: 2,
    },
};

export default PriceBlock;
