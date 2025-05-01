export default function BillPrinter() {
    const today = new Date();
    const formattedDate = String(today.getDate()).padStart(2, '0') + '.' +
        String(today.getMonth() + 1).padStart(2, '0') + '.' +
        today.getFullYear();
    const randomNumber = Math.floor(Math.random() * (60000 - 50000 + 1)) + 50000;


    const billSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("/service/billsubmit", {
                method: "POST",
                body: new FormData(event.target),
            });
            if (response.ok) {
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
        } catch (error) {
            console.error("Произошла ошибка:", error);
        }
    };

    return (
        <div className="bill-wrapper">
            <div className="form-container">
                <form onSubmit={billSubmit} method="POST">
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
                    <input type="submit" value="Генерация"/>
                </form>
            </div>
        </div>
    );
}
