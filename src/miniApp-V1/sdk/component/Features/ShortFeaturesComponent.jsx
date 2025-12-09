export default function ShortFeaturesComponent({blocks}) {

    return (
        <div style={{padding: "8px"}}>
            <ul style={{listStyle: "none", padding: 0, margin: 0, color: "#3a3a3a"}}>
                {blocks.map(({icon, title, specs}) => (
                    <li key={title} style={{margin: "10px"}}>
                        <strong><span style={{
                            color: '#e2fc2a',
                            background: '#3a3a3a',
                            padding: '6px',
                            borderRadius: '12px',
                        }}>{icon}</span> {title}</strong>{" "}
                        <div style={{display: "inline", lineHeight: 1.9}}>
                            {specs.map(s => `${s.value} ${s.label ? s.label : ''}`).join(' ')}
                        </div>

                    </li>
                ))}
            </ul>
        </div>
    );
}
