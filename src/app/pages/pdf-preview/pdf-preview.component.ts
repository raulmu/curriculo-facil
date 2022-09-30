import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss'],
})
export class PdfPreviewComponent implements OnInit, AfterViewInit {
  pdfSrc: string | undefined;
  constructor(private pdfService: PdfService) {}
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
}
