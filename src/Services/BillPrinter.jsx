export default function BillPrinter() {
    const today = new Date();
    const formattedDate = String(today.getDate()).padStart(2, '0') + '.' +
        String(today.getMonth() + 1).padStart(2, '0') + '.' +
        today.getFullYear();
    const randomNumber = Math.floor(Math.random() * (60000 - 50000 + 1)) + 50000;

    const billRender = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const formDataObj = Object.fromEntries(data.entries());
        if (formDataObj.receipt_date &&
            formDataObj.receipt_number &&
            formDataObj.receipt_qty &&
            formDataObj.receipt_product &&
            formDataObj.receipt_price) {
            try {
                const response = await fetch("/service/billrender",
                    {method: "POST", body: data});
                if (response.status === 200 || response.status === 204) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "receipt.xlsx";
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                } else {
                    console.error("Ошибка при отправке данных:", response.statusText);
                }
            } catch (error) {console.error("Произошла ошибка:", error)}
        }
        else {
            alert('Все поля должны быть заполнены')
        }

    }

    return (
        <div className="bill-wrapper">
            <div className="form-container">
                <form onSubmit={billRender} method="POST">
                    <label htmlFor="receipt_date">Дата чека:</label>
                    <input type="text" id="receipt_date" name="receipt_date" defaultValue={formattedDate}/><br/>
                    <label htmlFor="receipt_number">Номер чека:</label>
                    <input type="number" id="receipt_number" name="receipt_number" defaultValue={randomNumber}/><br/>
                    <label htmlFor="receipt_product">Наименование товара:</label>
                    <input type="text" id="receipt_product" name="receipt_product"/><br/>
                    <label htmlFor="receipt_qty">Количество:</label>
                    <input type="number" id="receipt_qty" name="receipt_qty"/><br/>
                    <label htmlFor="receipt_price">Цена:</label>
                    <input type="number" id="receipt_price" name="receipt_price"/><br/>
                    <input type="submit" value="Скачать"/>
                </form>
            </div>
        </div>
    );
}
