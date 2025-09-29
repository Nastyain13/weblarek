import { IProduct } from '../../types/index';
// Хранит массив товаров, выбранных покупателем для покупки

export class Cart {
  private items: IProduct[] = [];

  // Получение массива товаров, которые находятся в корзине
  getItems(): IProduct[] {
    return this.items;
  }

  // Добавление товара, который был получен в параметре, в массив корзины
  addItem(product: IProduct): void {
    this.items.push(product);
  }

  // Удаление товара, полученного в параметре из массива корзины
  removeItem(product: IProduct): void {
    const index = this.items.findIndex(item => item.id === product.id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  // Очистка корзины
  clear(): void {
    this.items = [];
  }

  // Получение стоимости всех товаров в корзине
  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }

  // Получение количества товаров в корзине
  getItemsCount(): number {
    return this.items.length;
  }

  // Проверка наличия товара в корзине по его id, полученного в параметр метода
  hasItem(productId: string): boolean {
    return this.items.some(item => item.id === productId);
  }
}