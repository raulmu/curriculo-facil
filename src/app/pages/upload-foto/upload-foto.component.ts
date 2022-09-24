import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Inject,
} from '@angular/core';
import {
  LyImageCropper,
  ImgCropperConfig,
  ImgCropperEvent,
} from '@alyle/ui/image-cropper';
import { StyleRenderer, lyl } from '@alyle/ui';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavigateService } from 'src/app/services/navigate.service';
import { FotoService } from 'src/app/services/foto.service';

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
  uid: string | null;
  window?: (Window & typeof globalThis) | null;
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

  constructor(
    readonly sRenderer: StyleRenderer,
    @Inject(DOCUMENT) private _document: Document,
    private route: ActivatedRoute,
    private _nav: NavigateService,
    private fotoService: FotoService
  ) {
    this.uid = this.route.snapshot.paramMap.get('uid');
  }

  onCropped(e: ImgCropperEvent) {
    this.croppedImage = e.dataURL;
    this.scrollToTop();
  }

  selectInput(e: Event) {
    this.cropper.selectInputEvent(e);
    setTimeout(() => {
      this.cropper.center();
      this.scrollToBottom();
    }, 600);
  }

  ngOnInit(): void {
    this.window = this._document.defaultView;
  }

  enviar() {
    if (this.croppedImage)
      this.fotoService.dataUrl.next(this.croppedImage ? this.croppedImage : '');
    this.gotoCurriculo();
  }

  scrollToBottom() {
    this.window!.scroll({ top: 9000 });
  }

  scrollToTop() {
    this.window!.scroll({ top: 0 });
  }

  gotoCurriculo() {
    this._nav.navigateTo(`/curriculo/${this.uid}`);
  }
}
