import { Card } from './card';
import { IProduct } from '../../types';
//import { ensureElement } from "../../utils/utils";
// товар в каталоге
// CatalogItem.ts - ДЛЯ КАТАЛОГА
export class CatalogItem extends Card<IProduct> {
    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        this.container.addEventListener('click', onClick);
    }
    // НИЧЕГО больше!
}
/** 
//export class CatalogItem extends Card<IProduct> {
  //protected ButtonElement: HTMLButtonElement;
  protected Element?: HTMLElement | null;

  constructor(container: HTMLElement, onRemove?: (id: string) => void) {
    super(container);
    this.Element = container.querySelector<HTMLElement>(".basket__item-index");
    this.ButtonElement = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container
    );
    if (onRemove) {
      this.ButtonElement.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove(this["id"]);
      });
    }
  }

  setIndex(index: number): void {
    if (this.Element) {
      this.Element.textContent = String(index);
    }
  }
}
*/
