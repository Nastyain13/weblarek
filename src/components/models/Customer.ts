import { IBuyer, IValidationResult, TPayment } from '../../types/index';
import { EventEmitter } from "../base/Events";

export class Customer extends EventEmitter {
  private payment: TPayment | null = null;
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
      this.emit('customer:changed');
    }
  }

  // Сохранение отдельных полей
  setPayment(payment: TPayment): void {
    if (this.payment !== payment) {
      this.payment = payment;
      this.emit('customer:changed');
    }
  }

  setEmail(email: string): void {
    if (this.email !== email) {
      this.email = email;
      this.emit('customer:changed');
    }
  }

  setPhone(phone: string): void {
    if (this.phone !== phone) {
      this.phone = phone;
      this.emit('customer:changed');
    }
  }

  setAddress(address: string): void {
    if (this.address !== address) {
      this.address = address;
      this.emit('customer:changed');
    }
  }

  // Получение всех данных покупателя
  getData(): IBuyer {
    if (!this.isComplete()) {
      throw new Error('Not all customer data is filled');
    }
    
    return {
      payment: this.payment!,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }

  // Получение текущих данных (частично заполненных)
  getCurrentData(): Partial<IBuyer> {
    return {
      ...(this.payment && { payment: this.payment }),
      ...(this.email && { email: this.email }),
      ...(this.phone && { phone: this.phone }),
      ...(this.address && { address: this.address })
    };
  }

  // Очистка данных покупателя
  clear(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
    this.emit('customer:changed');
  }

  // Проверка, все ли данные заполнены
  isComplete(): boolean {
    return !!this.payment && !!this.email && !!this.phone && !!this.address;
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

  // Валидация отдельного поля
  validateField(field: keyof IBuyer): { isValid: boolean; error?: string } {
    const validation = this.validate();
    return {
      isValid: !validation.errors[field],
      error: validation.errors[field]
    };
  }
}
