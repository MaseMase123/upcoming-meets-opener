import config from "../../config.js";
import { CalendarService } from "./calendarService.js";
import { NotificationService } from "./notificationService.js";

export class MeetingService {
  static async checkUpcomingMeetings() {
    try {
      const events = await CalendarService.fetchCalendarEvents();
      if (!events || events.length === 0) {
        console.log("No upcoming meetings found in periodic check");
        return;
      }

      // Process each meeting
      events.forEach(async (event) => {
        const meetingUrl = CalendarService.getMeetingUrl(event);
        if (!meetingUrl) return;

        const eventStart = new Date(event.start.dateTime).getTime();
        const now = Date.now();
        const bufferTime = config.meetingBufferMinutes * 60 * 1000;
        const tenMinutesBefore = eventStart - bufferTime;
        const eventId = event.id;

        console.log("Checking meeting:", {
          title: event.summary,
          startTime: new Date(eventStart).toLocaleString(),
          timeUntilStart: Math.floor((eventStart - now) / 60000) + " minutes",
          shouldOpen: now >= tenMinutesBefore && now < eventStart,
        });

        // Check if we should open this meeting
        if (now >= tenMinutesBefore && now < eventStart) {
          const hasBeenOpened = await StorageService.hasMeetingBeenOpened(
            eventId
          );

          if (!hasBeenOpened) {
            console.log("Opening meeting:", event.summary);
            await this.openMeeting(event);
            await StorageService.markMeetingAsOpened(eventId);
          } else {
            console.log("Meeting already opened:", event.summary);
          }
        }
      });
    } catch (error) {
      console.error("Error in periodic check:", error);
    }
  }

  static async openMeeting(event) {
    const meetingUrl = CalendarService.getMeetingUrl(event);

    // Create notification
    await NotificationService.createMeetingNotification(event);

    // Open the meeting
    chrome.windows.getAll({ populate: true }, (windows) => {
      if (windows.length === 0) {
        chrome.windows.create({
          url: meetingUrl,
          focused: true,
        });
      } else {
        chrome.tabs.create({ url: meetingUrl });
      }
    });
  }

  static async openNextMeeting() {
    try {
      console.log("Debug: Finding next meeting to open...");
      const events = await CalendarService.fetchCalendarEvents();

      if (!events || events.length === 0) {
        console.log("No upcoming meetings found");
        return { error: "No upcoming meetings found" };
      }

      // Find the next meeting with a valid meeting link
      const nextMeeting = events.find((event) =>
        CalendarService.getMeetingUrl(event)
      );

      if (!nextMeeting) {
        console.log("No meetings with valid links found");
        return { error: "No meetings with valid links found" };
      }

      console.log("Debug: Found next meeting:", {
        title: nextMeeting.summary,
        startTime: nextMeeting.start.dateTime,
        link: CalendarService.getMeetingUrl(nextMeeting),
      });

      // Open the meeting
      const meetingUrl = CalendarService.getMeetingUrl(nextMeeting);
      chrome.tabs.create({ url: meetingUrl }, (tab) => {
        console.log("Debug: Opened meeting in tab:", tab.id);
      });

      return {
        success: true,
        meeting: {
          title: nextMeeting.summary,
          startTime: nextMeeting.start.dateTime,
          url: meetingUrl,
        },
      };
    } catch (error) {
      console.error("Error in openNextMeeting:", error);
      return { error: error.message };
    }
  }
}
