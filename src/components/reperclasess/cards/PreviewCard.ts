import { Card } from "./card";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";

export class PreviewCard extends Card<IProduct> {
    protected descriptionElement: HTMLElement;    // Элемент описания товара
    protected buttonElement: HTMLButtonElement;   // Кнопка "В корзину/Удалить"
    protected Cart: boolean = false;           // Флаг наличия в корзине
    protected onButtonClick?: (id: string) => void; // Колбэк для кнопки

    constructor(container: HTMLElement, onButtonClick?: (id: string) => void) {
        super(container);
        
        // Находим  элементы
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.onButtonClick = onButtonClick;

        this.buttonElement.addEventListener('click', (e) => {
            e.preventDefault();      
            e.stopPropagation();    
            if (this.onButtonClick) {
                this.onButtonClick(this.id); 
            }
        });
    }

    // Установка описания товара
    setDescription(text: string): void {
        this.descriptionElement.textContent = text;
    }

    // Изменение состояния кнопки в зависимости от корзины
    setCart(inCart: boolean): void {
        this.Cart = inCart;
        this.buttonElement.textContent = inCart ? "Удалить" : "В корзину";
        this.buttonElement.classList.toggle("button_alt", inCart);
    }

    
}
