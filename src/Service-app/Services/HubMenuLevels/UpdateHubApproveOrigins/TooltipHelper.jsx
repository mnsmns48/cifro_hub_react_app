// eslint-disable-next-line react-refresh/only-export-components
const TooltipCard = ({title, color, blocks, examples}) => (
    <div style={{
        maxWidth: 480,
        lineHeight: "1.55em",
        fontSize: 11,
        background: "#000",
        padding: 4
    }}>
        <div style={{
            fontWeight: 700,
            marginBottom: 10,
            color,
            fontSize: 14
        }}>
            {title}
        </div>

        {blocks.map((block, i) => (
            <div key={i} style={{
                padding: "10px 12px",
                border: `1px solid ${block.border}`,
                borderRadius: 6,
                marginBottom: 14
            }}>
                <div style={{
                    fontWeight: 600,
                    marginBottom: 6,
                    color: block.color
                }}>
                    {block.header}
                </div>

                <div dangerouslySetInnerHTML={{__html: block.content}}/>
            </div>
        ))}

        <div style={{
            padding: "10px 12px",
            border: "1px solid #adc6ff",
            borderRadius: 6
        }}>
            <div style={{
                fontWeight: 600,
                marginBottom: 6,
                color: "#2f54eb"
            }}>
                Пример поведения
            </div>

            <ul style={{margin: "0 0 0 18px"}}>
                {examples.map((ex, i) => (
                    <li key={i} dangerouslySetInnerHTML={{__html: ex}}/>
                ))}
            </ul>
        </div>
    </div>
);

export const scaleTooltip = (
    <TooltipCard
        title="Коэффициент мягкости рынка (scale)"
        color="#1677ff"
        blocks={[
            {
                header: "Почему это важно",
                color: "#1677ff",
                border: "#91caff",
                content: `
                    На реальном рынке разброс цен зависит от категории:
                    <ul style="margin: 6px 0 0 18px">
                        <li>в дешёвых товарах цены обычно плотные</li>
                        <li>в дорогих категориях разброс может быть огромным</li>
                    </ul>
                    Scale позволяет analyzer учитывать это поведение.
                `
            },
            {
                header: "Если УМЕНЬШАТЬ значение",
                color: "#cf1322",
                border: "#ffa39e",
                content: `
                    Рынок становится «жёстким»:
                    <ul style="margin: 6px 0 0 18px">
                        <li>tolerance уменьшается</li>
                        <li>даже небольшой разброс цен считается подозрительным</li>
                        <li>больше товаров попадают в зону риска</li>
                    </ul>
                    Подходит для:
                    <ul style="margin: 6px 0 0 18px">
                        <li>категорий с низкой ценой</li>
                        <li>товаров с фиксированной наценкой</li>
                        <li>рынков с плотной конкуренцией</li>
                    </ul>
                `
            },
            {
                header: "Если УВЕЛИЧИВАТЬ значение",
                color: "#389e0d",
                border: "#b7eb8f",
                content: `
                    Рынок становится «мягким»:
                    <ul style="margin: 6px 0 0 18px">
                        <li>tolerance растёт</li>
                        <li>допускается больший разброс цен</li>
                        <li>меньше товаров помечаются как дорогие</li>
                    </ul>
                    Подходит для:
                    <ul style="margin: 6px 0 0 18px">
                        <li>премиальных категорий</li>
                        <li>дорогой электроники</li>
                        <li>товаров с высокой волатильностью цен</li>
                    </ul>
                `
            }
        ]}
        examples={[
            "<b>scale = 2</b> — рынок жёсткий, разброс минимален",
            "<b>scale = 5</b> — сбалансированное поведение",
            "<b>scale = 10</b> — рынок мягкий, допускается большой разброс цен"
        ]}
    />
);
export const exponentTooltip = (
    <TooltipCard
        title="Степень влияния цены (exponent)"
        color="#1677ff"
        blocks={[
            {
                header: "Почему это важно",
                color: "#1677ff",
                border: "#d3adf7",
                content: `
                    Переплата <b>+3000 ₽</b>:
                    <ul style="margin: 6px 0 0 18px">
                        <li>для телефона за <b>15 000 ₽</b> — огромная разница</li>
                        <li>для флагмана за <b>180 000 ₽</b> — почти незаметно</li>
                    </ul>
                    Exponent нужен, чтобы analyzer понимал эту разницу.
                `
            },
            {
                header: "Если УМЕНЬШАТЬ значение",
                color: "#cf1322",
                border: "#ffa39e",
                content: `
                    Analyzer начинает относиться к дешёвым и дорогим товарам одинаково.
                    <ul style="margin: 6px 0 0 18px">
                        <li>15 000 ₽ → +3000 ₽ → <b>suspicious</b></li>
                        <li>180 000 ₽ → +3000 ₽ → <b>тоже suspicious</b></li>
                    </ul>
                    Подходит для:
                    <ul style="margin: 6px 0 0 18px">
                        <li>жёсткой логики</li>
                        <li>фиксированной наценки</li>
                        <li>дешёвых категорий</li>
                    </ul>
                `
            },
            {
                header: "Если УВЕЛИЧИВАТЬ значение",
                color: "#389e0d",
                border: "#b7eb8f",
                content: `
                    Analyzer становится мягче к дорогим товарам.
                    <ul style="margin: 6px 0 0 18px">
                        <li>15 000 ₽ → +3000 ₽ → <b>verdict=False</b></li>
                        <li>180 000 ₽ → +3000 ₽ → <b>verdict=True</b></li>
                    </ul>
                    Подходит для:
                    <ul style="margin: 6px 0 0 18px">
                        <li>premium сегмента</li>
                        <li>Apple / Samsung Ultra</li>
                        <li>видеокарт</li>
                        <li>дорогой электроники</li>
                    </ul>
                `
            }
        ]}
        examples={[
            "<b>exponent = 0.3</b> — почти одинаковая логика для всех цен",
            "<b>exponent = 1.1</b> — сбалансированный режим",
            "<b>exponent = 2.0</b> — дорогим товарам разрешается большой разброс цен"
        ]}
    />
);