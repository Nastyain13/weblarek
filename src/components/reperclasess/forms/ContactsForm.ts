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
         
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container); 
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container); 
        this.onFormChange = onFormChange;
         
        this.setupEventListeners(); 
    } 

    private setupEventListeners(): void {                                          
        [this.emailInput, this.phoneInput].forEach(input => {                   
            input.addEventListener('input', () => {                             
                if (this.onFormChange) {
                    this.onFormChange(this.getPartialFormData());
                }
            }); 
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

    protected getPartialFormData(): Partial<IContactsFormData> {
        return {
            email: this.emailInput.value,
            phone: this.phoneInput.value
        };
    }
}