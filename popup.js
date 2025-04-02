document.addEventListener("DOMContentLoaded", function () {
  const authButton = document.getElementById("authButton");
  const statusDiv = document.getElementById("status");

  chrome.identity.getAuthToken({ interactive: false }, function (token) {
    if (token) {
      statusDiv.textContent = "Connected to Google Calendar";
      statusDiv.className = "authorized";
      authButton.textContent = "Refresh Connection";
      fetchUpcomingMeetings();
    } else {
      statusDiv.textContent = "Not connected to Google Calendar";
      statusDiv.className = "unauthorized";
      authButton.textContent = "Sign in with Google";
    }
  });

  authButton.addEventListener("click", function () {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (token) {
        statusDiv.textContent = "Connected to Google Calendar";
        statusDiv.className = "authorized";
        authButton.textContent = "Refresh Connection";
        fetchUpcomingMeetings();
      } else {
        statusDiv.textContent = "Authentication failed";
        statusDiv.className = "unauthorized";
      }
    });
  });

  const debugButton = document.getElementById("debugOpenNext");
  debugButton.addEventListener("click", function () {
    console.log("Debug: Requesting to open next meeting");
    chrome.runtime.sendMessage(
      { action: "openNextMeeting" },
      function (response) {
        console.log("Debug: Open next meeting response:", response);
      }
    );
  });

  document.getElementById("debugNotification").addEventListener("click", () => {
    chrome.notifications.create(
      {
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "Test Notification",
        message: "This is a test notification from Meeting Link Opener",
        priority: 2,
        requireInteraction: true,
        buttons: [
          {
            title: "Test Button",
          },
        ],
      },
      (notificationId) => {
        if (chrome.runtime.lastError) {
          console.error("Notification error:", chrome.runtime.lastError);
        } else {
          console.log("Test notification sent:", notificationId);
        }
      }
    );
  });
});

function formatTimeRemaining(startTime) {
  const now = new Date();
  const diffMs = startTime - now;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 0) return "In progress";
  if (diffMins < 60) return `Starts in ${diffMins} minutes`;

  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  if (hours < 24) {
    return `Starts in ${hours}h ${mins}m`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `Starts in ${days}d ${remainingHours}h`;
}

function fetchUpcomingMeetings() {
  console.log("Attempting to fetch meetings...");
  chrome.runtime.sendMessage({ action: "getMeetings" }, function (response) {
    console.log("Received response:", response);
    const meetingsList = document.getElementById("meetingsList");

    if (chrome.runtime.lastError) {
      console.error("Runtime error:", chrome.runtime.lastError);
      meetingsList.innerHTML =
        "<p>Error fetching meetings. Please try again.</p>";
      return;
    }

    meetingsList.innerHTML = "";

    if (response && response.meetings && response.meetings.length > 0) {
      console.log("Found meetings:", response.meetings);
      response.meetings.forEach((meeting) => {
        try {
          const startTime = new Date(meeting.start.dateTime);
          const timeRemaining = formatTimeRemaining(startTime);

          console.log("Processing meeting:", {
            title: meeting.summary,
            startTime: startTime.toLocaleString(),
            timeRemaining,
          });

          const meetingDiv = document.createElement("div");
          meetingDiv.className = "meeting-item";
          meetingDiv.innerHTML = `
            <div class="meeting-time">${startTime.toLocaleString()}</div>
            <div class="meeting-title">${
              meeting.summary || "Untitled Meeting"
            }</div>
            <div class="time-remaining">${timeRemaining}</div>
            ${
              meeting.hangoutLink
                ? `<div class="meeting-link">Meet link: ${meeting.hangoutLink}</div>`
                : ""
            }
          `;
          meetingsList.appendChild(meetingDiv);
        } catch (error) {
          console.error("Error processing meeting:", error, meeting);
        }
      });
    } else {
      console.log("No meetings found");
      meetingsList.innerHTML = "<p>No upcoming meetings in the next 2 days</p>";
    }
  });
}
