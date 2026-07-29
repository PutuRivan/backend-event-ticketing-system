import { Injectable } from "@nestjs/common";
import QRCode from "qrcode";
import { IGenerateQrCode } from "../interfaces/qr-code.interface";

@Injectable()
export class QrCodeService {

  async generate(
    data: IGenerateQrCode
  ): Promise<Buffer> {

    return QRCode.toBuffer(
      data.value
    );

  }

}