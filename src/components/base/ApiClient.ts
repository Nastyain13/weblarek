
import { IApi, IProduct, IOrderData, IOrderResult, IProductsResponse } from '../../types';

export class ApiClient {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProduct[]> {
    try {
      console.log(' Запрос товаров с сервера...');
      const response: IProductsResponse = await this.api.get('/product/');
      console.log(' Товары получены с сервера');
      return response.items;
    } catch (error) {
      console.error(' Ошибка при получении товаров:', error);
      throw error;
    }
  }

  async createOrder(orderData: IOrderData): Promise<IOrderResult> {
    try {
      console.log(' Отправка заказа на сервер...');
      const response: IOrderResult = await this.api.post('/order/', orderData);
      console.log(' Заказ успешно создан');
      return response;
    } catch (error) {
      console.error(' Ошибка при создании заказа:', error);
      throw error;
    }
  }
}
