import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

/**
 * Интерфейс для данных заголовка
 * @property {number} counter - количество товаров в корзине
 */
interface IHeader {
    counter: number;
}

/**
 * Класс компонента заголовка страницы
 * Отвечает за отображение счетчика корзины и обработку клика по корзине
 */
export class Header extends Component<IHeader> {
    protected counterElement: HTMLElement;
    protected basketButton: HTMLButtonElement;

    
    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        
        this.counterElement = ensureElement<HTMLElement>('.header_basket-counter', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header_basket', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    /**
     * Устанавливает значение счетчика корзины
     * @param {number} value - новое значение счетчика
     */
    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}