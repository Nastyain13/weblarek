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
    super(container, onFormSubmit, onFormChange);
    
    // Находим контейнер с кнопками оплаты
    const buttonsContainer = ensureElement<HTMLElement>(
      ".order__buttons",
      container
    );
    
    // Получаем все кнопки оплаты
    this.ButtonsPayment = Array.from(
      buttonsContainer.querySelectorAll("button")
    ) as HTMLButtonElement[];
    
    // Находим поле ввода адреса
    this.Adress = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container
    );

    // Добавляем обработчики для кнопок оплаты
    this.ButtonsPayment.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        this.selectPaymentMethod(button.name as TPayment);
        // Вызываем колбэк изменения формы
        onFormChange && onFormChange(this.getFormData());
      });
    });

    // Слушаем изменения в поле адреса
    this.Adress.addEventListener("input", () => {
      onFormChange && onFormChange(this.getFormData());
    });
  }

  // Установка способа оплаты
  setPayment(value: TPayment): void {
    this.selectPaymentMethod(value);
  }

  // Установка адреса
  setAddress(value: string): void {
    this.Adress.value = value;
  }

  // Получение данных формы (реализация абстрактного метода)
  protected getFormData(): Partial<OrderFormData> {
    const activeButton = this.ButtonsPayment.find((button) =>
      button.classList.contains("button_alt-active")
    );
    const payment = (activeButton?.name ?? "online") as TPayment;
    
    return {
      payment,
      address: this.Adress.value,
    };
  }

  // Выбор способа оплаты
  protected selectPaymentMethod(method: TPayment) {
    this.ButtonsPayment.forEach((button) =>
      button.classList.toggle("button_alt-active", button.name === method)
    );
  }
}

   
  


  