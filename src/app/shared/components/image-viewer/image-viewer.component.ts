import { Component, OnInit, Input, Output, EventEmitter, HostListener,} from "@angular/core";

@Component({
  selector: "app-image-viewer",
  templateUrl: "./image-viewer.component.html",
  styleUrls: ["./image-viewer.component.scss"],
})
export class ImageViewerComponent implements OnInit {
  rotationPoint: number = 0;
  pickedImage: any;

  @Input() images: any;
  @Output() closeWindow = new EventEmitter<any>();

  constructor() {}

  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "ArrowRight") {
      this.nextImage();
    } else if (event.key === "ArrowLeft") {
      this.previousPage();
    } else if (event.key === "Escape") {
      this.close();
    }
  }

  ngOnInit() {
    if (this.images && this.images.length) {
      this.pickedImage = this.images[0];
    }
  }

  nextImage() {
    this.rotationPoint = 0;
    if (this.images.indexOf(this.pickedImage) !== this.images.length - 1) {
      this.pickedImage = this.images[this.images.indexOf(this.pickedImage) + 1];
    } else {
      this.pickedImage = this.images[0];
    }
  }

  previousPage() {
    this.rotationPoint = 0;
    if (this.images.indexOf(this.pickedImage) !== 0) {
      this.pickedImage = this.images[this.images.indexOf(this.pickedImage) - 1];
    } else {
      this.pickedImage = this.images[this.images.length - 1];
    }
  }

  close() {
    this.closeWindow.emit();
  }
}
