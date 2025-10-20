import { Component } from "../../components/base/Component"; 
import { ensureElement } from "../../utils/utils"; 

export class OrderSuccess extends Component<{ total: number }> { 
    protected headerElement: HTMLElement; 
    protected summaryElement: HTMLElement; 
    protected actionButton: HTMLButtonElement; 

    constructor(container: HTMLElement, onDismiss?: () => void) {  
        // Просто передаем container, не клонируем снова
        super(container); 
         
        // Инициализируем DOM-элементы 
        this.headerElement = ensureElement<HTMLElement>(".order-success__title", this.container); 
        this.summaryElement = ensureElement<HTMLElement>(".order-success__description", this.container); 
        this.actionButton = ensureElement<HTMLButtonElement>(".order-success__close", this.container); 

        // Добавляем обработчик закрытия 
        if (onDismiss) { 
            this.actionButton.addEventListener("click", (event) => { 
                event.preventDefault(); 
                onDismiss(); 
            }); 
        } 
    } 

    // Сеттер для общей суммы
    set total(amount: number) { 
        this.summaryElement.textContent = `Списано ${amount} синапсов`; 
    } 
}