import { Component, EventEmitter } from '@angular/core';
import { IDynamicComponent } from '../dynamic-component';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [],
  templateUrl: './simple-text-editor.component.html',
  styleUrl: './simple-text-editor.component.scss'
})
export class SimpleTextEditorComponent implements IDynamicComponent<string>
{
  value : string = '' ;
  valueChange: EventEmitter<string> = new EventEmitter<string>();

  onInputChange(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.valueChange.emit(event.target.value);
    }
  }
}
