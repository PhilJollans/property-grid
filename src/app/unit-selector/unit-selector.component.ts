import { AfterContentInit, AfterViewInit, Component, EventEmitter, OnInit } from '@angular/core';
import { IDynamicComponent } from '../dynamic-component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unit-selector',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './unit-selector.component.html',
  styleUrl: './unit-selector.component.scss'
})
export class UnitSelectorComponent implements IDynamicComponent<string>, AfterContentInit, AfterViewInit, OnInit
{
  // for IDynamicComponent
  value : string = '' ;
  valueChange: EventEmitter<string> = new EventEmitter<string>();

  unitList : string[] = [] ;

  constructor() 
  {
    console.log('constructor');
  }

  ngOnInit(): void 
  {
    if ('dimension' in this) 
    {
      switch ( this.dimension )
      {
        case 'speed':
          this.unitList = [ 'm/s', 'km/h', 'ft/s', 'mph' ];
          break ;
        case 'distance':
          this.unitList = [ 'm', 'km', 'ft', 'miles' ];
          break ;
        case 'acceleration':
          this.unitList = [ 'm/s^2', 'g' ];
          break ;
      }
    }

    console.log('ngOnInit');
  }

  ngAfterViewInit(): void 
  {
    console.log('ngAfterViewInit');
  }

  ngAfterContentInit(): void 
  {
    console.log('ngAfterContentInit');
  }

  onInputChange(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.valueChange.emit(event.target.value);
    }
  }
}
