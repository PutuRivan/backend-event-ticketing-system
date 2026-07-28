import { Module } from "@nestjs/common";
import { StorageLocalService } from "./services/storage-local.service";
import { StorageFactoryService } from "./services/storage-factory.service";

@Module({
  providers: [
    StorageLocalService,
    StorageFactoryService
  ],
  exports: [
    StorageFactoryService
  ],
})

export class StorageModule { }