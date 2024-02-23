import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngxTemplate]',
  standalone: true
})
export class NgxTemplate {
  @Input() type : string = '' ;
  @Input('ngxTemplate') name : string = '';

  constructor(public template: TemplateRef<any>) 
  {
  }

  getType(): string {
    return this.name;
  }
}
