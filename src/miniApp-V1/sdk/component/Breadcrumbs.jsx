import styles from "../css/breadcrumb.module.css";
import {useContext, useEffect, useRef} from "react";
import {ThemeContext} from "../context.js";

export default function BreadCrumbs({stack, onSelect}) {
    const theme = useContext(ThemeContext);

    const lastRef = useRef(null);

    useEffect(() => {
        if (lastRef.current) {
            lastRef.current.scrollIntoView({
                behavior: "smooth",
                inline: "end",
                block: "nearest"
            });
        }
    }, [stack]);

    return (
        <div className={styles.breadCrumbContainer}>
            {stack.map((item, index) => {
                const isLast = index === stack.length - 1;

                return (
                    <div
                        key={index}
                        style={{ cursor: "pointer", opacity: isLast ? 1 : 0.6 }}
                        onClick={() => onSelect(index)}
                        ref={isLast ? lastRef : null}
                    >
                        <span
                            className={styles.breadCrumbBtn}
                            style={{
                                background: isLast ? theme.colorLightGreen : theme.colorCard,
                                color: isLast ? "black" : theme.colorText
                            }}
                        >
                            {item.label}
                        </span>

                        {!isLast && <span style={{ margin: "0 3px" }}> </span>}
                    </div>
                );
            })}
        </div>
    );
}