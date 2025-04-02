export class StorageService {
  static async hasMeetingBeenOpened(eventId) {
    return new Promise((resolve) => {
      chrome.storage.local.get([eventId], (result) => {
        resolve(!!result[eventId]);
      });
    });
  }

  static async markMeetingAsOpened(eventId) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [eventId]: true }, resolve);
    });
  }

  static async cleanupOldMeetings() {
    try {
      const now = Date.now();
      return new Promise((resolve) => {
        chrome.storage.local.get(null, (items) => {
          const keysToRemove = Object.keys(items).filter((key) => {
            // Remove entries older than 24 hours
            if (items[key] && now - items[key] > 24 * 60 * 60 * 1000) {
              return true;
            }
            return false;
          });

          if (keysToRemove.length > 0) {
            chrome.storage.local.remove(keysToRemove);
            console.log("Cleaned up old meeting records:", keysToRemove);
          }
          resolve();
        });
      });
    } catch (error) {
      console.error("Error cleaning up old meetings:", error);
      throw error;
    }
  }
}
