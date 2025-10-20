import { Component } from "../base/Component"; 
import { ensureElement } from "../../utils/utils"; 
 
export class Modal extends Component<void> { 
    protected contentElement: HTMLElement; 
    protected closeButton: HTMLButtonElement; 
    protected isOpen: boolean = false;
    protected onCloseCallback?: () => void;
    protected handleEscape: (event: KeyboardEvent) => void;

    constructor(container: HTMLElement, onClose?: () => void) { 
        super(container); 
         
        this.contentElement = ensureElement<HTMLElement>(".modal__content", container); 
        this.closeButton = ensureElement<HTMLButtonElement>(".modal__close", container); 
        this.onCloseCallback = onClose;
        this.handleEscape = this.createEscapeHandler();
         
        this.setupEventListeners(); 
    } 

    protected createEscapeHandler(): (event: KeyboardEvent) => void {
        return (event: KeyboardEvent) => { 
            if (event.key === "Escape") { 
                this.close(); 
            } 
        };
    }
 
    setupEventListeners(): void { 
        // Закрытие по кнопке 
        this.closeButton.addEventListener("click", (event) => { 
            event.preventDefault(); 
            this.close(); 
        }); 
 
        // Закрытие по клику на оверлей 
        this.container.addEventListener("click", (event) => { 
            if (event.target === this.container) { 
                this.close(); 
            } 
        }); 
    } 
 
    open(content: HTMLElement): void { 
        // Блокируем скроллинг страницы 
        document.body.style.overflow = 'hidden'; 
         
        this.contentElement.innerHTML = ''; 
        this.contentElement.appendChild(content); 
        this.container.classList.add("modal_active"); 
        this.isOpen = true;

        // Добавляем слушатель ESC только при открытии
        document.addEventListener("keydown", this.handleEscape); 
    } 
 
    close(): void { 
        if (!this.isOpen) return;
        
        // Восстанавливаем скроллинг страницы 
        document.body.style.overflow = ''; 
         
        this.container.classList.remove("modal_active"); 
        this.contentElement.innerHTML = ''; 
        this.isOpen = false;

        // Удаляем слушатель ESC при закрытии
        document.removeEventListener("keydown", this.handleEscape);

        // Вызываем callback если он есть
        this.onCloseCallback?.(); 
    } 
}