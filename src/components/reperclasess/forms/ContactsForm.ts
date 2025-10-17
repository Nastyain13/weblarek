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
    ) {
        super(container, onFormSubmit);
        
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this.emailInput.placeholder = "Введите e-mail";
        this.phoneInput.placeholder = "+7(";
    }

    //  Сеттер для email
    set email(value: string) {
        this.emailInput.value = value;
    }

    //Сеттер для phone
    set phone(value: string) {
        this.phoneInput.value = value;
    }

    

   
}