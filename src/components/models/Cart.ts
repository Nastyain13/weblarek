import { IProduct } from '../../types/index';
import { EventEmitter } from "../base/Events";

export class Cart extends EventEmitter {
  private items: IProduct[] = [];

 public getItems(): IProduct[] {
    return this.items;
  }

 public addItem(product: IProduct): void {
    
    if (product.price === null) {
      return;
    }
    
    
    if (!this.hasItem(product.id)) {
      this.items.push(product);
      this.emit('cart:changed');
    }
  }

  public removeItemById(productId: string): void {
    const index = this.items.findIndex(item => item.id === productId);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.emit('cart:changed'); 
    }
  }

 public clear(): void {
    this.items = [];
    this.emit('cart:changed'); 
  }

  public getTotalPrice(): number {
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