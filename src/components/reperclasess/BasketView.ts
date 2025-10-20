import { Component } from "../base/Component"; 
import { ensureElement } from "../../utils/utils"; 
import { EventEmitter } from "../base/Events";

interface IBasketView { 
    basketList: HTMLElement[];
    total: number; 
    state: boolean;
} 

export class BasketView extends Component<IBasketView> { 
    protected basketContainer: HTMLElement; 
    protected totalPrice: HTMLElement; 
    protected basketButton: HTMLButtonElement; 

    constructor(container: HTMLElement, protected events: EventEmitter) { 
        super(container); 
         
        this.basketContainer = ensureElement<HTMLElement>('.basket__list', this.container); 
        this.totalPrice = ensureElement<HTMLElement>('.basket__price', this.container); 
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container); 

        this.basketButton.addEventListener('click', () => 
            this.events.emit('order:open')
        ); 
    } 

    set basketList(items: HTMLElement[]) { 
        // Очищаем контейнер перед добавлением новых элементов
        this.basketContainer.innerHTML = '';
        this.basketContainer.replaceChildren(...items); 
    } 

    set total(value: number) { 
        this.totalPrice.textContent = `${value} синапсов`; 
    } 

    set state(value: boolean) { 
        if (value) { 
            // Корзина пуста - очищаем и показываем сообщение
            this.basketContainer.innerHTML = '';
            const emptyElement = document.createElement('p'); 
            emptyElement.style.color = 'rgba(255, 255, 255, 0.3)'; 
            emptyElement.textContent = 'Корзина пуста'; 
            this.basketContainer.append(emptyElement);
            this.basketButton.disabled = true; 
        } else { 
            // Корзина не пуста - кнопка активна
            this.basketButton.disabled = false; 
            
        } 
    } 
}