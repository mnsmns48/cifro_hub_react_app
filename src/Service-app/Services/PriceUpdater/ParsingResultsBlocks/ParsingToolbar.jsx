import {Button, Input, Select, Badge, Tooltip} from "antd";
import {
    BarsOutlined,
    CalculatorOutlined,
    CalendarOutlined,
    DeleteRowOutlined,
    EyeInvisibleOutlined,
    FileExcelOutlined,
    LinkOutlined
} from "@ant-design/icons";

const {Search} = Input;

const ParsingToolbar = ({
                            showInputPrice,
                            onTogglePrice,

                            onResetFilters,
                            onFilterChange,

                            countNoPreview,
                            countNoFeatures,
                            countNoAttributes,

                            searchText,
                            onSearchChange,

                            rewardOptions,
                            selectedRangeId,
                            onRangeChange,

                            onExportExcel
                        }) => {
    return (
        <div
            style={{
                display: "flex",
                gap: 5,
                flexWrap: "wrap",
                padding: "12px 0"
            }}
        >
            <Button onClick={onTogglePrice}>
                {showInputPrice ? <CalendarOutlined/> : <CalculatorOutlined/>}
            </Button>

            <Button onClick={onResetFilters}>
                <BarsOutlined/>
            </Button>

            <Badge count={countNoPreview} offset={[-8, -6]}>
                <Button onClick={() => onFilterChange("noPreview")}>
                    <EyeInvisibleOutlined/>
                </Button>
            </Badge>

            <Badge count={countNoFeatures} offset={[-8, -6]}>
                <Button onClick={() => onFilterChange("noFeatures")}>
                    <DeleteRowOutlined/>
                </Button>
            </Badge>

            <Badge count={countNoAttributes} offset={[-8, -6]}>
                <Button onClick={() => onFilterChange("NoAttributes")}>
                    <LinkOutlined/>
                </Button>
            </Badge>

            <Search
                placeholder="Поиск по названию / коду товара"
                allowClear
                style={{maxWidth: 500}}
                value={searchText}
                onChange={e => onSearchChange(e.target.value)}
            />

            <Tooltip title="Профиль вознаграждения">
                <Select
                    style={{minWidth: 200}}
                    options={rewardOptions}
                    value={selectedRangeId}
                    onChange={onRangeChange}
                />
            </Tooltip>

            <Button onClick={onExportExcel}>
                <FileExcelOutlined/>
            </Button>
        </div>
    );
};

export default ParsingToolbar;
