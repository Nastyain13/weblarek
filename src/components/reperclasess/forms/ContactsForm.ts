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
        container: HTMLFormElement,
        protected onSubmit: () => void,
        protected onInput?: (data: Partial<IContactsFormData>) => void
    ) {
        super(container); // конструктор родительского класса Form
        
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        
        this.setupValidation();
        this.setupSubmit();
    }

    private setupValidation(): void {                                          // проверятся валидность
        [this.emailInput, this.phoneInput].forEach(input => {                   // массив из двух полей e-mail и телефон
            input.addEventListener('input', () => {                            
                this.validate();
                this.onInput?.({
                    email: this.emailInput.value,
                    phone: this.phoneInput.value                           
                });
            });
        });
    }

    private setupSubmit(): void {                                        
        this.formElement.addEventListener('submit', (event) => {             
            event.preventDefault();
            if (this.validate()) {
                this.onSubmit();
            }
        });
    }

   

    setEmail(email: string): void {      // Устанавливает значение поля e-mail, и phone  и проверяет на валидность
        this.emailInput.value = email;
        this.validate();
    }

    setPhone(phone: string): void {
        this.phoneInput.value = phone;
        this.validate();
    }

  
}