import { Form } from './Form';   
import { ensureElement } from "../../../utils/utils";   
import { TPayment } from "../../../types";  
 
type OrderFormData = {  
  payment: TPayment;  
  address: string;  
};  
 
export class OrderForm extends Form<OrderFormData> {  
  protected ButtonsPayment: HTMLButtonElement[];  
  protected Adress: HTMLInputElement;  
  protected onFormChange?: (formData: Partial<OrderFormData>) => void;
 
  constructor(  
    container: HTMLElement,  
    onFormSubmit?: () => void,  
    onFormChange?: (formData: Partial<OrderFormData>) => void  
  ) {  
    super(container, onFormSubmit);  
      
    const buttonsContainer = ensureElement<HTMLElement>(".order__buttons", container);  
      
    this.ButtonsPayment = Array.from(  
      buttonsContainer.querySelectorAll("button")  
    ) as HTMLButtonElement[];  
      
    this.Adress = ensureElement<HTMLInputElement>('input[name="address"]', container);  
    this.onFormChange = onFormChange;
 
    this.ButtonsPayment.forEach((button) => {  
      button.addEventListener("click", (event) => {  
        event.preventDefault();  
        this.selectPaymentMethod(button.name as TPayment);  
        this.handleFormChange();  
      });  
    });  
 
    this.Adress.addEventListener("input", () => {  
      this.handleFormChange();  
    });  
  }  
 
  set payment(value: TPayment) {  
    this.selectPaymentMethod(value);  
  }  
 
  set address(value: string) {  
    this.Adress.value = value;  
  }  
 
  protected getFormData(): OrderFormData {  
    const activeButton = this.ButtonsPayment.find((button) =>  
      button.classList.contains("button_alt-active")  
    );  
     
    const payment = (activeButton?.name as TPayment) || 'online' as TPayment; 
     
    return {  
      payment,  
      address: this.Adress.value || '', 
    };  
  } 
 
  protected getPartialFormData(): Partial<OrderFormData> {  
    const activeButton = this.ButtonsPayment.find((button) =>  
      button.classList.contains("button_alt-active")  
    );  
    const payment = (activeButton?.name ?? undefined) as TPayment | undefined; 
      
    const result: Partial<OrderFormData> = {}; 
     
    if (payment) { 
      result.payment = payment; 
    } 
     
    result.address = this.Adress.value; 
     
    return result;  
  }  
 
  protected selectPaymentMethod(method: TPayment) {  
    this.ButtonsPayment.forEach((button) =>  
      button.classList.toggle("button_alt-active", button.name === method)  
    );  
  }  

  private handleFormChange(): void {
    const formData = this.getPartialFormData();
    
    // Только генерируем событие, валидацию делает модель
    if (this.onFormChange) {
      this.onFormChange(formData);
    }
  }
}