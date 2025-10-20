import { Card } from "./card"; 
import { IProduct } from "../../../types"; 
import { ensureElement } from "../../../utils/utils"; 
import { categoryMap } from "../../../utils/constants"; 
 
export class PreviewCard extends Card<IProduct> { 
    protected descriptionElement: HTMLElement; 
    protected buttonElement: HTMLButtonElement; 
    protected imageElement: HTMLImageElement;  
    protected categoryElement: HTMLElement; 
    protected onButtonClick?: (id: string) => void; 
 
    constructor(container: HTMLElement, onButtonClick?: (id: string) => void) { 
        super(container); 
         
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container); 
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container); 
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);  
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container); 
        this.onButtonClick = onButtonClick; 
 
        this.buttonElement.addEventListener('click', (e) => { 
            e.preventDefault();       
            e.stopPropagation();     
            if (this.onButtonClick) { 
                this.onButtonClick(this._id); 
            } 
        }); 
    } 
 
    set category(value: string) { 
        if (this.categoryElement) { 
            this.categoryElement.textContent = value; 
            this.categoryElement.className = "card__category"; 
            const modifier = categoryMap[value as keyof typeof categoryMap] || categoryMap['другое']; 
            this.categoryElement.classList.add(modifier); 
        } 
    } 
 
    set image(value: string) { 
        this.imageElement.src = value; 
        this.imageElement.alt = this.titleElement?.textContent || ''; 
    } 
 
    set description(value: string) { 
        this.descriptionElement.textContent = value; 
    } 
 
    // Вместо хранения состояния, принимаем параметры для отображения
    setButtonState(inCart: boolean, isPriceless: boolean): void {
        if (isPriceless) { 
            // Товар недоступен 
            this.buttonElement.textContent = 'Недоступно'; 
            this.buttonElement.disabled = true; 
            this.buttonElement.classList.add('button_disabled'); 
        } else if (inCart) { 
            // Товар в корзине - показываем "Удалить из корзины" 
            this.buttonElement.textContent = 'Удалить из корзины'; 
            this.buttonElement.disabled = false; 
            this.buttonElement.classList.remove('button_disabled'); 
        } else { 
            // Товар доступен и не в корзине - показываем "В корзину" 
            this.buttonElement.textContent = 'Купить'; 
            this.buttonElement.disabled = false; 
            this.buttonElement.classList.remove('button_disabled'); 
        } 
    }
}