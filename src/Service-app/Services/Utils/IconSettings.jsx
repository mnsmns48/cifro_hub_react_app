import style from './utils.module.css'
import PathTable from "./PathTable.jsx";


const IconSettings = ({title, table}) => {


    return (<>
            <div className={style.topContainer}>
                {title}
            </div>
            <PathTable table={table} />
        </>

    )
}

export default IconSettings