import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";

export abstract class Card <T extends IProduct
> extends Component<T>{
    protected id: string;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.id = '';
        this.titleElement = ensureElement('.card__title', this.container);
        this.priceElement = ensureElement('.card__price', this.container);
        
    }

    // Общие методы для всех карточек
    setId(id: string): void { 
        this.id = id; 
        this.container.dataset.id = id; 
    } 


    setTitle(title: string): void {
        this.titleElement.textContent = title;
    }

    setPrice(price: number | null): void {
        this.priceElement.textContent = price === null ? "Бесценно" : `${price} синапсов`;
    }

    onClick(handler: (id: string) => void): void {
        this.container.addEventListener("click", () => handler(this.id));
    }
}