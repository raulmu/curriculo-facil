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
  RGB,
  rgb,
  StandardFonts,
  Color,
} from 'pdf-lib';
import { resolve } from 'dns';
import { Interpolation } from '@angular/compiler';
import { AssetsService } from './assets.service';

@Injectable({
  providedIn: 'root',
})
export class PdfService implements OnInit {
  public curriculo: BehaviorSubject<Curriculo | null> =
    new BehaviorSubject<Curriculo | null>(null);
  modelo: Number = 1;
  pdfDoc: PDFDocument | null = null;
  constructor(private http: HttpClient, private assets: AssetsService) {}
  ngOnInit() {}

  async gerarCurriculo(): Promise<string | undefined> {
    const curriculo = this.curriculo.getValue();
    if (curriculo) {
      console.log(`Gerando currículo: ${curriculo.identifier}`);
      this.pdfDoc = await PDFDocument.create();
      if (this.pdfDoc) {
        // variaveis
        const page = this.pdfDoc.addPage(PageSizes.A4);
        const { width, height } = page.getSize();
        const marginX = 0.07;
        const marginY = 0.06;
        const bottom = height * marginY;
        const top = height - bottom;
        const left = width * marginX;
        const right = width - left;
        const xCenter = (right + left) / 2;
        const divisoesX = 4;
        const x4 = (right - left) / divisoesX;
        const yCenter = (bottom + top) / 2;
        const divisoesY = 10;
        const y10 = (top - bottom) / divisoesY;
        const h1FontSize = 15;
        const h2FontSize = 12;
        const bodyFontSize = 11;
        const margin10 = 10;
        const margin2 = 2;
        const margin1 = 1;
        const margin5 = 5;
        const margin3 = 3;
        let lastXYI = {
          x: left,
          y: top,
          i: 1,
        };

        // FONTS

        let hackBytes = await lastValueFrom(
          this.http
            .get(this.assets.getUrl('/assets/font/Hack-Regular.ttf'), {
              responseType: 'blob',
            })
            .pipe(
              map((res) => {
                return res.arrayBuffer();
              })
            )
        );

        let hackBoldBytes = await lastValueFrom(
          this.http
            .get(this.assets.getUrl('/assets/font/Hack-Bold.ttf'), {
              responseType: 'blob',
            })
            .pipe(
              map((res) => {
                return res.arrayBuffer();
              })
            )
        );

        this.pdfDoc.registerFontkit(fontkit);
        const fontBold = await this.pdfDoc.embedFont(hackBoldBytes);
        const fontRegular = await this.pdfDoc.embedFont(hackBytes);

        // GRID
        const desenharGrid = false;
        if (desenharGrid)
          this.desenharMarcacoes(
            page,
            fontRegular,
            left,
            top,
            right,
            xCenter,
            yCenter,
            bottom,
            y10,
            x4
          );

        // NOME
        const headerTxt = curriculo.name!;
        const headerWidth = fontBold.widthOfTextAtSize(headerTxt, h1FontSize);
        const headerTxtY = top - 30;

        page.drawText(headerTxt, {
          x: xCenter - headerWidth / 2, // centered
          y: headerTxtY,
          size: h1FontSize,
          font: fontBold,
          color: rgb(0, 0, 0),
        });

        lastXYI.y = headerTxtY - margin10 - h1FontSize;

        // FOTO

        if (curriculo.fotoDataUrl.length) {
          const isJpg = curriculo.fotoDataUrl.includes(
            'data:image/jpeg;base64'
          );
          const isPng = curriculo.fotoDataUrl.includes('data:image/png;base64');

          if (isJpg || isPng) {
            const base64 = curriculo.fotoDataUrl.replace('data:image/jpeg;base64,', '').replace('data:image/png;base64,', '');
            const imageUint8: Uint8Array = Uint8Array.from(
              atob(
                base64
              ),
              (c) => c.charCodeAt(0)
            );
            const image = isJpg ? await this.pdfDoc.embedJpg(imageUint8.buffer) : await this.pdfDoc.embedPng(imageUint8.buffer);
            const imgDims = image.scale(0.4);
            image &&
              page.drawImage(image, {
                x: x4 * 3 + left + (x4 - imgDims.width) / 2,
                y: lastXYI.y - imgDims.height, // + (y10 - jpgDims.height) / 2,
                width: imgDims.width,
                height: imgDims.height,
                opacity: 1,
              });
          }
        }
        // GRUPO DADOS PESSOAIS
        const alturaH2 = 16;
        // ALTURA ONDE INICIA O CONTEUDO DO GRUPO
        //let grupoY = y10 * (divisoesY - (linhaGrid - 1)) + bottom - alturaH2;

        // DESENHA HEADER

        lastXYI = this.desenharHeader(
          page,
          'DADOS PESSOAIS',
          left,
          lastXYI.y,
          x4 * (divisoesX - 1),
          alturaH2,
          0.3,
          rgb(0, 0, 0),
          0,
          rgb(0, 0, 0),
          rgb(1, 1, 1),
          margin10,
          h2FontSize,
          fontRegular
        );

        // ENDERECO

        let enderecoValueLn1 = `${curriculo.rua!}${
          curriculo.numero ? ', ' + curriculo.numero : ''
        }`;
        let enderecoValueLn2 = `${curriculo.bairro!} - ${curriculo.cidade!} - ${curriculo.estado!}${
          curriculo.cep ? ' CEP ' + curriculo.cep! : ''
        }`;
        enderecoValueLn2 = enderecoValueLn2.replaceAll(' -  - ', '');

        let grupoY = lastXYI.y;

        lastXYI = this.desenharItem(
          page,
          fontBold,
          fontRegular,
          bodyFontSize,
          margin10,
          margin3,
          lastXYI.y,
          left,
          'Endereço: ',
          [
            {
              line: enderecoValueLn1,
            },
            { line: enderecoValueLn2 },
          ],
          lastXYI.i
        );

        //  Telefone
        lastXYI = this.desenharItem(
          page,
          fontBold,
          fontRegular,
          bodyFontSize,
          margin10,
          margin3,
          grupoY,
          left,
          'Telefone: ',
          [{ line: `${curriculo.telefone}`, zap: !!curriculo.whatsapp }],
          lastXYI.i
        );

        // ZAP ICON
        if (curriculo.telefone && curriculo.whatsapp) {
          let zapBytes = await lastValueFrom(
            this.http
              .get(this.assets.getUrl('/assets/img/zap.png'), {
                responseType: 'blob',
              })
              .pipe(
                map((res) => {
                  return res.arrayBuffer();
                })
              )
          );
          const zapPng = await this.pdfDoc.embedPng(zapBytes);
          const zapDim = zapPng.scale(0.15);
          page.drawImage(zapPng, {
            x: lastXYI.x + margin2,
            y: lastXYI.y,
            width: zapDim.width,
            height: zapDim.height,
            opacity: 1,
          });
        }

        // email
        lastXYI = this.desenharItem(
          page,
          fontBold,
          fontRegular,
          bodyFontSize,
          margin10,
          margin3,
          grupoY,
          left,
          'Email: ',
          [{ line: `${curriculo.email}` }],
          lastXYI.i
        );

        // Estado Civil
        lastXYI = this.desenharItem(
          page,
          fontBold,
          fontRegular,
          bodyFontSize,
          margin10,
          margin3,
          grupoY,
          left,
          'Estado Civil: ',
          [{ line: curriculo.estado_civil! }],
          lastXYI.i
        );

        // Data de Nascimento
        const dateValue = new Date(curriculo.data_nascimento!);
        const dateStr = new Intl.DateTimeFormat('pt-BR').format(dateValue);
        lastXYI = this.desenharItem(
          page,
          fontBold,
          fontRegular,
          bodyFontSize,
          margin10,
          margin3,
          grupoY,
          left,
          'Data de Nascimento: ',
          [{ line: dateStr }],
          lastXYI.i
        );

        // Idade
        const idade = this.idade(dateValue, new Date());
        lastXYI = this.desenharItem(
          page,
          fontBold,
          fontRegular,
          bodyFontSize,
          margin10,
          margin3,
          grupoY,
          left,
          'Idade: ',
          [{ line: `${idade} anos` }],
          lastXYI.i
        );

        // Nacionalidade
        lastXYI = this.desenharItem(
          page,
          fontBold,
          fontRegular,
          bodyFontSize,
          margin10,
          margin3,
          grupoY,
          left,
          'Nacionalidade: ',
          [{ line: `${curriculo.nacionalidade}` }],
          lastXYI.i
        );

        // DESENHA HEADER OBJETIVO
        let maxWidth = x4 * divisoesX;

        lastXYI = this.desenharHeader(
          page,
          'OBJETIVO',
          left,
          lastXYI.y - margin10,
          maxWidth,
          alturaH2,
          0.3,
          rgb(0, 0, 0),
          0,
          rgb(0, 0, 0),
          rgb(1, 1, 1),
          margin10,
          h2FontSize,
          fontRegular
        );

        // ALTURA ONDE INICIA O CONTEUDO DO GRUPO

        // quebrar linhas do objetivo se necessário
        let linhas = this.quebrarLinhas(
          curriculo.objetivo!,
          maxWidth,
          margin5,
          fontRegular,
          bodyFontSize
        ).map((linha) => {
          return { line: `${linha}` };
        });

        lastXYI = this.desenharItem(
          page,
          fontBold,
          fontRegular,
          bodyFontSize,
          margin10,
          margin3,
          lastXYI.y,
          left,
          '',
          linhas,
          1
        );

        // DESENHA HEADER ESCOLARIDADE

        lastXYI = this.desenharHeader(
          page,
          'ESCOLARIDADE',
          left,
          lastXYI.y - margin10,
          maxWidth,
          alturaH2,
          0.3,
          rgb(0, 0, 0),
          0,
          rgb(0, 0, 0),
          rgb(1, 1, 1),
          margin10,
          h2FontSize,
          fontRegular
        );

        let escolaridade = `${curriculo.escolaridade!} - ${curriculo.descricao_escolaridade!}`;
        linhas = this.quebrarLinhas(
          escolaridade,
          maxWidth,
          margin5,
          fontRegular,
          bodyFontSize
        ).map((linha) => {
          return { line: `${linha}` };
        });

        lastXYI = this.desenharItem(
          page,
          fontBold,
          fontRegular,
          bodyFontSize,
          margin10,
          margin3,
          lastXYI.y,
          left,
          '',
          linhas,
          1
        );

        // DESENHA HEADER CURSOS
        if (curriculo.cursos?.length) {
          lastXYI = this.desenharHeader(
            page,
            'CURSOS',
            left,
            lastXYI.y - margin10,
            maxWidth,
            alturaH2,
            0.3,
            rgb(0, 0, 0),
            0,
            rgb(0, 0, 0),
            rgb(1, 1, 1),
            margin10,
            h2FontSize,
            fontRegular
          );

          let cursos = curriculo.cursos.map((curso) => {
            let linhas = this.quebrarLinhas(
              `- ${curso}`,
              maxWidth,
              margin5,
              fontRegular,
              bodyFontSize
            ).map((linha) => {
              return { line: `${linha}` };
            });
            return linhas;
          });

          linhas = cursos.reduce((acc, cur) => acc.concat(cur));

          lastXYI = this.desenharItem(
            page,
            fontBold,
            fontRegular,
            bodyFontSize,
            margin10,
            margin3,
            lastXYI.y,
            left,
            '',
            linhas,
            1
          );
        }

        if (curriculo.experiencias?.length) {
          lastXYI = this.desenharHeader(
            page,
            'EXPERIÊNCIAS PROFISSIONAIS',
            left,
            lastXYI.y - margin10,
            maxWidth,
            alturaH2,
            0.3,
            rgb(0, 0, 0),
            0,
            rgb(0, 0, 0),
            rgb(1, 1, 1),
            margin10,
            h2FontSize,
            fontRegular
          );
          const arrays = curriculo.experiencias.map((exp) => {
            let retorno: { line: string }[] = [];
            let linhas = this.quebrarLinhas(
              `- Empresa: ${exp.empresa}`,
              maxWidth,
              margin5,
              fontRegular,
              bodyFontSize
            ).map((linha) => {
              return { line: `${linha}` };
            });
            retorno = retorno.concat(linhas);

            linhas = this.quebrarLinhas(
              `- Período: ${exp.periodo}`,
              maxWidth,
              margin5,
              fontRegular,
              bodyFontSize
            ).map((linha) => {
              return { line: `${linha}` };
            });
            retorno = retorno.concat(linhas);

            linhas = this.quebrarLinhas(
              `- Cargo: ${exp.cargo}`,
              maxWidth,
              margin5,
              fontRegular,
              bodyFontSize
            ).map((linha) => {
              return { line: `${linha}` };
            });
            retorno = retorno.concat(linhas);

            linhas = this.quebrarLinhas(
              `- Atividades Exercidas: ${exp.atividades_exercidas}`,
              maxWidth,
              margin5,
              fontRegular,
              bodyFontSize
            ).map((linha) => {
              return { line: `${linha}` };
            });
            retorno = retorno.concat(linhas);
            retorno.push({ line: '' });
            return retorno;
          });

          linhas = arrays.reduce((acc, cur) => acc.concat(cur));

          lastXYI = this.desenharItem(
            page,
            fontBold,
            fontRegular,
            bodyFontSize,
            margin10,
            margin3,
            lastXYI.y,
            left,
            '',
            linhas,
            1
          );
        }

        // GENERATE

        const pdfBytes = await this.pdfDoc.save();

        return new Promise((resolve, reject) => {
          resolve(this.getPdfURL(pdfBytes));
        });
        // this.saveByteArray('test.pdf', this.getPdfURL(pdfBytes));
      }
    }
    return new Promise((resolve, reject) => {
      resolve('');
    });
  }

  getPdfURL(byte: BlobPart) {
    var blob = new Blob([byte], { type: 'application/pdf' });
    return window.URL.createObjectURL(blob);
  }

  saveByteArray(href: string) {
    const curriculo = this.curriculo.getValue();
    var link = document.createElement('a');
    link.href = href;
    var fileName = `${curriculo!.identifier?.replace(
      ' ',
      '_'
    )}.pdf`.toLowerCase();
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

  desenharHeader(
    page: PDFPage,
    texto: string,
    x: number,
    y: number,
    width: number,
    alturaH2: number,
    borderWidth: number,
    borderColor: Color,
    opacity: number,
    color: Color,
    bgColor: Color,
    margin: number,
    fontSize: number,
    font: PDFFont
  ): { x: number; y: number; i: number } {
    // DESENHA HEADER
    page.drawRectangle({
      color: bgColor,
      x: x,
      y: y,
      width,
      height: -alturaH2,
      borderWidth,
      borderColor,
      opacity,
    });

    const h2Text = texto;

    page.drawText(h2Text, {
      x: x + margin,
      y: y - fontSize,
      size: fontSize,
      font,
      color,
    });

    return { x: x + width, y: y - alturaH2, i: 1 };
  }

  desenharItem(
    page: PDFPage,
    labelFont: PDFFont,
    valueFont: PDFFont,
    fontSize: number,
    marginX: number,
    marginY: number,
    grupoY: number,
    x: number,
    label: string,
    values: { line: string; zap?: boolean }[],
    linhaIndex: number
  ): { x: number; y: number; i: number } {
    const itemLabel = label;
    const itemLabelWidth = labelFont.widthOfTextAtSize(itemLabel, fontSize);
    const itemLabelX = x + marginX;
    let itemY = grupoY - (fontSize + marginY) * linhaIndex;
    let retX = itemLabelX + itemLabelWidth;
    let retY = itemY;
    let retI = linhaIndex;

    if (itemLabel.length) {
      page.drawText(itemLabel, {
        x: itemLabelX,
        y: itemY,
        size: fontSize,
        font: labelFont,
        color: rgb(0, 0, 0),
      });
    }

    let valuesIndex = 0;
    values.forEach((linha) => {
      let fontSizeUsed = fontSize;
      if (!linha.line.length) {
        fontSizeUsed = 3;
      }
      if (!valuesIndex) {
        itemY = grupoY - (fontSizeUsed + marginY) * linhaIndex;
      } else {
        itemY -= fontSizeUsed + marginY;
      }

      retY = itemY;
      retI = linhaIndex + valuesIndex + 1;
      const itemValueLn = linha.line;
      const itemValueWidth = valueFont.widthOfTextAtSize(
        itemValueLn,
        fontSizeUsed
      );
      page.drawText(itemValueLn, {
        x: itemLabelX + itemLabelWidth,
        y: itemY,
        size: fontSizeUsed,
        font: valueFont,
        color: rgb(0, 0, 0),
      });
      retX = itemLabelX + itemLabelWidth + itemValueWidth;
      valuesIndex++;
    });

    return { y: retY, x: retX, i: retI };
  }

  idade(nascimento: Date, hoje: Date): number {
    var diferencaAnos = hoje.getFullYear() - nascimento.getFullYear();
    if (
      new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()) <
      new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate())
    )
      diferencaAnos--;
    return diferencaAnos;
  }

  quebrarLinhas(
    texto: string,
    maxWidth: number,
    paragrafo: number,
    font: PDFFont,
    fontSize: number
  ): string[] {
    let linhas: string[] = [];
    if (!texto) return linhas;
    const palavras = texto.split(' ');
    let linha = '';
    let linhaTeste = '';
    palavras.forEach((palavra) => {
      let maxWidthParagrafo = maxWidth;
      if (!linhas.length) maxWidthParagrafo += paragrafo;
      linhaTeste += ' ' + palavra;
      const tamLinhaTeste = font.widthOfTextAtSize(linhaTeste, fontSize);
      if (tamLinhaTeste > maxWidthParagrafo) {
        linhas.push(linha);
        linha = palavra;
        linhaTeste = '';
      } else {
        linha = linhaTeste;
      }
    });
    if (linha) linhas.push(linha);
    return linhas;
  }
}
