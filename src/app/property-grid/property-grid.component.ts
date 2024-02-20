import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, Input, QueryList, TemplateRef, ViewChildren, Type } from '@angular/core';
import { InternalGroup } from './InternalGroup';
import { NgxTemplate } from '../template.directive';
import { PropertyItemMeta } from '../property-item-meta';
import { PropertyValue } from '../property-value';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ngx-property-grid',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './property-grid.component.html',
  styleUrl: './property-grid.component.scss'
})
export class PropertyGridComponent implements AfterContentInit, AfterViewInit {
  private _options: any;
  private _meta: any;
  private _templateLoaded = false;
  public get templateLoaded(): boolean {
    return this._templateLoaded;
  }

  public readonly isInternal: boolean = false;

  @Input()
  public templateMap! : { [key: string]: TemplateRef<any> };

  @Input()
  public collapse = true;

  @Input()
  width! : string | number;


  @Input()
  labelWidth: string | number = '120px';

  @Input()
  cardStyle = true;

  @Input()
  groupCollapse = false;

  @Input()
  showHelp = true;

  @Input()
  public set meta(v: any) {
    this._meta = v;
    this.initMeta();
  }

  public get meta(): any {
    return this._meta;
  }

  @Input()
  public set options(v: any) {
    this._options = v;
    if (v.__meta__) {
      this.meta = v.__meta__;
    }
  }

  public get options(): any {
    return this._options;
  }

  @ViewChildren(NgxTemplate) defaultTemplates! : QueryList<NgxTemplate>;
  @ContentChildren(NgxTemplate) templates! : QueryList<NgxTemplate>;

  public groups! : InternalGroup[];
  public subItems! : PropertyItemMeta[];

  constructor(el: ElementRef<HTMLElement>, private cdr: ChangeDetectorRef) {
    this.isInternal = el.nativeElement.parentElement && el.nativeElement.parentElement.classList &&
      el.nativeElement.parentElement.classList.contains('internal-property-grid') || false;
  }

  ngAfterViewInit(): void {
    if (this.isInternal) {
      this._templateLoaded = true;
    } else {
      if (this.defaultTemplates) {
        this.defaultTemplates.forEach((item) => {
          if (!this.templateMap.hasOwnProperty(item.name)) {
            this.templateMap[item.name] = item.template;
          }
        });
        this._templateLoaded = true;
        this.cdr.detectChanges();
      }
    }
  }

  ngAfterContentInit(): void {
    if (!this.isInternal) {
      if (!this.templateMap) {
        this.templateMap = {};
      }
      this.templates.forEach((item) => {
        this.templateMap[item.name] = item.template;
      });
    }
  }

  public openLink(link: string) {
    if (link) {
      window.open(link, '_blank');
    }
  }

  public getTemplate(type: string): TemplateRef<any> | undefined {
    if (typeof type === 'string' && this.templateMap) {
      return type ? this.templateMap[type] : this.templateMap['default'];
    } else {
      return undefined;
    }
  }

  public controlType(meta: PropertyItemMeta): 'template' | 'dynamicComponent' | 'templateNotFound' {
    if (meta.type instanceof Type) {
      return 'dynamicComponent';
    }
    if (typeof meta.type === 'string' && this.getTemplate(meta.type)) {
      return 'template';
    }
    return 'templateNotFound';
  }

  public hidden(meta: PropertyItemMeta): boolean {
    if (typeof meta.hidden === 'boolean') {
      return meta.hidden;
    }
    if (typeof meta.hidden === 'function') {
      return meta.hidden(this._options);
    }
    return false;
  }

  public propertyValue(meta: PropertyItemMeta): PropertyValue {
    return new PropertyValue(this.options, meta);
  }

  public toggle(): void {
    this.collapse = !this.collapse;
  }

  private initMeta(): void {
    const meta: { [key: string]: PropertyItemMeta }  = this.meta;
    if (!meta) {
      this.subItems = [];
      return;
    }

    const groups: InternalGroup[] = [new InternalGroup(undefined)];
    const subItems: PropertyItemMeta[] = [];
    for (const i in meta) {
      if (!meta.hasOwnProperty(i)) {
        continue;
      }
      const v: PropertyItemMeta = meta[i] ;
      if (v.type === 'subItems') {
        subItems.push(v);
        continue;
      }

      let group = groups.find(o => o.name === v.group);
      if (!group) {
        group = new InternalGroup(v.group);
        groups.push(group);
      }
      group.items.push(v);
    }

    groups.forEach(o => o.items.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return 0;
    }));

    this.groups = groups.filter(o => o.items.length > 0);
    this.subItems = subItems;
  }

  optionLabel(v: any): string {
    if (typeof v === 'string') {
      return v;
    }
    if (v.text) {
      return v.text;
    }
    if (v.label) {
      return v.label;
    }
    return v;
  }

  optionValue(v: any): any {
    return v && v.value ? v.value : v;
  }
}
