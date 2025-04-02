# 🚀 Upcoming Meets Opener Chrome Extension

> ⏰ Never miss a meeting again! This Chrome extension automatically opens your Google Calendar meeting links 10 minutes before they start.

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-blue)](https://chrome.google.com/webstore)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Description

The Meeting Link Opener is a smart Chrome extension that ensures you never miss a meeting by automatically opening your meeting links at the perfect time. Whether it's a Google Meet, Zoom, or any other meeting platform, this extension has you covered! It seamlessly integrates with your Google Calendar and works silently in the background, giving you one less thing to worry about.

## ✨ Features

- 🕒 Automatically opens meeting links 10 minutes before the scheduled start time
- 📅 Works with Google Meet links and other URL locations in your calendar events
- 🔐 Simple popup interface for authentication and status
- 🔄 Runs in the background, checking for upcoming meetings every 5 seconds
- 🔒 Privacy-focused - all processing happens locally in your browser

## 🛠️ Installation Instructions

### 1. Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top-right corner)
3. Click "Load unpacked" and select the directory containing this extension
4. **IMPORTANT**: Note down your extension ID from the extensions page. It will look something like `abcdefghijklmnopqrstuvwxyz`

### 2. Set Up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Calendar API:
   - Search for "Google Calendar API" in the API Library
   - Click "Enable"
4. Configure OAuth Consent Screen:
   - Go to "OAuth consent screen"
   - Select "External" user type
   - Fill in the required app information
   - Add your email as a test user
5. Create OAuth Credentials:
   - Go to "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Select "Chrome Extension" as the application type
   - Enter your extension ID (from step 1)
   - Add `chrome-extension://YOUR_EXTENSION_ID` to the authorized redirect URIs
   - Copy the generated Client ID

### 3. Configure the Extension

1. Copy `manifest.example.json` to `manifest.json`
2. Replace `YOUR_CLIENT_ID` in `manifest.json` with your actual Client ID
3. Reload the extension in Chrome (click the refresh icon on the extension card)

### 4. Authorize the Extension

1. Click on the extension icon in your Chrome toolbar
2. Click "Sign in with Google"
3. Grant the requested calendar permissions

## ⚙️ Configuration

You can customize the extension's behavior by modifying `config.js`:

- `checkInterval`: How often to check for upcoming meetings (in milliseconds)
- `meetingBufferMinutes`: How many minutes before a meeting to open the link

## 🔍 Troubleshooting

If the extension is not working as expected:

1. **Authentication Issues**:

   - Make sure you've completed the OAuth setup correctly
   - Verify your extension ID matches in both Chrome and Google Cloud Console
   - Check that the Client ID in `manifest.json` is correct

2. **Meeting Links Not Opening**:

   - Ensure you've granted calendar permissions
   - Verify your meetings have valid URLs in either the location field or as Google Meet links
   - Check the extension is enabled in `chrome://extensions/`
   - Look for errors in the extension's background page console

3. **Common Problems**:
   - If the extension stops working, try removing and re-adding it
   - Make sure you're signed in to the correct Google account
   - Check that the Google Calendar API is enabled in your Google Cloud project

## 🔒 Privacy

This extension only requests access to read your Google Calendar events. It does not collect, store, or transmit any of your calendar data outside of your browser. All processing happens locally in your browser.

## 💬 Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.
