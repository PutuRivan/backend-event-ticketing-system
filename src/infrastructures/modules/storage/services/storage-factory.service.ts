import { Injectable } from "@nestjs/common";
import { IStorageService } from "../interfaces/storage.interface";
import { StorageLocalService } from "./storage-local.service";
import { StorageDriver, TStorageDriver } from "../constant/storage.constant";


@Injectable()
export class StorageFactoryService {

  constructor(
    private readonly storageLocalService: StorageLocalService
  ) { }


  createStorageService(
    storageDriver: TStorageDriver
  ): IStorageService {

    switch (storageDriver) {

      case StorageDriver.Local: {
        return this.storageLocalService;
      }


      default: {
        throw new Error(
          `Storage with name ${storageDriver} is not supported.`
        );
      }

    }
  }
}