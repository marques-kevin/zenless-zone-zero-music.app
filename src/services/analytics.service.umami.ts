import { AnalyticsEntity } from "@/types/analytics.type";
import { IAnalyticsService } from "@/interfaces/IAnalyticsService";

declare global {
  interface Window {
    umami?: {
      track: (eventNameOrPayload?: string | object, data?: object) => void;
      identify: (uniqueIdOrData: string | object, data?: object) => void;
    };
  }
}

export class AnalyticsServiceUmami implements IAnalyticsService {
  send(analytics: AnalyticsEntity) {
    const { category, action, data } = analytics;

    // Check if Umami is available
    if (typeof window === "undefined" || !window.umami) {
      return;
    }

    try {
      const eventName = `${category}${action ? `/${action}` : ""}`;

      if (data && Object.keys(data).length > 0) {
        window.umami.track(eventName, data);
      } else {
        window.umami.track(eventName);
      }
    } catch (error) {}
  }
}
