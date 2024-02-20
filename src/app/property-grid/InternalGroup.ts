import { PropertyItemMeta } from "../property-item-meta";

export class InternalGroup {
  public readonly items: PropertyItemMeta[] = [];
  public type = 'group';

  public state = true;

  public toggle(): void {
    this.state = !this.state;
  }

  constructor(public name: string|undefined) {
  }
}
