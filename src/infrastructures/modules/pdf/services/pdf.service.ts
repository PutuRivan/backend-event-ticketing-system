import { PDFDocument, StandardFonts } from 'pdf-lib';
import { Injectable } from "@nestjs/common";
import { IPdfCreateDto } from '../interfaces/pdf-create.interface';

@Injectable()
export class PdfService {

  async generate(
    data: IPdfCreateDto
  ): Promise<Buffer> {


    const pdfDoc =
      await PDFDocument.create();


    const page =
      pdfDoc.addPage([
        600,
        800
      ]);


    const font =
      await pdfDoc.embedFont(
        StandardFonts.Helvetica
      );


    page.drawText(
      "EVENT TICKET",
      {
        x: 220,
        y: 730,
        size: 24,
        font
      }
    );


    page.drawText(
      `Ticket Number : ${data.ticketNumber}`,
      {
        x: 50,
        y: 650,
        size: 14,
        font
      }
    );


    page.drawText(
      `Event : ${data.eventName}`,
      {
        x: 50,
        y: 620,
        size: 14,
        font
      }
    );


    page.drawText(
      `Name : ${data.userName}`,
      {
        x: 50,
        y: 590,
        size: 14,
        font
      }
    );


    page.drawText(
      `Location : ${data.location}`,
      {
        x: 50,
        y: 560,
        size: 14,
        font
      }
    );


    page.drawText(
      `Date : ${data.eventDate.toISOString()}`,
      {
        x: 50,
        y: 530,
        size: 14,
        font
      }
    );


    const qrImage =
      await pdfDoc.embedPng(
        data.qrCode
      );


    page.drawImage(
      qrImage,
      {
        x: 200,
        y: 250,
        width: 200,
        height: 200
      }
    );


    const pdfBytes =
      await pdfDoc.save();


    return Buffer.from(pdfBytes);
  }
}