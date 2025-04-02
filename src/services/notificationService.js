export class NotificationService {
  static async createMeetingNotification(event) {
    return chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "Meeting Starting Now!",
      message: `"${event.summary}" is starting now`,
      priority: 2,
      requireInteraction: true,
      buttons: [
        {
          title: "Join Meeting",
        },
      ],
    });
  }

  static async requestWakeLock() {
    try {
      if ("wakeLock" in navigator) {
        const wakeLock = await navigator.wakeLock.request("screen");
        console.log("Wake Lock is active");
        return wakeLock;
      }
    } catch (err) {
      console.error(`Wake Lock error: ${err.name}, ${err.message}`);
    }
    return null;
  }
}
