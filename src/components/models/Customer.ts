
import { IBuyer, IValidationResult, TPayment } from '../../types/index';
export class Customer {
  private payment: TPayment | null = null;
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  // Сохранение данных покупателя (общий метод)
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
  }

  // Сохранение отдельных полей
  setPayment(payment: TPayment): void {
    this.payment = payment;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  setAddress(address: string): void {
    this.address = address;
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

