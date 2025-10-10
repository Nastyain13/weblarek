import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IProduct } from "../../types";

export class CatalogCard extends Component<void> {
  protected gallery: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.gallery = ensureElement<HTMLElement>(".gallery");
  }
  // Добавляем метод renderProducts
  renderProducts(products: IProduct[]): void {
    const productElements = products.map(product => this.createProductElement(product));
    this.setItems(productElements);
  }

  // Создаем элемент товара
  private createProductElement(product: IProduct): HTMLElement {
    const element = document.createElement('div');
    element.className = 'card';
    element.innerHTML = `
      <h3>${product.title}</h3>
      <p>Цена: ${product.price} ₽</p>
      <p>Категория: ${product.category}</p>
    `;
    return element;
  }

  setItems(nodes: HTMLElement[]): void {
    this.gallery.replaceChildren(...nodes);
  }

  clear(): void {
    this.gallery.replaceChildren();
  }
}