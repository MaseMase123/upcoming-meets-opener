import config from "../config.js";
import { AuthService } from "./services/authService.js";
import { CalendarService } from "./services/calendarService.js";
import { MeetingService } from "./services/meetingService.js";
import { StorageService } from "./services/storageService.js";

let checkInterval;

// Check authentication status on startup
chrome.runtime.onStartup.addListener(() => {
  checkAuthAndFetchEvents();
});

// Also check when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed/updated: Setting up periodic check");
  startPeriodicCheck();
  checkAuthAndFetchEvents();
});

// Start periodic check every 5 seconds
function startPeriodicCheck() {
  // Clear any existing interval
  if (checkInterval) {
    clearInterval(checkInterval);
  }

  // Set up new interval
  checkInterval = setInterval(() => {
    console.log("Periodic check triggered:", new Date().toLocaleString());
    MeetingService.checkUpcomingMeetings();
  }, config.checkInterval);
}

// Check if we're authorized and fetch events if so
async function checkAuthAndFetchEvents() {
  const isAuthorized = await AuthService.isAuthorized();
  if (isAuthorized) {
    await CalendarService.fetchCalendarEvents();
  }
}

// Run cleanup daily
chrome.alarms.create("cleanupMeetings", {
  periodInMinutes: 24 * 60, // Once per day
  delayInMinutes: 60, // Start after 1 hour
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "cleanupMeetings") {
    StorageService.cleanupOldMeetings();
  }
});

// Message handlers
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getMeetings") {
    console.log("Received getMeetings request");
    CalendarService.fetchCalendarEvents()
      .then((meetings) => {
        console.log("Sending meetings back to popup:", meetings);
        sendResponse({ meetings });
      })
      .catch((error) => {
        console.error("Error in getMeetings handler:", error);
        sendResponse({ error: error.message });
      });
    return true; // Required for async response
  }

  if (request.action === "openNextMeeting") {
    console.log("Received openNextMeeting request");
    MeetingService.openNextMeeting()
      .then((result) => {
        console.log("Sending openNextMeeting response:", result);
        sendResponse(result);
      })
      .catch((error) => {
        console.error("Error in openNextMeeting handler:", error);
        sendResponse({ error: error.message });
      });
    return true; // Required for async response
  }
});

// Notification click handler
chrome.notifications.onClicked.addListener((notificationId) => {
  console.log("Notification clicked:", notificationId);
  // You might want to handle notification clicks here
});
