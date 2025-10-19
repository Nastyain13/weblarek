import { IBuyer, IValidationResult, TPayment } from '../../types/index'; 
import { EventEmitter } from "../base/Events"; 
 
export class Customer extends EventEmitter { 
  private payment: TPayment | null = null; 
  private email: string = ''; 
  private phone: string = ''; 
  private address: string = ''; 
 
  // Сохранение данных покупателя
  public setData(data: Partial<IBuyer>): void { 
    let changed = false; 
     
    if (data.payment !== undefined && this.payment !== data.payment) { 
      this.payment = data.payment; 
      changed = true; 
    } 
    if (data.email !== undefined && this.email !== data.email) { 
      this.email = data.email; 
      changed = true; 
    } 
    if (data.phone !== undefined && this.phone !== data.phone) { 
      this.phone = data.phone; 
      changed = true; 
    } 
    if (data.address !== undefined && this.address !== data.address) { 
      this.address = data.address; 
      changed = true; 
    } 
 
    if (changed) { 
      this.emit('customer:changed', this.getData()); 
    } 
  } 
 
  // Получение всех данных покупателя 
  public getData(): IBuyer { 
    return { 
      payment: this.payment || "online",
      email: this.email, 
      phone: this.phone, 
      address: this.address 
    }; 
  } 
  
  public get contacts(): { email: string; phone: string } {
    return {
      email: this.email,
      phone: this.phone
    };
  }

  // Очистка данных покупателя 
 public clear(): void { 
    this.payment = null; 
    this.email = ''; 
    this.phone = ''; 
    this.address = ''; 
    this.emit('customer:changed', this.getData()); 
  } 
 
  validateOrder(): IValidationResult { 
    const errors: IValidationResult['errors'] = {}; 
    if (!this.address.trim()) { 
      errors.address = 'Необходимо указать адрес'; 
    }
    if (!this.payment) {
      errors.payment = 'Выберите способ оплаты';
    }
    return { 
      isValid: Object.keys(errors).length === 0, 
      errors 
    }; 
  }

  // Валидация контактов
  validateContacts(): IValidationResult {
    const errors: IValidationResult['errors'] = {};
    
    if (!this.email.trim()) {
      errors.email = 'Введите email';
    } else if (!this.isValidEmail(this.email)) {
      errors.email = 'Неверный формат email';
    }
    
    if (!this.phone.trim()) {
      errors.phone = 'Введите телефон';
    } else if (!this.isValidPhone(this.phone)) {
      errors.phone = 'Неверный формат телефона';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
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