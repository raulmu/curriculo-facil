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
  @ViewChild('content')
  content!: ElementRef;

  constructor(private pdfService: PdfService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    const element = this.content.nativeElement;
    console.log('Values on ngAfterViewInit():');
    console.log('content:', element);
  }

  async baixarPDF() {
    await this.pdfService.gerarCurriculo();
  }
}
