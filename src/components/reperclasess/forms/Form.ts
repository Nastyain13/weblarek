import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsContainer: HTMLElement;
    protected formElement: HTMLFormElement;

    constructor(container: HTMLFormElement) {
        super(container);
        
        this.formElement = container;
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errorsContainer = ensureElement<HTMLElement>('.form__errors', this.container);
    }

  
    setDisabled(disabled: boolean): void {
        this.submitButton.disabled = disabled;
    }

    setErrors(errors: Record<string, string>): void {
        const errorMessages = Object.values(errors).filter(Boolean);
        this.errorsContainer.textContent = errorMessages.join(', ');
    }

    protected abstract validate(): boolean;
}