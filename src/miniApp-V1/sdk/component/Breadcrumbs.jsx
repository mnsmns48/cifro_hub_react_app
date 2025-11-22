import styles from "../css/breadcrumb.module.css";

export default function BreadCrumbs({theme, stack, onSelect}) {


    return (
        <div className={styles.breadCrumbContainer}>
            {stack.map((item, index) => (
                <div style={{cursor: "pointer", opacity: index === stack.length - 1 ? 1 : 0.6}}
                     onClick={() => onSelect(index)}
                     key={index}>
          <span className={styles.breadCrumbBtn}
                style={{
                    background: index === stack.length - 1 ? theme.colorLightGreen : theme.colorCard,
                    color: index === stack.length - 1 ? "black" : theme.colorText
                }}>
            {item.label}
          </span>
                    {index < stack.length - 1 && (
                        <span style={{margin: "0 3px"}}>{" "}</span>
                    )}
                </div>
            ))}
        </div>
    );
}