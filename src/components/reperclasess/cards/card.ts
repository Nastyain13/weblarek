import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";


export abstract class Card<T extends IProduct> extends Component<T> {
    protected _id: string = '';
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement('.card__title', this.container);
        this.priceElement = ensureElement('.card__price', this.container);
    }

    
    set id(value: string) {
        this._id = value;
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value === null ? "Бесценно" : `${value} синапсов`;
    }

   
}