export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Интерфейс должен соответствовать классу Api
export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Тип для способов оплаты
export type TPayment = 'card' | 'cash' | 'online';

// Структура товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Данные покупателя
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Результат проверки данных формы заказа
export interface IValidationResult {
  isValid: boolean;
  errors: {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
}

// Полезные данные заказа
export interface IOrderData {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[]; // Массив ID выбранных товаров
}

// Итоговая структура результата успешного оформления заказа
export interface IOrderResult {
  id: string;
  total: number;
}

// Ответ сервера с товарами
export interface IProductsResponse {
  items: IProduct[];
}
