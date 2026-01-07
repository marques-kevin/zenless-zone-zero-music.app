import { AnalyticsEntity } from "@/types/analytics.type";
import { IAnalyticsService } from "@/interfaces/IAnalyticsService";
import { AnalyticsServiceUmami } from "./analytics.service.umami";

export class AnalyticsServicePlausible implements IAnalyticsService {
  send(analytics: AnalyticsEntity) {
    const { category, action, data } = analytics;

    try {
      (window as any).plausible(
        `${category}${action ? `/${action}` : ""}`,
        data ? { props: data } : {}
      );
    } catch (e) {}

    new AnalyticsServiceUmami().send(analytics);
  }
}
