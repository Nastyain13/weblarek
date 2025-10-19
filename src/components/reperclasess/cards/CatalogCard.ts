import { Card } from "./card";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants"; 

export class CatalogCard extends Card<IProduct> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, onSelect?: (id: string) => void) {
        super(container);
        
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        // ВАЖНО: ОЧИСТИТЬ СТАТИЧЕСКОЕ ИЗОБРАЖЕНИЕ
        this.imageElement.src = '';
        this.imageElement.alt = '';

        if (onSelect) {
            this.container.addEventListener("click", (e) => {
                e.preventDefault();
                onSelect(this._id);
            });
        }
    }

    set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
            this.categoryElement.className = "card__category";
            
            const modifier = categoryMap[value as keyof typeof categoryMap] || categoryMap['другое'];
            this.categoryElement.classList.add(modifier);
        }
    }

    

    // ДОБАВИТЬ сеттер для image
    set image(value: string) {
        if (this.imageElement) {
            this.imageElement.src = value;
            // Alt будет установлен автоматически из title
            this.imageElement.alt = this.titleElement?.textContent || 'Product image';
        }
    }
}