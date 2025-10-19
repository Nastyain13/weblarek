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

    this.ButtonsPayment.forEach((button) => { 
      button.addEventListener("click", (event) => { 
        event.preventDefault(); 
        this.selectPaymentMethod(button.name as TPayment); 
        onFormChange && onFormChange(this.getPartialFormData()); 
      }); 
    }); 

    this.Adress.addEventListener("input", () => { 
      onFormChange && onFormChange(this.getPartialFormData()); 
    }); 
  } 

  set payment(value: TPayment) { 
    this.selectPaymentMethod(value); 
  } 

  set address(value: string) { 
    this.Adress.value = value; 
  } 

  set errors(value: Record<string, string>) { 
    const errorMessages: string[] = []; 
     
    if (value.payment) { 
      errorMessages.push(value.payment); 
    } 
     
    if (value.address) { 
      errorMessages.push(value.address); 
    } 
     
    this.errorContainer.textContent = errorMessages.join('\n'); 
    this.errorContainer.style.display = errorMessages.length > 0 ? 'block' : 'none'; 
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

  // ИСПРАВЛЕНИЕ: Всегда включаем address в результат, даже если пустая строка
  protected getPartialFormData(): Partial<OrderFormData> { 
    const activeButton = this.ButtonsPayment.find((button) => 
      button.classList.contains("button_alt-active") 
    ); 
    const payment = (activeButton?.name ?? undefined) as TPayment | undefined;
     
    const result: Partial<OrderFormData> = {};
    
    if (payment) {
      result.payment = payment;
    }
    
    // ВАЖНОЕ ИСПРАВЛЕНИЕ: всегда передаем address, даже если пустая строка
    result.address = this.Adress.value;
    
    return result; 
  } 

  protected selectPaymentMethod(method: TPayment) { 
    this.ButtonsPayment.forEach((button) => 
      button.classList.toggle("button_alt-active", button.name === method) 
    ); 
  } 
}