
import { Form } from './Form';  
import { ensureElement } from "../../../utils/utils"; 

interface IContactsFormData { 
    email: string; 
    phone: string; 
} 

export class ContactsForm extends Form<IContactsFormData> { 
    protected emailInput: HTMLInputElement; 
    protected phoneInput: HTMLInputElement; 
    protected onFormChange?: (data: Partial<IContactsFormData>) => void;

    constructor( 
        container: HTMLElement, 
        onFormSubmit?: () => void,
        onFormChange?: (data: Partial<IContactsFormData>) => void 
    ) { 
        super(container, onFormSubmit); 
         
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container); 
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container); 
        this.onFormChange = onFormChange;
        
        // Обработчики изменений полей
        this.emailInput.addEventListener('input', () => {
            this.handleInputChange();
        });
        
        this.phoneInput.addEventListener('input', () => {
            this.handleInputChange();
        });
    } 

    set email(value: string) { 
        this.emailInput.value = value; 
    } 

    set phone(value: string) { 
        this.phoneInput.value = value; 
    }

    protected getFormData(): IContactsFormData {
        return {
            email: this.emailInput.value,
            phone: this.phoneInput.value
        };
    }

    // Валидация формы контактов
    validateContacts(): { isValid: boolean; errors: Record<string, string> } {
        const errors: Record<string, string> = {};
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();
        
        // Проверка заполненности полей
        if (!email) {
            errors.email = 'Введите email';
        } else if (!this.isValidEmail(email)) {
            errors.email = 'Неверный формат email';
        }
        
        if (!phone) {
            errors.phone = 'Введите телефон';
        } else if (!this.isValidPhone(phone)) {
            errors.phone = 'Неверный формат телефона';
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    // Обновление состояния формы при изменении полей
    private handleInputChange(): void {
        const formData = this.getFormData();
        
        // Передаем данные изменения
        if (this.onFormChange) {
            this.onFormChange(formData);
        }
        
        // Валидируем форму
        const validation = this.validateContacts();
        
        // Обновляем состояние кнопки и ошибки
        this.disabled = !validation.isValid;
        this.errors = validation.errors;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isValidPhone(phone: string): boolean {
        const digitsOnly = phone.replace(/\D/g, '');
        return digitsOnly.length >= 10;
    }
}