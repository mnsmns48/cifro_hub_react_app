import ComparisonProgress from "./ComparisonProgress.jsx";
import {Checkbox} from "antd";
import TimeDayBlock from "../../../Ui/TimeDateBlock.jsx";


const getComparisonTableColumns = (setRows, progressMap, setProgressMap, isUpdating)  => [
    {
        title: "Sync",
        dataIndex: "sync",
        key: "sync",
        width: 20,
        render: (value, record) => (
            <Checkbox
                checked={!!value}
                disabled={isUpdating}
                onChange={(e) => {
                    const checked = e.target.checked;
                    setRows(prev =>
                        prev.map(row =>
                            row.id === record.id ? { ...row, sync: checked } : row
                        )
                    );
                }}
            />
        )
    },
    {
        dataIndex: "title",
        key: "title",
        render: (text) => text || <span style={{ color: "#999" }}>—</span>,
    },
    {
        title: "Обновлено",
        dataIndex: "dt_parsed",
        key: "dt_parsed",
        render: (value) => <TimeDayBlock isoString={value} />
    },
    {
        dataIndex: "url",
        key: "url",
        render: (text) => (
            <a href={text} target="_blank" rel="noopener noreferrer" style={{ wordBreak: "break-word" }}>
                {text}
            </a>
        ),
    },
    {
        dataIndex: "status",
        key: "status",
        render: (_, record) => (
            <ComparisonProgress
                id={record.id}
                progress_obj={record.progress_obj}
                progressState={progressMap[record.id]}
                setProgressMap={setProgressMap}
                duration={record.duration}
            />
        ),
    },
];

export default getComparisonTableColumns;