export interface IStorageService {

  uploadToStorage(
    data: IStorageUploadRequest
  ): Promise<string>;


  getFromStorage(
    data: IStorageGetRequest
  ): Promise<Buffer>;
}

export interface IStorageUploadRequest {
  folder: string;
  filename: string;
  buffer: Buffer;
}

export interface IStorageGetRequest {
  path: string;
}