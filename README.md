# Climbing Tracker of Truth and Josstice

**A mobile climbing tracker application built with React Native/Expo that connects to a Flask REST API. Tracks your climbs and attempts with a clean, intuitive interface.**

To follow my developer journey, and this build specifically, head to [my dev.to article](https://dev.to/truthjosstice/a-beginner-builds-an-expo-app-2lhl)

![An example image of a bouldering wall](./assets/images/Bouldering.jpg)

## Tech Stack

**Frontend:**

- React Native / Expo
- Axios for API Calls
- Tanstack Query for Caching
- Expo SecureStore for secure token storage

**Backend:**

- Flask (Python)
- PostgreSQL
- JWT Authentication
- Marshmallow Schemas

## Project Structure

```markdown
climbing-tracker-mobile/
├── src/
│ ├── components/ # Main AppContent switcher & Reusable StarUI Component
│ ├── context/ # Authorisation Context
│ ├── screens/ # Screen components
│ └── utilities/ # Helper functions, app constants, customHooks and apiServices
├── assets/ # Images, fonts, etc.
└── App.js # Main application entry
```

---

## Table of Contents

1. [Backend API](#backend-api)
2. [Installation and Setup](#installation-and-setup)
3. [Features](#features)
4. [Troubleshooting](#troubleshooting--solutions)
5. [Privacy Policy](#privacy-policy)
6. [Documentation Style](#documentation-style)
7. [Issues and Contributing](#issues--contributing)
8. [External Packages and Licenses](#third-party-licenses)

---

## Backend API

This mobile app connects to a Flask-based REST API that I developed separately. It is available as a public repo and/or a deployed Render application. Please note the deployed application uses the free tier of Render so may take some time to spin up.

### API Features

- JWT Authentication
- PostgreSQL database
- RESTful endpoints for climbs and attempts
- Data validation with Marshmallow schemas

### API Repository

[Climbing Tracker of Truth and Josstice Flask API](https://github.com/truth-josstice/dev1002_assessment03)

### Live API

[Climbing Tracker of Truth and Josstice - Render Deployed API](https://climbing-tracker-of-truth-and-josstice.onrender.com/)

### To Run Locally

1. Clone the API repo
2. Follow the install instructions found in the API's Readme documentation.

---

## Installation and Setup

1. Clone or download the project repo
2. Create a .env file in the root directory with the backend API address above if wanting to work directly with deployed API following (.env.example)

- Note: the backend API runs on Render, and will need time to spin up, it is advised to visit the API url and await the spin up to avoid any errors

3. Alternatively, run locally by following the API instructions above, ensuring you run the backend api on `PORT 5000`
4. Type the below command for quick setup (recommended):

```bash
npm run quickstart
```

5. The `quickstart` command runs the below, alternatively you can run them separately:

```bash
npm install
npx expo start --tunnel
```

6. Install the Expo Go Mobile Application

- IOS:
  - Install Expo Go from App Store
- Android
  - Install Expo Go from Google Play Store

7. Scan the provided QR code in your terminal with the Expo Go (android) or Camera app (iOS)

### A note on Expo --tunnel setting

The Expo `--tunnel` command allows for direct communication between a mobile device and the Expo application, accounting for any firewall or connectivity issues.

### A note about iOS testing

This application does not use any platform specific code, and uses only React-Native/Expo APIs, however as I develop on Windows and Android and do not currently have access to iOS or macOS devices, testing has not been completed for these platforms.

---

## Features

- User authentication (register/login/logout)
- View currently listed climbs
- View user attempt history
- Add new climb to application (available to all users)
- Add new attempt for any existing climb (authenticated user only)

---

## Troubleshooting & Solutions

1. **QR Code Not Working**

- Use `npx expo start --tunnel` instead of `npx expo start`
- Ensures connectivity across different networks

2. **Version Warnings**

- Run `npx expo install --fix` to update to compatible versions

3. **Testing on Multiple Platforms**

- Android: Tested on physical devices and emulators
- iOS: Code verified as cross-platform

---

## Privacy Policy

This application uses purely synthetic data for all current users, and does not require accurate/verified information for registration. Currently this application is a proof of concept, and not built for full production level features (deletion of user accounts, dump of all user info would be later in real development phase).

Despite the use case of this application, the only requested personal information is:

- First Name
- Email

These two fields require no verification so do not represent realistic private data.

---

## Documentation Style

The following code comment and documentation has been used throughout the application:

1. **Component Headers:** Each file has purpose, features, and navigation info where applicable
2. **JSDoc Functions:** Reusable functions documented with parameters and returns
3. **Inline Comments:** Explanations for complex logic, API requirements, and business decisions, designed for beginner coders to completely understand each function
4. **Self-Documenting Code:** Clear naming conventions and consistency minimize unnecessary comments

---

## Issues & Contributing

If you experience any issues or want to contribute in any way please do, but follow the below guidelines:

- **Branching and Forking:** Fork the repository and create feature branches from main using descriptive names (feature/user-auth, fix/rating-bug)
- **Conventional Commits:** Follow conventional commit format (feat:, fix:, docs:, style:, refactor:, test:, chore:) for clear commit history
- **Pull Requests:** Pull requests with no explanation will not be merged, please leave detailed comments in your code!
- **Issues:** Issues must be clear and concise, vague issues are non-issues!

---

## Third Party Licenses

| Package                     | Version  | License |
| --------------------------- | -------- | ------- |
| @react-native-picker/picker | 2.11.1   | MIT     |
| @tanstack/react-query       | ^5.90.10 | MIT     |
| axios                       | ^1.13.2  | MIT     |
| expo                        | ~54.0.27 | MIT     |
| expo-secure-store           | ~15.0.8  | MIT     |
| expo-status-bar             | ~3.0.9   | MIT     |
| react                       | 19.1.0   | MIT     |
| react-native                | 0.81.5   | MIT     |
