import {useContext} from "react";
import {ThemeContext} from "../../context.js";
import styles from "../../css/features.module.css"

export default function FeaturesComponentShort({blocks}) {
    const theme = useContext(ThemeContext);

    return (
        <div style={{padding: "12px 0 0 18px"}}>
            <table >
                <tbody>
                {blocks.map(({icon, title, specs}) => (
                    <tr key={title}>

                        <td style={{width: '12%'}}>
                            <span style={{color: theme.colorMuted}}
                                  className={styles.shortFeaturesIcon}>
                                {icon}
                            </span>
                        </td>


                        <td style={{width: "30%", color: theme.colorText, fontSize: 14, fontFamily: theme.fontFamily}}>
                            <strong>{title}</strong>
                        </td>


                        <td style={{
                            paddingLeft: "8px", lineHeight: 1.9, fontWeight: 501,
                            fontFamily: theme.fontFamily, color: theme.colorSecondary
                        }}>
                            {specs.map(
                                s => `${s.value} ${s.label ?? ""}`
                            ).join(" ")
                            }
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

}
