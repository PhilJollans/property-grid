import { ComponentRef, Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, Type, ViewContainerRef } from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import {PropertyItemMeta} from './property-item-meta';
import {PropertyValue} from './property-value';
import {IDynamicComponent} from './dynamic-component';

@Directive({
  selector: '[dynamicComponentLoad]',
  standalone: true
})
export class DynamicComponentLoadDirective implements OnInit, OnDestroy, OnChanges {
  private readonly _controlValueChangeFn: (value: any) => void;
  private component!: ComponentRef<IDynamicComponent<any>>;
  private propertyValue!: PropertyValue;
  private get componentType(): Type<PropertyValueAccess> {
    return this.meta.type as Type<PropertyValueAccess>;
  }

  @Input('dynamicComponentLoad') public meta!: PropertyItemMeta;
  @Input()
  public options: any;

  constructor(private entry: ViewContainerRef) {
    this._controlValueChangeFn = (value: any) => this.propertyValue.value = value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.propertyValue = new PropertyValue(changes['options'].currentValue, this.meta);
    }
  }

  ngOnInit() {
    this.buildComponent();
  }

  ngOnDestroy(): void {
    this.destroyComponent();
  }

  private buildComponent(): void {
    if (!this.componentType) {
      return;
    }
    try {
      this.destroyComponent();

      // this.entry.clear();
      // const componentFactory = this.componentFactoryResolver.resolveComponentFactory<PropertyValueAccess>(this.componentType);
      // const component = this.entry.createComponent(componentFactory, 0);

      // Modified because componentFactoryResolver is deprecated
      const component = this.entry.createComponent(this.componentType);

      this.initComponent(component);
      this.component = component;
    } catch (e) {
      console.error('load component error.');
      console.error(e);
    }
  }

  private initComponent(component: ComponentRef<PropertyValueAccess>) {
    component.instance.value = this.propertyValue.value;
    if (component.instance.registerOnChange) {
      component.instance.registerOnChange(this._controlValueChangeFn);
    }
    if (component.instance.valueChange) {
      component.instance.valueChange.subscribe(this._controlValueChangeFn);
    }

    if (this.meta.options) {
      Object.assign(component.instance, this.meta.options);
    }
    if ( this.meta.additional !== undefined )
    {
      (component.instance as any).additional = this.meta.additional;
    }
    if ( this.meta.dimension !== undefined )
    {
      (component.instance as any).dimension = this.meta.dimension;
    }
  }

  private destroyComponent(): void {
    if (this.component) {
      this.component.destroy();
    }
  }
}

interface PropertyValueAccess extends ControlValueAccessor, IDynamicComponent<any> {
}


