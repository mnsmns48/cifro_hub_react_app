import VslUpdateProgress from "./VslUpdateProgress.jsx";
import {Checkbox, Tooltip} from "antd";
import TimeDayBlock from "../../../Ui/TimeDateBlock.jsx";


const getComparisonTableColumns = (setRows, progressMap, setProgressMap, isUpdating) => [
    {
        title: "Подтянуть зависимости",
        dataIndex: "sync",
        align: "center",
        key: "sync",
        width: "10%",
        render: (value, record) => (
            <Checkbox
                checked={!!value}
                disabled={isUpdating}
                onChange={(e) => {
                    const checked = e.target.checked;
                    setRows(prev =>
                        prev.map(row =>
                            row.id === record.id ? {...row, sync: checked} : row
                        )
                    );
                }}
            />
        )
    },
    {
        dataIndex: "title",
        key: "title",
        width: "20%",
        render: (text) => text || <span style={{color: "#999"}}>—</span>,
    },
    {
        title: "Обновлено",
        dataIndex: "dt_parsed",
        key: "dt_parsed",
        width: "10%",
        render: (value) => <TimeDayBlock isoString={value}/>
    },

    {
        dataIndex: "url",
        key: "url",
        width: "10%",
        render: (text) => (
            <Tooltip
                title={
                    <a
                        href={text}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{color: "white"}}
                    >
                        {text}
                    </a>
                }
            >
                <a href={text}
                   target="_blank"
                   rel="noopener noreferrer"
                   style={{
                       display: "inline-block",
                       maxWidth: "100%",
                       whiteSpace: "nowrap",
                       overflow: "hidden",
                       textOverflow: "ellipsis",
                       verticalAlign: "middle"
                   }}
                >
                    {text}
                </a>

            </Tooltip>
        ),


    },
    {
        dataIndex: "status",
        key: "status",
        width: "20%",
        render: (_, record) => (
            <VslUpdateProgress
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