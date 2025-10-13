import { ensureElement } from "../../../utils/utils";
import { Card } from './card';
import { IProduct } from "../../../types";

export class BasketCard extends Card<IProduct> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement; 
    

    constructor(container: HTMLElement, onDelete?: (id: string) => void)  {
        super(container);
        
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        
        
        if (onDelete) {
            this.deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                onDelete(this.id);
            });
        }
    }

    setIndex(index: number): void {
        if (this.indexElement) {
            this.indexElement.textContent = String(index);
        }
    }

}