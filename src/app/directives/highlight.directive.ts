import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('mouseover') onMouseOver() {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', '#BEBEBE');
  }

  @HostListener('mouseout') onMouseOut() {
    this.renderer.removeStyle(this.el.nativeElement, 'backgroundColor');
  }
}
