import style from './utils.module.css'
import PathTable from "./PathTable.jsx";
import {tableConfig} from "./tableconf.js";


const IconSettings = ({table}) => {
    const config = tableConfig[table]

    return (<>

            <div className={style.topContainer}>
                {config.title}
            </div>
            <PathTable config={config}/>
        </>

    )
}

export default IconSettings