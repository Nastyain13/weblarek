import { Card } from "./card";                 
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";

export class CatalogItem extends Card<IProduct> {       // карточка в каталоге
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        this.buttonElement= ensureElement<HTMLButtonElement>('.card__button', container);
    }

    // Установка состояния корзины
    setInCart(inCart: boolean): void {
        this.buttonElement.textContent = inCart ? "Убрать" : "В корзину";
        this.buttonElement.classList.toggle('button_alt', inCart);
    }

    // Обработчик добавления в корзину
    onAddToCart(handler: (id: string) => void): void {
        this.buttonElement.addEventListener('click', (event) => {
            event.stopPropagation();
            handler(this.id);
        });
    }

    // Рендер данных товара
    render(data: IProduct): HTMLElement {
        this.product = data; // Используем сеттер из базового класса
        return this.container;
    }
}