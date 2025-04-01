import { AnalyticsEntity } from "@/types/analytics.type";
import { IAnalyticsService } from "@/interfaces/IAnalyticsService";

export class AnalyticsServicePlausible implements IAnalyticsService {
  send(analytics: AnalyticsEntity) {
    const { category, action, data } = analytics;

    try {
      (window as any).plausible(
        `${category}${action ? `/${action}` : ""}`,
        data ? { props: data } : {}
      );
    } catch (e) {}
  }
}
