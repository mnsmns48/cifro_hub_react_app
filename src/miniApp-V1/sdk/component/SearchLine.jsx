import { useRef, useLayoutEffect } from 'react';
import { SearchBar } from 'antd-mobile';

function SearchLine({ onHeightChange }) {
    const ref = useRef(null);

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

    const handleSearch = () => {};

    return (
        <div ref={ref} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <SearchBar
                placeholder="Я ищу"
                onSearch={handleSearch}
                style={{
                    '--text-color': 'white',
                    '--text-weight': 'bold',
                    '--placeholder-color': '#808080',
                    '--background': '#e4e4e4',
                    '--border-radius': '999px',
                    width: '33%',
                }}
            />
        </div>
    );
}

export default SearchLine;