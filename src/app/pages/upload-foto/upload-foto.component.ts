import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Inject
} from '@angular/core';
import {
  LyImageCropper,
  ImgCropperConfig,
  ImgCropperEvent,
} from '@alyle/ui/image-cropper';
import { StyleRenderer, lyl } from '@alyle/ui';
import { DOCUMENT } from '@angular/common';

const styles = () => {
  return {
    cropper: lyl`{
      height: 300px
    }`,
    flex: lyl`{
      flex: 1
    }`,
  };
};

@Component({
  selector: 'upload-foto-component',
  templateUrl: './upload-foto.component.html',
  styleUrls: ['./upload-foto.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StyleRenderer],
})
export class UploadFotoComponent implements OnInit {
  window? : (Window & typeof globalThis) | null;
  classes = this.sRenderer.renderSheet(styles);
  croppedImage?: string;
  ready: boolean = false;
  @ViewChild(LyImageCropper, { static: true })
  readonly cropper!: LyImageCropper;
  result: string = '';
  myConfig: ImgCropperConfig = {
    width: 250, // Default `250`
    height: 250, // Default `200`,
    output: {
      width: 250,
      height: 250,
    },
  };

  onCropped(e: ImgCropperEvent) {
    this.croppedImage = e.dataURL;
    this.scrollToTop();
    console.log(e);
  }

  selectInput(e: Event) {
    console.log('selectInput');
    this.cropper.selectInputEvent(e);
    setTimeout(() => {
      this.cropper.center();
      this.scrollToBottom();
      console.log('this.cropper.center();');
    }, 500);
  }

  constructor(readonly sRenderer: StyleRenderer, @Inject(DOCUMENT) private _document: Document) {}

  ngOnInit(): void {
    this.window = this._document.defaultView;
  }

  enviar() {
    if (this.croppedImage) console.log('enviar', this.croppedImage);
  }

  scrollToBottom() {
    this.window!.scroll({top: 1000});
  }

  scrollToTop() {
    this.window!.scroll({top: 0});
  }
}
