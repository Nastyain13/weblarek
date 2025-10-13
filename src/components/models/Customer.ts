import { IBuyer, IValidationResult, TPayment } from '../../types/index'; 
import { EventEmitter } from "../base/Events"; 
 
export class Customer extends EventEmitter { 
  private payment: TPayment = "online"; 
  private email: string = ''; 
  private phone: string = ''; 
  private address: string = ''; 
 
  // Сохранение данных покупателя (общий метод) 
  setData(data: Partial<IBuyer>): void { 
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
  getData(): IBuyer { 
    return { 
      payment: this.payment, 
      email: this.email, 
      phone: this.phone, 
      address: this.address 
    }; 
  } 
 
  // Очистка данных покупателя 
  clear(): void { 
    this.payment = "online"; 
    this.email = ''; 
    this.phone = ''; 
    this.address = ''; 
    this.emit('customer:changed', this.getData()); 
  } 
 
  // Валидация данных 
  validate(): IValidationResult { 
    const errors: IValidationResult['errors'] = {}; 
 
    if (!this.payment) { 
      errors.payment = 'Способ оплаты не выбран'; 
    } 
 
    if (!this.email.trim()) { 
      errors.email = 'Email не может быть пустым'; 
    } 
 
    if (!this.phone.trim()) { 
      errors.phone = 'Телефон не может быть пустым'; 
    } 
 
    if (!this.address.trim()) { 
      errors.address = 'Адрес не может быть пустым'; 
    } 
 
    return { 
      isValid: Object.keys(errors).length === 0, 
      errors 
    }; 
  } 
}