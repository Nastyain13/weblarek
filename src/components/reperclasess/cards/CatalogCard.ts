import { Card } from "./card";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";

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
                onSelect(this["id"]);
            });
        }
    }

   
    setCategory(category: string): void {
        this.categoryElement.textContent = category;
    }

    setImageSrc(src: string, alt: string): void {
        this.imageElement.src = src;
        this.imageElement.alt = alt;
    }
}