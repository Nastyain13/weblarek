import { IProduct } from '../../types/index';
import { EventEmitter } from "../base/Events";

export class Cart extends EventEmitter {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.emit('cart:changed'); 
  }

 
  removeItemById(productId: string): void {
    const index = this.items.findIndex(item => item.id === productId);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.emit('cart:changed'); 
    }
  }

  clear(): void {
    this.items = [];
    this.emit('cart:changed'); 
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }

  getItemsCount(): number {
    return this.items.length;
  }

  hasItem(productId: string): boolean {
    return this.items.some(item => item.id === productId);
  }
}