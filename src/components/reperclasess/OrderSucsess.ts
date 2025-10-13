import { Component } from "../../components/base/Component";
import { cloneTemplate, ensureElement } from "../../utils/utils";

export class OrderSucsess extends Component<{ total: number }> {
    protected headerElement: HTMLElement;
    protected summaryElement: HTMLElement;
    protected actionButton: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, onDismiss?: () => void) {
        // Клонируем шаблон и передаем в родительский класс
        const container = cloneTemplate<HTMLElement>(template);
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

    // Обновление информации о потраченой сумме
    updateTotalAmount(amount: number): void {
        this.summaryElement.textContent = `Списано ${amount} синапсов`;
    }

    
}