import { Component, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PropertyGridComponent } from './property-grid/property-grid.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { FormsModule } from '@angular/forms';
import { meta } from './property-item-meta';
import { IDynamicComponent } from './dynamic-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PropertyGridComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    NgxJsonViewerModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public student: ExampleStudentOptions = new ExampleStudentOptions();

  constructor() {
  }

  public get data(): string {
      return JSON.parse(JSON.stringify(this.student));
  }

  text: string = '';
}


@Component({
  selector: 'app-text-editor',
  template: `<input type="text" [value]="value" (change)="valueChange.emit($event.target.value)"/>`
})
export class SimpleTextEditorComponent implements IDynamicComponent<string> {
  value : string = '' ;
  valueChange: EventEmitter<string> = new EventEmitter<string>();
}

export class ExampleEditorOptions {
  @meta({
      name: 'Font', description: 'The font editor to use', colSpan2: false,
      type: SimpleTextEditorComponent, group: 'Editor', hidden: false
  })
  font = 'Source Code Pro';

  @meta({name: 'Font size', group: 'Editor', valueConvert: parseInt, type: 'fontSize'})
  fontSize = 14;

  @meta({name: 'Font color', group: 'Editor', type: 'color'})
  fontColor = '#51f41c';

  @meta({name: 'jQuery', group: 'Plugins', type: MatCheckbox})
  jQuery = true;

  @meta({name: 'Card Style', group: 'Style', type: MatCheckbox})
  cardStyle = true;

  @meta({
      name: 'modernizr',
      description: 'Whether or not to include modernizr on the page',
      group: 'Plugins',
      type: MatSlideToggle
  })
  modernizr = false;

  @meta({
      name: 'Framework',
      description: 'Whether to include any additional framework',
      type: 'options',
      options: ['None', {text: 'AngularJS', value: 'angular'}, {text: 'Backbone.js', value: 'backbone'}]
  })
  framework = 'None';

}

export class ExampleStudentOptions {

  @meta({name: 'Birth', group: 'Basic Information', type: 'date', order: 4})
  birth = '2018-05-08';

  @meta({name: 'Name', group: 'Basic Information', type: 'text', order: 1, link: 'http://www.baidu.com'})
  name = 'Lily';

  @meta({name: 'Age', group: 'Basic Information1', valueConvert: parseInt, type: 'text', order: 2})
  age = 19;

  @meta({name: 'Id', group: 'Basic Information1', type: 'text', order: 3, additional: { disabled: true }})
  id = '123456789';

  @meta({name: 'Telephone', type: 'telephone', group: 'Basic Information1', hidden: true})
  telephone = '';

  @meta({name: 'Gender', group: 'Basic Information', type: 'sex', order: 3})
  gender = 'male';

  @meta({name: 'Editor Preference', type: 'subItems', collapse: true, hidden: (s: ExampleStudentOptions) => s.gender === 'male' })
  editor: ExampleEditorOptions = new ExampleEditorOptions();
}
