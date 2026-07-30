import { IDashboardSummary } from "./dashboard-summary.interface";
import { ITopEvent } from "../interfaces/top-event.interface";
import { ITopCategory } from "../interfaces/top-category.interface";

export interface IDashboardV1Repository {
  getSummary(
    startDate?: Date,
    endDate?: Date,
  ): Promise<IDashboardSummary>;

  getTopEvents(
    limit?: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ITopEvent[]>;

  getTopCategories(
    limit?: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ITopCategory[]>;
}