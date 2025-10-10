import { Component } from "../../base/Component";                                    //базовый класс Карточки  товаров
import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { categoryMap, CDN_URL } from "../../../utils/constants";

export abstract class Card<T> extends Component<T> {
    protected id: string;
    protected titleElement: HTMLElement;
    protected imageElement?: HTMLImageElement;
    protected categoryElement?: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this.titleElement = ensureElement('.card__title', this.container);
        this.priceElement = ensureElement('.card__price', this.container);
        this.imageElement = this.container.querySelector('.card__image') || undefined;
        this.categoryElement = this.container.querySelector('.card__category') || undefined;
        this.id = '';
    }

    
    set product(data: IProduct) {
        this.setId(data.id);
        this.setTitle(data.title);
        this.setPrice(data.price);
        
        if (data.category) {
            this.setCategory(data.category);
        }
        
        if (data.image) {
           
            const fullImageUrl = `${CDN_URL}/${data.image}`;
            this.setImageSrc(fullImageUrl, data.title);
        }
    }

    setId(id: string): void {
        this.id = id;
        this.container.dataset.id = id;
    }

    setTitle(title: string): void {
        this.titleElement.textContent = title;
    }

    
    setImageSrc(src: string, alt?: string): void {
        if (this.imageElement) {
            super.setImage(this.imageElement, src, alt ?? "");
        }
    }

    setCategory(category: string): void {
        if (this.categoryElement) {
            this.categoryElement.textContent = category;
            this.categoryElement.className = "card__category";
            const modifier = categoryMap[category as keyof typeof categoryMap] ?? "other";
            this.categoryElement.classList.add(`card__category_${modifier}`);
        }
    }

    setPrice(price: number | null): void {
        this.priceElement.textContent = price === null ? "Бесценно" : `${price} синапсов`;
    }

    onClick(handler: (id: string) => void): void {
        this.container.addEventListener("click", () => handler(this.id));
    }

}
          