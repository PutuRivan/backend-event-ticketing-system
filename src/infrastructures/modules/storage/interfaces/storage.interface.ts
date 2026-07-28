export interface IStorageService {

  uploadToStorage<T>(
    data: T
  ): Promise<string>;

  getFromStorage<T>(
    data: T
  ): Promise<Buffer>;

}