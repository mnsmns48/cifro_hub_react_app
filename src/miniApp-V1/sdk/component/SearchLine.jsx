import {useRef} from 'react'
import {SearchBar} from 'antd-mobile'

function SearchLine({insets, isMobile}) {
    const searchRef = useRef(null)
    const safeTop = insets?.top ?? 0;
    const handleSearch = () => {
    }

    return (
        // <div style={{paddingTop: `calc(${safeTop}px + env(safe-area-inset-top, 0px) - 10px)`}}>
            <SearchBar
                placeholder="Я ищу"
                onSearch={handleSearch}
                ref={searchRef}
            />

        // </div>
    )
}

export default SearchLine;