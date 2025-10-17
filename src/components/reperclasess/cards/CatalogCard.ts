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

    // Сеттер для изображения  
    set image(value: string) {
        this.imageElement.src = value;
        this.imageElement.alt = this.titleElement?.textContent || '';
    }

    setImageSrc(src: string, alt: string): void {
        this.image = src;
        this.imageElement.alt = alt;
    }
}