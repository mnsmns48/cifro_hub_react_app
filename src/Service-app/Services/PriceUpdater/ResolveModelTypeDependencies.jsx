import SmartPhone from "../../../Cifrotech-app/components/products/smartPhone.jsx";

const ResolveModelTypeDependencies = ({source, info}) => {
    if (!source || !info) {
        return (
            <div style={{padding: 10, color: "red"}}>
                Ошибка: отсутствуют данные для отображения
            </div>
        );
    }

    return <SmartPhone info={{info, source}}/>;
};

export default ResolveModelTypeDependencies;
