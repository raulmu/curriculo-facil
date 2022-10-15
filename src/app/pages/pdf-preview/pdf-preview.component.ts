import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { timeStamp } from 'console';
import { AuthService } from 'src/app/services/auth.service';
import { NavigateService } from 'src/app/services/navigate.service';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss'],
})
export class PdfPreviewComponent implements OnInit, AfterViewInit {
  pdfSrc: string | undefined;
  constructor(private pdfService: PdfService, private _nav: NavigateService, private authService: AuthService) {}
  ngOnInit() {}
  async ngAfterViewInit() {
    // element = this.content.nativeElement;
    console.log('Values on ngAfterViewInit():');
    this.pdfSrc = await this.pdfService.gerarCurriculo();
    // console.log('content:', element);
    //const element = document.getElementById('viewer');
  }

  async baixarPDF() {
    await this.pdfService.saveByteArray(this.pdfSrc!);
  }

  back() {
    this._nav.back(this.authService.userData ? this.authService.userData.uid: '');
  }
}
