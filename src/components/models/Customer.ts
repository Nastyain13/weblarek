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
      // Генерируем событие при изменении данных
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
  
  // Получение текущих данных (без обязательных полей)
  public getCurrentData(): Partial<IBuyer> {
    return this.getData();
  }

  // Очистка данных покупателя 
  public clear(): void { 
    this.payment = null; 
    this.email = ''; 
    this.phone = ''; 
    this.address = ''; 
    this.emit('customer:changed', this.getData()); 
  } 
 
  
// Валидация только для формы заказа
  public validateOrder(): IValidationResult { 
    const errors: IValidationResult['errors'] = {}; 

    if (!this.payment) { 
      errors.payment = "Выберите способ оплаты";
    }

    if (!this.address.trim()) { 
      errors.address = "Необходимо указать адрес";
    }

    
    return { 
      isValid: Object.keys(errors).length === 0, 
      errors 
    }; 
  }

  // Валидация только для формы контактов
  public validateContacts(): IValidationResult { 
    const errors: IValidationResult['errors'] = {}; 

    if (!this.email.trim()) { 
      errors.email = "Введите  e-mail";
    }

    if (!this.phone.trim()) { 
      errors.phone = "Введите  телефон";
    }

    return { 
      isValid: Object.keys(errors).length === 0, 
      errors 
    }; 
  }
}
