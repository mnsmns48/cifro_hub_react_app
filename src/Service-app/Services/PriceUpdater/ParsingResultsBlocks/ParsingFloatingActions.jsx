import { Button, Spin } from "antd";
import {
    ReloadOutlined,
    AlignRightOutlined,
    LoadingOutlined
} from "@ant-design/icons";

const ParsingFloatingActions = ({
                                    isRefreshing,
                                    onRefresh,
                                    onOpenFilter
                                }) => {
    const spinIcon = (
        <LoadingOutlined
            style={{ fontSize: 18, color: "#e2fc2a" }}
            spin
        />
    );

    return (
        <>
            {isRefreshing ? (
                <div className="circle-float-button refresh-float-button">
                    <Spin indicator={spinIcon} />
                </div>
            ) : (
                <Button
                    onClick={onRefresh}
                    className="circle-float-button refresh-float-button"
                >
                    <ReloadOutlined style={{ fontSize: 20 }} />
                </Button>
            )}

            <Button
                onClick={onOpenFilter}
                className="circle-float-button filter-button"
            >
                <AlignRightOutlined style={{ fontSize: 20 }} />
            </Button>
        </>
    );
};

export default ParsingFloatingActions;
