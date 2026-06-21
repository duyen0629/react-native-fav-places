# Favorite Places

A React Native app built with Expo for saving and browsing your favorite places. Add a title, capture a photo, and attach a location to each place.

## Features

- **Places list** — Browse saved places (list UI ready; persistence not yet wired up)
- **Add a place** — Form with title input, camera image picker, and location picker
- **Camera** — Take and preview a photo for each place (`expo-image-picker`)
- **Location** — Get the device’s current GPS coordinates (`expo-location`)
- **Map preview** — Static map image for the picked location via Google Maps Static API

### Planned / in progress

- Save places and display them on the list
- Pick a location on an interactive map (`Map` screen)
- Place details view (`PlaceDetails` screen)

## Tech stack

- [Expo SDK 54](https://docs.expo.dev/)
- React 19 / React Native 0.81
- [React Navigation](https://reactnavigation.org/) (native stack)
- [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) — camera access
- [expo-location](https://docs.expo.dev/versions/latest/sdk/location/) — device location
- Google Maps Static API — map preview images

## Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- [Expo Go](https://expo.dev/go) on a physical device, or iOS Simulator / Android Emulator
- A Google Cloud project with **Maps Static API** enabled and billing configured

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the Google Maps API key

Copy the example env file and add your key:

```bash
cp .env.example .env.local
```

Set `EXPO_PUBLIC_GOOGLE_API_KEY` in `.env.local`. Expo loads variables prefixed with `EXPO_PUBLIC_` at build time.

**Google Cloud setup**

1. Create or select a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Enable **Maps Static API** for the project.
3. Create an API key under **APIs & Services → Credentials**.
4. On the **API key** (not just the project), add **Maps Static API** to the allowed APIs list, or use “Don’t restrict key” during development.
5. For development with Expo Go, set **Application restrictions** to **None**. HTTP referrer restrictions do not work for mobile app requests.

Restart the dev server after changing env files:

```bash
npx expo start -c
```

### 3. Run the app

```bash
npm start
```

Then press `i` for iOS Simulator, `a` for Android Emulator, or scan the QR code with Expo Go.

Other scripts:

```bash
npm run ios      # start and open iOS
npm run android  # start and open Android
npm run web      # start web target
```

## Permissions

The app requests permissions at runtime:

| Permission            | Used for                                   |
| --------------------- | ------------------------------------------ |
| Camera                | Taking photos for places                   |
| Location (foreground) | Reading GPS coordinates for “Get Location” |

Camera permission text is configured in `app.json` via the `expo-image-picker` plugin.

## Project structure

```
fav-places/
├── App.js                 # Navigation stack and app shell
├── app.json               # Expo config
├── constants/
│   └── colors.js          # Theme colors
├── components/
│   ├── Places/
│   │   ├── ImagePicker.js     # Camera capture and preview
│   │   ├── LocationPicker.js  # GPS + static map preview
│   │   ├── PlaceForm.js       # Add-place form
│   │   ├── PlaceItem.js       # Single place row
│   │   └── PlacesList.js      # FlatList of places
│   └── UI/
|       |── IconButton.js
│       └── OutlinedButton.js  # Icon + label button
├── models/
│   └── place.js           # Place data model
├── screens/
│   ├── AllPlaces.js       # Home — places list
│   ├── AddPlace.js        # Add a new place
│   ├── Map.js             # (planned) interactive map
│   └── PlaceDetails.js    # (planned) place detail view

└── util/
    └── location.js        # Google Static Maps URL helper
```

## Environment variables

| Variable                     | Description                                |
| ---------------------------- | ------------------------------------------ |
| `EXPO_PUBLIC_GOOGLE_API_KEY` | Google API key with Maps Static API access |

See `.env.example`. Do not commit `.env.local` (it is gitignored).

## License

Private project.
