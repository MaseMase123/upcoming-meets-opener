import config from "../../config.js";
import { AuthService } from "./authService.js";

export class CalendarService {
  static async fetchCalendarEvents() {
    try {
      console.log("Fetching calendar events...");
      const token = await AuthService.getAuthToken();

      if (!token) {
        throw new Error("No auth token available");
      }

      const now = new Date();
      const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

      const url =
        `${config.calendarApiUrl}?` +
        `timeMin=${now.toISOString()}&` +
        `timeMax=${twoDaysFromNow.toISOString()}&` +
        `orderBy=startTime&` +
        `singleEvents=true`;

      console.log("Fetching from URL:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("API Error:", response.status, await response.text());
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received calendar data:", {
        itemCount: data.items?.length || 0,
        timeRange: {
          start: now.toISOString(),
          end: twoDaysFromNow.toISOString(),
        },
      });

      // Filter out events without dateTime (all-day events)
      const validEvents = (data.items || []).filter(
        (event) => event.start?.dateTime
      );
      console.log("Valid events count:", validEvents.length);

      return validEvents;
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      throw error;
    }
  }

  static getMeetingUrl(event) {
    return (
      event.hangoutLink ||
      (event.location?.startsWith("http") ? event.location : null)
    );
  }
}
