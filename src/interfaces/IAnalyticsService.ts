import { AnalyticsEntity } from "../types/analytics.type";

export interface IAnalyticsService {
  send(analytics: AnalyticsEntity): any;
}
