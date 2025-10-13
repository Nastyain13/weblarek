import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class Gallery extends Component<void> {
  protected Catalog: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.Catalog = ensureElement<HTMLElement>(".gallery");
  }

  setItems(nodes: HTMLElement[]): void {
    this.Catalog.replaceChildren(...nodes);
  }

  clear(): void {
    this.Catalog.replaceChildren();
  }
}