
import { IProduct } from '../../types/index';
import {  EventEmitter } from "../base/Events";

export class Catalog extends EventEmitter  {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  
  

  // Сохранение массива товаров полученного в парметрах метода      8 спринт 5.введение в ОПП, урок 4 поля и методы 
  setProducts(products: IProduct[]): void {                        // сеттер (записать/установить данные)
    this.products = products;
    // Генерируем событие при изменении товаров
    this.emit('products:changed', this.products);
  }

  // Получение массива товаров из модели                 геттер(прочитать получить данные)
  getProducts(): IProduct[] {
    return this.products;
  }

  // Получение одного товара по его id
  getProductById(id: string): IProduct | null {                                // перебираю массив товаров по айди
    return this.products.find(product => product.id === id) || null;
  }

  // Сохранение товара для подробного отображения                       // 8спринт 5. введенеие в ООП, урок 3 синтаксис классов , методы класса    
  setSelectedProduct(product: IProduct): void {                                
    this.selectedProduct = product;    //генерируем событие при изменении данного товара
    this.emit('product:selected', this.selectedProduct);           //сохраняет один конкретный товар в  свойстве
  }

  // Получение товара для подробного отображения
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}