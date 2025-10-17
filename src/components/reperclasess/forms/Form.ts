import { Component } from "../../../components/base/Component";
import { ensureElement } from "../../../utils/utils";

export class Form<T> extends Component<void> {
  protected formElement: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorContainer: HTMLElement;

  constructor(
    container: HTMLElement,
    onFormSubmit?: () => void
  ) {
    super(container);
    
    this.formElement = container instanceof HTMLFormElement
      ? container
      : ensureElement<HTMLFormElement>("form", container);
    
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container
    );
    
    this.errorContainer = ensureElement<HTMLElement>(".form__errors", container);

    if (onFormSubmit) {
      this.formElement.addEventListener("submit", (event) => {
        event.preventDefault();
        onFormSubmit();
      });
    }

  }

  set disabled(value: boolean) {
    this.submitButton.disabled = value;
  }

  set errors(value: Record<string, string>) {
    const errorMessages = Object.values(value).filter(Boolean);
    this.errorContainer.textContent = errorMessages.join("\n");
    this.errorContainer.style.display = errorMessages.length > 0 ? 'block' : 'none';
  }
}