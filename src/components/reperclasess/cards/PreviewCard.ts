import { Card } from "./card";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";

export class PreviewCard extends Card<IProduct> {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected imageElement: HTMLImageElement; 
    protected Cart: boolean = false;
    protected onButtonClick?: (id: string) => void;

    constructor(container: HTMLElement, onButtonClick?: (id: string) => void) {
        super(container);
        
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container); 
        this.onButtonClick = onButtonClick;

        this.buttonElement.addEventListener('click', (e) => {
            e.preventDefault();      
            e.stopPropagation();    
            if (this.onButtonClick) {
                this.onButtonClick(this._id);
            }
        });
    }

    
    set image(value: string) {
        this.imageElement.src = value;
        this.imageElement.alt = this.titleElement?.textContent || '';
        
       
        this.imageElement.onerror = () => {
            console.error('Ошибка загрузки изображения в предпросмотре:', value);
        };
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set cart(inCart: boolean) {
        this.Cart = inCart;
        this.buttonElement.textContent = inCart ? "Удалить из корзины" : "В корзину";
        this.buttonElement.classList.toggle("button_alt", inCart);
    }

    set priceless(isPriceless: boolean) {
        this.buttonElement.disabled = isPriceless;
        this.buttonElement.textContent = isPriceless ? "Недоступно" : "В корзину";
        if (isPriceless) {
            this.buttonElement.classList.add('button_disabled');
        } else {
            this.buttonElement.classList.remove('button_disabled');
        }
    }

    
}