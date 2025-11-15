import {useCurrentTheme} from "../theme/useTheme.js";

export default function BreadcrumbTabs({stack, onSelect}) {
    const theme = useCurrentTheme();

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 12px",
                overflowX: "auto",
                whiteSpace: "nowrap"
            }}
        >
            {stack.map((item, index) => (
                <div
                    key={index}
                    onClick={() => onSelect(index)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        opacity: index === stack.length - 1 ? 1 : 0.6
                    }}
                >
          <span
              style={{
                  padding: "6px 12px",
                  background: index === stack.length - 1 ? theme.colorBright : theme.colorCard,
                  color: index === stack.length - 1 ? "black" : theme.colorText,
                  borderRadius: 16,
                  fontSize: 15
              }}
          >
            {item.label}
          </span>

                    {index < stack.length - 1 && (
                        <span style={{marginLeft: 4, marginRight: 4}}>{">"}</span>
                    )}
                </div>
            ))}
        </div>
    );
}
