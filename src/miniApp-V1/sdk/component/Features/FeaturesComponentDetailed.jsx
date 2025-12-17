import {Collapse} from 'antd-mobile';
import {getSectionIcon} from "./SectionIconMap.jsx";
import styles from "../../css/features.module.css";
import {useContext} from "react";
import {ThemeContext} from "../../context.js";

function SidebarItem({sectionName, theme}) {
    return (
        <div className={styles.detailedFeaturesRow}>

            <span
                className={styles.detailedFeaturesIcon}
                style={{color: theme.colorPrimary}}
            >
                {getSectionIcon(sectionName)}
            </span>

            <span
                className={styles.detailedFeaturesTitle}
                style={{
                    paddingLeft: "8px", fontSize: 14, fontWeight: 501,
                    fontFamily: theme.fontFamily, color: theme.colorPrimary
                }}
            >
                {sectionName}
            </span>
        </div>
    );
}


function SectionTable({values, theme}) {
    return (
        <table style={{color: theme.colorText, width: '100%',
            backgroundColor: theme.colorCard, borderRadius: '6px'}}>
            <tbody>
            {Object.entries(values).map(([key, value]) => (
                <tr key={key}>
                    <td
                        style={{
                            fontWeight: "bold",
                            padding: "4px",
                            verticalAlign: "top",
                        }}
                    >
                        {key}
                    </td>
                    <td >{value}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

function FeaturesComponentDetailed({info}) {

    const theme = useContext(ThemeContext);

    return (
        <div className={styles.featuresDetailedContainer}>
            <Collapse accordion>
                {info.map((section) => {
                    const sectionName = Object.keys(section)[0];
                    const values = section[sectionName];

                    return (
                        <Collapse.Panel
                            accordion
                            style={{width: "100%"}}
                            key={sectionName}
                            arrowIcon={null}
                            title={<SidebarItem sectionName={sectionName} theme={theme}/>}
                        >
                            <SectionTable values={values} theme={theme}/>
                        </Collapse.Panel>
                    );
                })}
            </Collapse>
        </div>
    );
}

export default FeaturesComponentDetailed;
