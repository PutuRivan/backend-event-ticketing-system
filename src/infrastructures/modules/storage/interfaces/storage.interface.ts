import { IStorageGetRequest } from "./storage-get-request.interface";
import { IStorageUploadRequest } from "./storage-upload-request.interface";

export interface IStorageService {

  uploadToStorage(
    data: IStorageUploadRequest
  ): Promise<string>;


  getFromStorage(
    data: IStorageGetRequest
  ): Promise<Buffer>;


  deleteFromStorage(
    path: string
  ): Promise<void>;


  getFileUrl(
    path: string
  ): Promise<string>;

  getAbsolutePath(
    filePath: string
  ): string;
}