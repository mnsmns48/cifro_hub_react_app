import {useRef, useLayoutEffect} from 'react';
import {SearchBar} from 'antd-mobile';
import styles from "../css/searchline.module.css";
import {useCurrentTheme} from "../theme/useTheme.js";

function SearchLine({onHeightChange}) {
    const ref = useRef(null);
    const theme = useCurrentTheme();

    useLayoutEffect(() => {
        if (!ref.current) return;
        const node = ref.current?.nativeElement || ref.current;
        const updateHeight = () => {
            const height = node?.offsetHeight ?? 0;
            onHeightChange?.(height);
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, [onHeightChange]);

    const handleSearch = () => {
    };

    return (
        <div ref={ref} style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
            <SearchBar placeholder="Поиск отключен"
                       className={styles.searchBar}
                       onSearch={handleSearch}
                       style={{width: '40%', '--background': theme.colorBorder}}
            />
        </div>
    );
}

export default SearchLine;