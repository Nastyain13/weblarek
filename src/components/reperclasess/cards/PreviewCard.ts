import { ensureElement } from "../../../utils/utils";
import { Card } from '../cards/card';
import { IProduct } from "../../../types";

interface IPreviewCard {                                                             //карточка предпросмотра
    product: IProduct;
    description: string;
}

export class PreviewCard extends Card<IPreviewCard> {
    protected descriptionElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, onAddToBasket?: () => void) {
        super(container);
        
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', this.container);
        
        if (onAddToBasket) {
            this.button.addEventListener('click', (event) => {
                event.preventDefault();
                onAddToBasket();
            });
        }
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }
}