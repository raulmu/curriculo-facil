import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, lastValueFrom, map } from 'rxjs';
import { Curriculo } from './curriculo';
import * as fontkit from '@btielen/pdf-lib-fontkit';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  degrees,
  grayscale,
  PageSizes,
  PDFDocument,
  PDFFont,
  PDFPage,
  rgb,
  StandardFonts,
} from 'pdf-lib';

@Injectable({
  providedIn: 'root',
})
export class PdfService implements OnInit {
  public curriculo: BehaviorSubject<Curriculo | null> =
    new BehaviorSubject<Curriculo | null>(null);
  modelo: Number = 1;
  pdfDoc: PDFDocument | null = null;
  constructor(private http: HttpClient) {}
  ngOnInit() {}

  async gerarCurriculo() {
    const desenharMarcacoes = false;
    const curriculo = this.curriculo.getValue();
    if (curriculo) {
      console.log(`Gerando currículo: ${curriculo.identifier}`);
      this.pdfDoc = await PDFDocument.create();
      if (this.pdfDoc) {
        const page = this.pdfDoc.addPage(PageSizes.A4);
        const { width, height } = page.getSize();
        const marginX = 0.07;
        const marginY = 0.07;
        const bottom = height * marginY;
        const top = height - bottom;
        const left = width * marginX;
        const right = width - left;
        const xCenter = (right + left) / 2;
        const x4 = (right - left) / 4;
        const yCenter = (bottom + top) / 2;
        const y10 = (top - bottom) / 10;

        let fontBytes = await lastValueFrom(
          this.http
            .get(`${environment.baseHref}/assets/font/Hack-Regular.ttf`, { responseType: 'blob' })
            .pipe(
              map((res) => {
                return res.arrayBuffer();
              })
            )
        );

        this.pdfDoc.registerFontkit(fontkit);
        const customFont = await this.pdfDoc.embedFont(fontBytes);

        if(desenharMarcacoes)
        this.desenharMarcacoes(
          page,
          customFont,
          left,
          top,
          right,
          xCenter,
          yCenter,
          bottom,
          y10,
          x4
        );
        

        const text = curriculo.name!;
        const fontSize = 16;
        const textWidth = customFont.widthOfTextAtSize(text, fontSize);
        const textHeight = customFont.heightAtSize(fontSize);

        const nameY = y10 * 10 + bottom - fontSize * 2;

        page.drawText(text, {
          x: xCenter - textWidth / 2, // centered
          y: nameY,
          size: fontSize,
          font: customFont,
          color: rgb(0, 0, 0),
        });

        const imageUint8: Uint8Array = Uint8Array.from(
          atob(curriculo.fotoDataUrl.replace('data:image/jpeg;base64,', '')),
          (c) => c.charCodeAt(0)
        );

        const jpgImage = await this.pdfDoc.embedJpg(imageUint8.buffer);
        const jpgDims = jpgImage.scale(0.25);

        page.drawRectangle({
          x: left,
          y: y10 * 9 + bottom,
          width: x4 * 3,
          height: -20,
          borderWidth: 0.5,
          borderColor: rgb(0, 0, 0),
          opacity: 0,
        });

        page.drawImage(jpgImage, {
          x: x4 * 3 + left + (x4 - jpgDims.width) / 2,
          y: y10 * 8 + bottom + (y10 - jpgDims.height) / 2,
          width: jpgDims.width,
          height: jpgDims.height,
          opacity: 1,
        });

        const pdfBytes = await this.pdfDoc.save();

        this.saveByteArray('test.pdf', pdfBytes);
      }
    }
  }

  saveByteArray(reportName: string, byte: BlobPart) {
    var blob = new Blob([byte], { type: 'application/pdf' });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  }

  desenharMarcacoes(
    page: PDFPage,
    font: PDFFont,
    left: number,
    top: number,
    right: number,
    xCenter: number,
    yCenter: number,
    bottom: number,
    y10: number,
    x4: number
  ) {
    for (let i = 1; i <= 9; i++) {
      page.drawLine({
        start: { x: left, y: y10 * i + bottom },
        end: { x: right, y: y10 * i + bottom },
        color: rgb(0, 0, 1),
      });
    }

    for (let i = 1; i <= 3; i++) {
      page.drawLine({
        start: { x: x4 * i + left, y: top },
        end: { x: x4 * i + left, y: bottom },
        color: rgb(0, 1, 0),
      });
    }

    page.drawRectangle({
      x: left,
      y: bottom,
      width: right - left,
      height: top - bottom,
      borderWidth: 1,
      borderColor: rgb(0.5, 0, 0),
      opacity: 0,
      borderOpacity: 1,
    });

    page.drawText(`(${left.toFixed(0)},${top.toFixed(0)})`, {
      x: left,
      y: top,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`(${right.toFixed(0)},${top.toFixed(0)})`, {
      x: right,
      y: top,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`|${xCenter.toFixed(0)}`, {
      x: xCenter,
      y: top,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`${left.toFixed(0)},${bottom.toFixed(0)}`, {
      x: left,
      y: bottom,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`_${yCenter.toFixed(0)}`, {
      x: left,
      y: yCenter,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`(${right.toFixed(0)},${bottom.toFixed(0)})`, {
      x: right,
      y: bottom,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
  }
}
