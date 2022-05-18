import {Directive, ElementRef, HostListener, Input} from "@angular/core";

@Directive({
  selector: '[hoverColor]'
})
export class HoverDirective {
  @Input() hoverColor!: string
  constructor(private el: ElementRef) {
  }

  @HostListener('mouseover') onMouseOver() {
    this.onHover(this.hoverColor);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.onHover('');
  }

  private onHover(color: string) {
    this.el.nativeElement.style.color = color;
    this.el.nativeElement.style.transition = '0.4s all ease-in-out'
  }
}
