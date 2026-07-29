import { Injectable } from "@nestjs/common";
import { IStorageGetRequest, IStorageService } from "../interfaces/storage.interface";
import { config } from "../../../../config";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

@Injectable()
export class StorageLocalService implements IStorageService {

  private readonly rootPath = config.storage.rootPath;


  async uploadToStorage<T>(
    data: T
  ): Promise<string> {

    const {
      folder,
      filename,
      buffer
    } = data as {
      folder: string;
      filename: string;
      buffer: Buffer;
    };


    const folderPath =
      path.join(
        this.rootPath,
        folder
      );


    await mkdir(
      folderPath,
      {
        recursive: true
      }
    );


    const filePath =
      path.join(
        folderPath,
        filename
      );


    await writeFile(
      filePath,
      buffer
    );


    return filePath;
  }


  async getFromStorage(
    data: IStorageGetRequest
  ): Promise<Buffer> {

    const filePath =
      path.join(
        this.rootPath,
        data.path
      );


    return readFile(filePath);
  }
}