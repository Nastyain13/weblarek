import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class Modal extends Component<void> {
    protected contentElement: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected isOpen: boolean = false;

    constructor(container: HTMLElement, onClose?: () => void) {
        super(container);
        
        this.contentElement = ensureElement<HTMLElement>(".modal__content", container);
        this.closeButton = ensureElement<HTMLButtonElement>(".modal__close", container);
        
        this.setupEventListeners(onClose);
    }

    private setupEventListeners(onClose?: () => void): void {
        // Закрытие по кнопке
        this.closeButton.addEventListener("click", (event) => {
            event.preventDefault();
            this.close();
            onClose?.();
        });

        // Закрытие по клику на оверлей
        this.container.addEventListener("click", (event) => {
            if (event.target === this.container) {
                this.close();
                onClose?.();
            }
        });

        // Закрытие по ESC
        document.addEventListener("keydown", (event) => {
            if (this.isOpen && event.key === "Escape") {
                this.close();
                onClose?.();
            }
        });
    }

    open(content: HTMLElement): void {
        
        this.contentElement.innerHTML = '';
        this.contentElement.appendChild(content);
        this.container.classList.add("modal_active");
        this.isOpen = true;
    }

    close(): void {
        this.container.classList.remove("modal_active");
        this.contentElement.innerHTML = '';
        this.isOpen = false;
    }
}