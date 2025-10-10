import { ensureElement } from "../../utils/utils";
import { Card } from './cards/card';
import { IProduct } from "../../types";

interface IBasketCard {
    product: IProduct;
    index: number;
}
export class BasketCard extends Card<IBasketCard> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement; 

    constructor(container: HTMLElement, onDelete?: () => void) {
        super(container);
        
        
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        
        if (onDelete) {
            this.deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                onDelete();
            });
        }
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}
    