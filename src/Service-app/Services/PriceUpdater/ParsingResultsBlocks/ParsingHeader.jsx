import {formatDate} from "../../../../../utils.js";

const ParsingHeader = ({url, result}) => {
    return (
        <div>
            <p>
                <strong>Собрано:</strong> {formatDate(result.dt_parsed)} <br/>

                {result.duration && (
                    <>
                        <strong>Время:</strong>{" "}
                        {Number(result.duration).toFixed(1)} сек
                        <br/>
                    </>
                )}

                <strong>Количество:</strong>{" "}
                {Array.isArray(result.parsing_result)
                    ? result.parsing_result.length
                    : 0}
                <br/>

                <strong>Ссылка:</strong>{" "}
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{color: "#999999", cursor: "default"}}
                >
                    {url}
                </a>
            </p>
        </div>
    );
};

export default ParsingHeader;