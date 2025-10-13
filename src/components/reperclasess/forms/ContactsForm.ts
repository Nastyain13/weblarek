  import { Form } from './Form'; 
import { ensureElement } from "../../../utils/utils";



interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(
        container: HTMLElement,
        onFormSubmit?: () => void,
        onFormChange?: (formData: Partial<IContactsFormData>) => void
    ) {
        super(container, onFormSubmit, onFormChange);
        
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
    }

    // Реализация абстрактного метода для получения данных формы
    protected getFormData(): Partial<IContactsFormData> {
        return {
            email: this.emailInput.value,
            phone: this.phoneInput.value
        };
    }

    // Методы для установки значений
    setEmail(email: string): void {
        this.emailInput.value = email;
    }

    setPhone(phone: string): void {
        this.phoneInput.value = phone;
    }

    // Метод для отображения ошибок из модели
    displayErrors(errors: Partial<Record<keyof IContactsFormData, string>>): void {
        const errorMessages = Object.values(errors).filter(Boolean);
        this.errorContainer.textContent = errorMessages.join("\n");
    }

    // Очистка формы
    clear(): void {
        this.emailInput.value = '';
        this.phoneInput.value = '';
    }

    // Получение полных данных формы
    getFormValues(): IContactsFormData {
        const data = this.getFormData();
        return {
            email: data.email || '',
            phone: data.phone || ''
        };
    }
}