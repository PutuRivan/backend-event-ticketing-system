import { Injectable, Logger } from "@nestjs/common";
import { mkdir, readFile, unlink, writeFile, access } from "fs/promises";
import path from "path";

import { config } from "../../../../config";
import { IStorageService } from "../interfaces/storage.interface";
import { IStorageUploadRequest } from "../interfaces/storage-upload-request.interface";
import { IStorageGetRequest } from "../interfaces/storage-get-request.interface";

@Injectable()
export class StorageLocalService implements IStorageService {

  private readonly logger = new Logger(StorageLocalService.name);

  private readonly rootPath = config.storage.rootPath;


  async uploadToStorage(
    data: IStorageUploadRequest
  ): Promise<string> {

    try {

      this.validateUpload(data);


      const relativePath =
        path.join(
          data.folder,
          data.filename
        );


      const absolutePath =
        path.join(
          this.rootPath,
          relativePath
        );


      const directory =
        path.dirname(
          absolutePath
        );


      await mkdir(
        directory,
        {
          recursive: true
        }
      );


      await writeFile(
        absolutePath,
        data.buffer
      );


      this.logger.log(
        `File uploaded successfully: ${relativePath}`
      );


      return relativePath;


    } catch (error: any) {

      const message =
        `Failed to upload file: ${error.message}`;


      this.logger.error(
        message
      );


      throw new Error(message);
    }
  }

  async getFromStorage(
    data: IStorageGetRequest
  ): Promise<Buffer> {

    try {

      this.validatePath(
        data.path
      );


      const absolutePath =
        path.join(
          this.rootPath,
          data.path
        );


      await this.checkFileExists(
        absolutePath
      );


      const file =
        await readFile(
          absolutePath
        );


      this.logger.log(
        `File retrieved successfully: ${data.path}`
      );


      return file;


    } catch (error: any) {

      const message =
        `Failed to get file: ${error.message}`;


      this.logger.error(
        message
      );


      throw new Error(message);
    }
  }

  getAbsolutePath(
    filePath: string
  ): string {

    if (!filePath) {
      throw new Error(
        "File path is required"
      );
    }


    return path.join(
      this.rootPath,
      filePath
    );
  }

  async deleteFromStorage(
    filePath: string
  ): Promise<void> {

    try {

      this.validatePath(filePath);

      const absolutePath = path.join(
        this.rootPath,
        filePath
      );

      await this.checkFileExists(absolutePath);


      await unlink(absolutePath);

      this.logger.log(`File deleted successfully: ${filePath}`);
    } catch (error: any) {
      const message = `Failed to delete file: ${error.message}`;

      this.logger.error(message);

      throw new Error(message);
    }
  }

  async getFileUrl(
    filePath: string
  ): Promise<string> {

    try {

      this.validatePath(filePath);

      const absolutePath = path.join(
        this.rootPath,
        filePath
      );


      await this.checkFileExists(absolutePath);


      return `${config.app.url}/${filePath}`;


    } catch (error: any) {

      const message =
        `Failed to generate file URL: ${error.message}`;

      this.logger.error(message);

      throw new Error(message);
    }
  }

  private validateUpload(
    data: IStorageUploadRequest
  ): void {

    if (!data.buffer) {
      throw new Error("File buffer is required");
    }


    if (!data.folder) {
      throw new Error("Storage folder is required");
    }

    if (!data.filename) {
      throw new Error("Filename is required");
    }
  }

  private validatePath(
    filePath: string
  ): void {

    if (!filePath) {
      throw new Error("File path is required");
    }

    if (
      filePath.includes("..")
    ) {
      throw new Error(
        "Invalid file path"
      );
    }
  }

  private async checkFileExists(
    filePath: string
  ): Promise<void> {

    try {
      await access(filePath);
    } catch {
      this.logger.warn(
        `File not found: ${filePath}`
      );

      throw new Error(
        `File not found`
      );
    }
  }
}