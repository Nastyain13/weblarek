import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

// Интерфейс для данных корзины
interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, onCheckout: () => void) {
        super(container);
        
        this._list = ensureElement('.basket__list', this.container);
        this._total = ensureElement('.basket__price', this.container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        
        if (onCheckout) {
            this._button.addEventListener('click', onCheckout);
        }
    }

    
    set items(items: HTMLElement[]) {
        if (this._list) {
            this._list.innerHTML = '';
            items.forEach(item => {
                this._list.appendChild(item);
            });
        }
    }

    set total(total: number) {
        if (this._total) {
            this._total.textContent = `${total} синапсов`;
        }
    }
}
