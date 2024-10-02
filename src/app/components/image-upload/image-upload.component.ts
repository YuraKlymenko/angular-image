import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule, UntypedFormGroup} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent implements OnInit {
  @ViewChild('imagePreview') imagePreviewHTMLElement!: ElementRef<HTMLImageElement>;

  selectedImage: File | null = null;
  imageHeight: number = 0;
  imageWidth: number = 0;
  boundingBoxControlsForm = new UntypedFormGroup({
    height: new FormControl<number | null>(null),
    width: new FormControl<number | null>(null),
    xStarts: new FormControl<number | null>(null),
    yStarts: new FormControl<number | null>(null),
  });

  private subscription: Subscription = new Subscription();

  constructor() {}

  ngOnInit(): void {
    this.boundingBoxControlsForm.disable();
    this.initFormValueChanges();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleFileSelection(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      const img = new Image();

      reader.onload = (event: any) => {
        const result = event.target.result;

        this.selectedImage = result;
        img.src = result;
        img.onload = () => {
          this.imageWidth = img.width;
          this.imageHeight = img.height;
          this.boundingBoxControlsForm.enable();
        };
      };

      reader.readAsDataURL(file);
    }
  }

  private initFormValueChanges(): void {
    const xAxeStartStream$ = this.boundingBoxControlsForm.valueChanges.subscribe((formValues) => {
      if (!this.selectedImage) { return }

      this.checkXAxeStart(formValues.xStarts);
      this.checkYAxeStart(formValues.yStarts);
      this.checkBoxHeight(formValues.height);
      this.checkBoxWidth(formValues.width);
    });
    this.subscription.add(xAxeStartStream$);
  }

  private checkXAxeStart(startPosition: number): void {
    if (startPosition > this.imagePreviewHTMLElement.nativeElement.clientWidth) {
      alert('Box X axe is out of image. Reset to the beginning');
      this.boundingBoxControlsForm.get('xStarts')?.setValue(0);
    }
  }

  private checkYAxeStart(startPosition: number): void {
    if (startPosition > this.imagePreviewHTMLElement.nativeElement.clientHeight) {
      alert('Box Y axe is out of image. Reset to the beginning');
      this.boundingBoxControlsForm.get('yStarts')?.setValue(0);
    }
  }

  private checkBoxHeight(height: number): void {
    if (height > this.imagePreviewHTMLElement.nativeElement.clientHeight) {
      alert('Box height is out of image. Set the max.');
      this.boundingBoxControlsForm.get('height')?.setValue(this.imagePreviewHTMLElement.nativeElement.clientHeight);
    }
  }

  private checkBoxWidth(width: number): void {
    if (width > this.imagePreviewHTMLElement.nativeElement.clientWidth) {
      alert('Box width is out of image. Set the max.');
      this.boundingBoxControlsForm.get('width')?.setValue(this.imagePreviewHTMLElement.nativeElement.clientWidth);
    }
  }
}
