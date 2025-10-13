import { Component } from "../../../components/base/Component";
import { ensureElement } from "../../../utils/utils";

export abstract class Form<T> extends Component<void> {
  protected formElement: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorContainer: HTMLElement;

  constructor(
    container: HTMLElement,
    onFormSubmit?: () => void,
    onFormChange?: (formData: Partial<T>) => void
  ) {
    super(container);
    
    // Определяем основной элемент формы
    this.formElement = container instanceof HTMLFormElement
      ? container
      : ensureElement<HTMLFormElement>("form", container);
    
    // Находим кнопку отправки
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container
    );
    
    // Находим контейнер для ошибок
    this.errorContainer = ensureElement<HTMLElement>(".form__errors", container);

    // Обработчик отправки формы
    if (onFormSubmit) {
      this.formElement.addEventListener("submit", (event) => {
        event.preventDefault();
        onFormSubmit();
      });
    }

    // Обработчик изменений в форме
    if (onFormChange) {
      this.formElement.addEventListener("input", () => 
        onFormChange(this.getFormData())
      );
    }
  }

  // Блокировка/разблокировка кнопки отправки
  toggleSubmitButton(disabled: boolean): void {
    this.submitButton.disabled = disabled;
  }

  
  setDisabled(disabled: boolean): void {
    this.toggleSubmitButton(disabled);
  }

  setErrors(errors: Record<string, string>): void {
    const errorMessages = Object.values(errors).filter(Boolean);
    this.errorContainer.textContent = errorMessages.join("\n");
    this.errorContainer.style.display = errorMessages.length > 0 ? 'block' : 'none';
  }

  // Очистка ошибок
  clearErrors(): void {
    this.errorContainer.textContent = '';
    this.errorContainer.style.display = 'none';
  }

  // Абстрактный метод для получения данных формы
  protected abstract getFormData(): Partial<T>;
}