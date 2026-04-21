import {Button, Input, Select, Badge, Tooltip} from "antd";
import {
    CalculatorOutlined,
    CalendarOutlined,
    DeleteRowOutlined,
    EyeInvisibleOutlined,
    FileExcelOutlined,
    LinkOutlined, QuestionCircleOutlined, ReloadOutlined
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

                            onExportExcel,

                            showDependencyColumn,
                            setShowDependencyColumn

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
            <Tooltip title="Сбросить фильтры">
                <Button onClick={onResetFilters}>
                    <ReloadOutlined />
                </Button>
            </Tooltip>
            <Tooltip title="Показать / скрыть закупочные цены и разницу">
                <Button onClick={onTogglePrice}>
                    {showInputPrice ? <CalendarOutlined/> : <CalculatorOutlined/>}
                </Button>
            </Tooltip>
            <Tooltip title="Показать / скрыть позиции без картинок">
                <Badge count={countNoPreview} offset={[-8, -6]}>
                    <Button onClick={() => onFilterChange("noPreview")}>
                        <EyeInvisibleOutlined/>
                    </Button>
                </Badge>
            </Tooltip>
            <Tooltip title="Показать / скрыть позиции без зависимостей (Модель не присвоена)">
                <Badge count={countNoFeatures} offset={[-8, -6]}>
                    <Button onClick={() => onFilterChange("noFeatures")}>
                        <DeleteRowOutlined/>
                    </Button>
                </Badge>
            </Tooltip>
            <Tooltip title="Показать / скрыть позиции без атрибутов">
                <Badge count={countNoAttributes} offset={[-8, -6]}>
                    <Button onClick={() => onFilterChange("NoAttributes")}>
                        <LinkOutlined/>
                    </Button>
                </Badge>
            </Tooltip>
            <Tooltip title="Показать / скрыть колонку 'Зависимость'">
                <Button
                    onClick={() => setShowDependencyColumn(v => !v)}
                    style={{
                        background: showDependencyColumn ? "#ff4d4f" : "transparent",
                        color: showDependencyColumn ? "white" : "inherit",
                    }}
                >
                    <QuestionCircleOutlined/>
                </Button>
            </Tooltip>


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
