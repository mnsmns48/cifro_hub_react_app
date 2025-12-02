import ParsingProgress from "./ParsingProgress.jsx";
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";

const ProgressIndicator = ({progress_obj}) => {
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                background: "rgba(0, 0, 0, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <div
                style={{
                    background: "white",
                    borderRadius: "0.625em",
                    boxShadow: "0 0.5em 1.5em rgba(0,0,0,0.2)",
                    width: "90vw",
                    maxWidth: "20em",
                    minWidth: "17.5em",
                    minHeight: "10vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1em",
                    padding: "1.25em"
                }}
            >
                <style>
                    {`.spinner { margin-right: 0px !important; }`}
                </style>

                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <Spinner />
                </div>

                <ParsingProgress progress_obj={progress_obj} />
            </div>
        </div>
    );
};

export default ProgressIndicator;
