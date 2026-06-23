# Favorite Places

A React Native app built with Expo for saving and browsing your favorite places. Add a title, capture a photo, pick a location, and keep everything stored locally on your device.

## Features

- **Places list** — View all saved places with photo, title, and address. The list refreshes when you return to the home screen.
- **Add a place** — Form with title input, camera image picker, and location picker.
- **Camera** — Take and preview a photo for each place (`expo-image-picker`).
- **Location** — Get the device's current GPS coordinates or pick a spot on an interactive map (`expo-location`, `react-native-maps`).
- **Map preview** — Static map image for the picked location via Google Maps Static API.
- **Reverse geocoding** — Resolve coordinates to a human-readable address via Google Geocoding API.
- **Place details** — Tap a place to see its full photo, address, and open its location on the map.
- **Local persistence** — Places are saved in SQLite and survive app restarts (`expo-sqlite`).

## How it works

```
AllPlaces ──► tap + ──► AddPlace (PlaceForm)
                              │
                              ├── ImagePicker (camera)
                              ├── LocationPicker
                              │       ├── Get Location (GPS)
                              │       └── Pick on Map ──► Map
                              └── Save ──► SQLite

AllPlaces ──► tap place ──► PlaceDetails ──► View on Map ──► Map (read-only)
```

When adding a place, data is stored in the `Place` model and written to SQLite as flat columns (`title`, `imageUri`, `address`, `lat`, `lng`). When reading from the database, rows use `lat`/`lng` directly rather than a nested `location` object.

## Tech stack

- [Expo SDK 54](https://docs.expo.dev/)
- React 19 / React Native 0.81
- [React Navigation](https://reactnavigation.org/) (native stack)
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) — local database
- [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) — camera access
- [expo-location](https://docs.expo.dev/versions/latest/sdk/location/) — device location
- [react-native-maps](https://docs.expo.dev/versions/latest/sdk/map-view/) — interactive map
- Google Maps Static API — map preview images
- Google Geocoding API — address lookup from coordinates

## Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- [Expo Go](https://expo.dev/go) on a physical device, or iOS Simulator / Android Emulator
- A Google Cloud project with **Maps Static API** and **Geocoding API** enabled and billing configured

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
2. Enable **Maps Static API** and **Geocoding API** for the project.
3. Create an API key under **APIs & Services → Credentials**.
4. On the API key, add both APIs to the allowed list, or use "Don't restrict key" during development.
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

| Permission            | Used for                                              |
| --------------------- | ----------------------------------------------------- |
| Camera                | Taking photos for places                              |
| Location (foreground) | Reading GPS coordinates for "Get Location"            |

Camera permission text is configured in `app.json` via the `expo-image-picker` plugin.

## Project structure

```
fav-places/
├── App.js                     # Navigation stack, DB init, splash screen
├── app.json                   # Expo config and plugins
├── constants/
│   └── colors.js              # Theme colors
├── components/
│   ├── Places/
│   │   ├── ImagePicker.js     # Camera capture and preview
│   │   ├── LocationPicker.js  # GPS, map pick, static map preview
│   │   ├── PlaceForm.js       # Add-place form
│   │   ├── PlaceItem.js       # Single place row (navigates to details)
│   │   └── PlacesList.js      # FlatList of places
│   └── UI/
│       ├── Button.js
│       ├── IconButton.js
│       └── OutlinedButton.js  # Icon + label button
├── models/
│   └── place.js               # Place data model
├── screens/
│   ├── AllPlaces.js           # Home — loads and displays saved places
│   ├── AddPlace.js            # Saves a new place to SQLite
│   ├── Map.js                 # Interactive map (pick or view location)
│   └── PlaceDetails.js        # Place detail view with "View on Map"
└── util/
    ├── database.js            # SQLite init, insert, fetch
    └── location.js            # Google Static Maps URL + geocoding
```

## Database schema

Places are stored in a local SQLite database (`places.db`):

| Column     | Type    | Description              |
| ---------- | ------- | ------------------------ |
| `id`       | INTEGER | Primary key (auto)       |
| `title`    | TEXT    | Place name               |
| `imageUri` | TEXT    | Local URI of the photo   |
| `address`  | TEXT    | Reverse-geocoded address |
| `lat`      | REAL    | Latitude                 |
| `lng`      | REAL    | Longitude                |

## Environment variables

| Variable                     | Description                                              |
| ---------------------------- | -------------------------------------------------------- |
| `EXPO_PUBLIC_GOOGLE_API_KEY` | Google API key with Maps Static and Geocoding API access |

See `.env.example`. Do not commit `.env.local` (it is gitignored).

## License

Private project.
