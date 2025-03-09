import React, {Suspense} from "react";
import {Spin} from "antd";


function shortSmartPhoneSpecification(info, source) {
    const ShortSpecsImportComponent = React.lazy(() => import(`./description_sources/${source}.jsx`));
    return (
        <Suspense fallback={<div><Spin/></div>}>
            <ShortSpecsImportComponent features_array={info}/>
        </Suspense>
    );
}


const ShortInfoBlock = ({title, specs}) => (
    <div>
        {title}
        {specs.map((spec) =>
            spec.value && ` ${spec.value}${spec.label || ""}`)}
    </div>
);


export const RenderShortSpecs = ({features_array, shortSpecificationFn}) => {
    const shortSpecs = shortSpecificationFn(features_array);
    return (
        <>
            {shortSpecs && (
                <>
                    {(shortSpecs.month || shortSpecs.year) && (
                        <ShortInfoBlock
                            title="Дата выхода"
                            specs={[
                                {value: shortSpecs.month},
                                {value: shortSpecs.year}
                            ]}
                        />
                    )}
                    {(shortSpecs.displayType || shortSpecs.displaySize || shortSpecs.displayResolution || shortSpecs.displayRefreshRate) && (
                        <ShortInfoBlock title="Дисплей" specs={[
                            {value: shortSpecs.displayType},
                            {value: shortSpecs.displaySize, label: '"'},
                            {value: shortSpecs.displayResolution},
                            {value: shortSpecs.displayRefreshRate, label: ' Гц'},
                        ]}
                        />
                    )}
                    {(shortSpecs.batteryCapacity || shortSpecs.batteryMaxPowerCharge) && (
                        <ShortInfoBlock title="Батарея" specs={[
                            {value: shortSpecs.batteryCapacity, label: ' мАч'},
                            {value: shortSpecs.batteryMaxPowerCharge, label: ' Вт'},
                        ]}
                        />
                    )}
                    {shortSpecs.quickCharge ? (
                        <ShortInfoBlock title="Быстрая зарядка" specs={[
                            {value: shortSpecs.quickCharge}
                        ]}
                        />
                    ) : (
                        shortSpecs.selfieSpecs && (
                            <ShortInfoBlock title="Селфи " specs={[
                                {value: shortSpecs.selfieSpecs, label: ' mpx'}
                            ]}
                            />
                        )
                    )}
                    {shortSpecs.cameraSpecs && (
                        <ShortInfoBlock title="Камеры" specs={[
                            {value: shortSpecs.cameraSpecs, label: ' мpx'}
                        ]}
                        />
                    )}
                    {(shortSpecs.cpu || shortSpecs.cpuMaxClock || shortSpecs.cpuLithographyProcess) && (
                        <ShortInfoBlock
                            title=""
                            specs={[
                                {value: shortSpecs.cpu},
                                {value: shortSpecs.cpuMaxClock, label: ' МГц'},
                                {value: shortSpecs.cpuLithographyProcess, label: ' нм'},
                            ]}
                        />
                    )}
                    {shortSpecs.antutuScore ? (
                        <ShortInfoBlock
                            title="Тест производительности Antutu"
                            specs={[
                                {value: shortSpecs.version ? `v${shortSpecs.version}` : null},
                                {value: shortSpecs.antutuScore}
                            ]}
                        />
                    ) : (
                        shortSpecs.system && (
                            <ShortInfoBlock
                                title=""
                                specs={[
                                    {value: shortSpecs.system}
                                ]}
                            />
                        )
                    )}
                </>
            )}
        </>
    );
};


export default function SmartPhone({info}) {
    let features_array = [];
    try {
        features_array = JSON.parse(info.info || '[]');
    } catch (error) {
        console.error("Ошибка при парсинге JSON:", error);
        features_array = [];
    }
    return (
        <>
            {shortSmartPhoneSpecification(features_array, info.source)}
        </>
    )
}
