import style from './utils.module.css'
import PathTable from "./PathTable.jsx";


const IconSettings = ({title}) => {


    return (<>
            <div className={style.topContainer}>
                {title}
            </div>
            <PathTable/>
        </>

    )
}

export default IconSettings