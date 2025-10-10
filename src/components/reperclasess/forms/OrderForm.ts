import { Form } from './Form';
import { ensureElement } from "../../../utils/utils";

interface IOrderFormData {
    payment: string;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    protected paymentButtons: NodeListOf<HTMLButtonElement>;
    protected addressInput: HTMLInputElement;
    private selectedPayment: string = '';

    constructor(
        container: HTMLFormElement,
        protected onSubmit: () => void,
        protected onInput?: (data: Partial<IOrderFormData>) => void
    ) {
        super(container);
        
        // Находим элементы
        this.paymentButtons = this.container.querySelectorAll('button[name]');
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        
        // Настраиваем кнопки оплаты
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.selectPayment(button.name);
            });
        });

        // Следим за вводом адреса
        this.addressInput.addEventListener('input', () => {
            this.validate();
            this.onInput?.({ address: this.addressInput.value });
        });

        // Обрабатываем отправку
        this.formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            if (this.validate()) {
                this.onSubmit();
            }
        });
    }

    // Выбор оплаты
    private selectPayment(payment: string): void {
        // Убираем выделение со всех кнопок
        this.paymentButtons.forEach(btn => {
            btn.classList.remove('button_alt-active');
        });

        // Находим и выделяем выбранную кнопку
        const selectedButton = Array.from(this.paymentButtons).find(btn => btn.name === payment);
        if (selectedButton) {
            selectedButton.classList.add('button_alt-active');
            this.selectedPayment = payment;
            this.validate();
            this.onInput?.({ payment });
        }
    }

    // Проверка формы
    protected validate(): boolean {
        const isValid = !!this.selectedPayment && this.addressInput.value.trim().length > 0;
        this.setDisabled(!isValid); // блокируем кнопку если невалидно
        return isValid;
    }

    // Установить оплату
    setPayment(payment: string): void {
        this.selectPayment(payment);
    }

    // Установить адрес
    setAddress(address: string): void {
        this.addressInput.value = address;
        this.validate();
    }
}