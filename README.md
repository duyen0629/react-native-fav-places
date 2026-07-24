# Favorite Places

A React Native app built with Expo for saving and browsing your favorite places. Add a title, add photos, pick a location, and keep everything stored locally on your device.

## Features

- **Places list** — View all saved places with cover photo, title, address, and category. A badge shows when a place has multiple photos. Filter by category on the home screen. Sort by **Default** or **Nearest** (distance from your GPS). The list refreshes when you return to the home screen.
- **Add a place** — Form with auto-prefilled title (`Fav 1`, `Fav 2`, …), category picker, multi-photo picker, and location picker.
- **Edit a place** — From place details, tap the edit icon to update title, category, photos, or location. Changes are written back to SQLite.
- **Multi-photo** — Take photos with the camera and/or upload several from the library (up to 8). Manage thumbnails and remove photos before saving (`expo-image-picker`).
- **Location** — Tap **Get Location** to read GPS, open an interactive map centered on your position, adjust the pin if needed, and save (`expo-location`, `react-native-maps`). When a location is already set (e.g. while editing), the map opens centered on that place so you can adjust the pin.
- **Map preview** — Static map image for the picked location via Google Maps Static API.
- **Reverse geocoding** — Resolve coordinates to a human-readable address via Google Geocoding API.
- **Place details** — Tap a place to swipe through its photo gallery, see address, and open its location on the map. Edit or delete from the header. Toggle **Alert me nearby** to watch that place.
- **Nearby alerts** — Get a local notification when you approach an alert-enabled place. Global on/off, radius (100 / 200 / 500 m), and a foreground “Check nearby now” action. Uses geofencing in the background plus a foreground fallback when the app becomes active (`expo-location`, `expo-notifications`, `expo-task-manager`).
- **Local persistence** — Places are saved in SQLite and survive app restarts (`expo-sqlite`).
- **Pink UI** — Soft pink theme with rounded cards, pill buttons, and solid icon controls in the header.

## How it works

```
AllPlaces ──► tap + ──► AddPlace (PlaceForm, fresh draft)
                              │
                              ├── ImagePicker (camera and/or multi-upload)
                              ├── LocationPicker
                              │       └── Get Location (GPS) ──► Map (pick & save)
                              │                                      │
                              │                                      └── popTo AddPlace (keeps form data)
                              └── Save ──► SQLite ──► popToTop ──► AllPlaces (no back button)

AllPlaces ──► tap place ──► PlaceDetails (swipe gallery) ──► View on Map ──► Map (read-only)
                            │
                            ├── Alert me nearby ──► enable geofence for this place
                            ├── edit ──► EditPlace (PlaceForm, prefilled)
                            │                 │
                            │                 ├── change photos / location as needed
                            │                 │       └── Map ──► popTo EditPlace
                            │                 └── Update ──► SQLite ──► goBack ──► PlaceDetails (refreshed)
                            └── trash ──► delete ──► goBack ──► AllPlaces

AllPlaces ──► bell icon ──► NearbyAlerts (global on/off, radius, check now)
AllPlaces ──► Sort: Default | Nearest ──► list ordered by GPS distance (shows km/m on each row)
```

**Adding a place**

1. Tap **+** on the home screen — the form opens with the title prefilled as `Fav {n}` (`n` = number of saved places + 1; e.g. 0 places → `Fav 1`).
2. Choose a **category** (Restaurant / Cafe, Entertainment, Shopping, etc.).
3. Optionally edit the title, add one or more photos (**Take Photo** and/or **Upload**), then tap **Get Location**.
4. The app requests location permission, reads GPS, and opens **Map** centered on your position.
5. Tap elsewhere on the map to move the pin, then tap **✓** in the header to confirm.
6. You return to the add-place form with a static map preview and reverse-geocoded address. Title, photos, category, and other form data are preserved while visiting the map.
7. Tap **Save My Place** — the place is written to SQLite and the app returns to **Favorite Places** via `popToTop()`, clearing the stack so no back button appears.

**Form state & navigation**

- **`util/addPlaceDraft.js`** — In-memory draft store keeps title, category, photos, and location while the add-place screen is inactive (e.g. when visiting the map).
- **`resetForm: true`** — Passed when tapping **+** so each new add session starts with a fresh form and a new `Fav {n}` title.
- **`popTo("AddPlace" | "EditPlace")`** — Map returns to the screen that opened it (`returnScreen` route param) and passes picked coordinates, instead of pushing a new form screen.
- **`popToTop()`** — Called after a successful save to return to the root **Favorite Places** screen and remove Add Place / Map from the stack (no back button on the home screen).
- **`freezeOnBlur`** — Enabled on Add Place and Edit Place to help preserve form state when navigating away.

**Photos**

- Up to **8** photos per place.
- **Take Photo** opens the camera and appends one image.
- **Upload** opens the photo library with multi-select (`allowsMultipleSelection`).
- Thumbnails can be removed before save. Existing places with a single legacy URI still load correctly (`util/images.js` parses JSON arrays or a plain URI).
- Place details uses a swipeable gallery with page dots when there is more than one photo.

**Editing a place**

1. Open a place from the list to open **Place Details**.
2. Tap the **edit** icon in the header.
3. The **Edit Place** form opens prefilled with the current title, category, photos, and location.
4. Change any fields. **Get Location** reopens the map centered on the existing pin (no new GPS read) so you can adjust it; confirming returns via `popTo("EditPlace")`.
5. Tap **Update Place** — the row is updated in SQLite and you return to **Place Details**, which reloads on focus to show the latest data.

**Viewing a saved place on the map**

From **Place Details**, **View on Map** opens the map in read-only mode (`readOnly: true`) — the pin is shown but cannot be moved and there is no save button.

**Sort by distance**

1. On the home screen, use the **Sort** chips under the category filter: **Default** (saved order) or **Nearest**.
2. Choosing **Nearest** requests foreground location if needed, then sorts the current category filter by distance from you.
3. Each row shows a distance label (`240 m`, `1.2 km`, …) while Nearest is active.
4. If location is denied, the app stays on **Default** and prompts you to open Settings.

**Nearby alerts**

1. Tap the **bell** icon on the home screen to open **Nearby Alerts**.
2. Turn **Nearby alerts** on — the app asks for notification permission, foreground location, then background / Always location.
3. Choose an alert **radius** (100 m, 200 m, or 500 m).
4. Open a place and enable **Alert me nearby**. That place is registered as a geofence region (up to **20** places, matching the iOS limit).
5. When you enter a watched region, a local notification plays (`assets/notification_sound.wav`) with the place title. Tapping it opens **Place Details**.
6. The same place will not notify again for **2 hours** (cooldown), so app restarts / re-registration do not spam you.
7. **Check nearby now** (and an automatic check when the app returns to the foreground) compare your current GPS position to alert-enabled places — useful in Expo Go, where background geofencing is limited.

Geofencing is defined in `util/geofencingTask.js` and must stay imported early from `index.js` so the task is registered when the OS wakes the app in the background. Syncing regions happens whenever alerts settings change, a place’s alert toggle changes, or a place is added / updated / deleted (`util/nearbyAlerts.js` → `syncGeofences()`).

> **Note:** Full background geofencing requires a **development build** or production binary with the `expo-location` / `expo-notifications` config plugins applied. In Expo Go, use **Check nearby now** / foreground checks to verify alerts. Remote push is not used; we only schedule local notifications. On Android Expo Go, importing the main `expo-notifications` entry can show a push-related console error — this project imports local APIs only via `util/localNotifications.js` to avoid that.

When adding or editing a place, data is stored in the `Place` model and written to SQLite as flat columns (`title`, `imageUri`, `address`, `lat`, `lng`, `category`, `alertEnabled`). The `imageUri` column stores a JSON array of local photo URIs (legacy single-URI values are still supported when reading). When reading from the database, rows expose `imageUris` and use `lat`/`lng` directly rather than a nested `location` object.

## Tech stack

- [Expo SDK 54](https://docs.expo.dev/)
- React 19 / React Native 0.81
- [React Navigation](https://reactnavigation.org/) (native stack)
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) — local database
- [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) — camera and multi-photo library upload
- [expo-location](https://docs.expo.dev/versions/v54.0.0/sdk/location/) — device location and geofencing
- [expo-notifications](https://docs.expo.dev/versions/v54.0.0/sdk/notifications/) — local nearby-place alerts
- [expo-task-manager](https://docs.expo.dev/versions/v54.0.0/sdk/task-manager/) — background geofence task
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
| Photo library         | Uploading one or more photos from the device library  |
| Location (foreground) | GPS for **Get Location**, map centering, and nearby checks |
| Location (background / Always) | Geofencing for nearby alerts while the app is closed |
| Notifications         | Local alerts when you approach a watched place        |

Camera and photos permission text is configured in `app.json` via the `expo-image-picker` plugin. Location and notification copy / background modes are configured via the `expo-location` and `expo-notifications` plugins.

## Project structure

```
fav-places/
├── App.js                     # Navigation stack, DB init, splash, notification → place deep link
├── app.json                   # Expo config and plugins (location, notifications, image picker)
├── assets/
│   └── notification_sound.wav # Custom nearby-alert notification sound
├── constants/
│   ├── categories.js          # Place category list and icons
│   ├── colors.js              # Pink theme palette
│   └── nearbyAlerts.js        # Geofence task name, radius options, cooldown
├── components/
│   ├── Places/
│   │   ├── CategoryFilter.js  # Home screen category filter chips
│   │   ├── CategoryPicker.js  # Category dropdown selector
│   │   ├── ImagePicker.js     # Camera + multi-upload, thumbnail strip
│   │   ├── LocationPicker.js  # Get Location → Map, static map preview
│   │   ├── PlaceForm.js       # Add/edit form, title prefill, draft sync
│   │   ├── PlaceItem.js       # Single place row (navigates to details)
│   │   ├── PlacesList.js      # FlatList of places
│   │   └── SortFilter.js      # Default / Nearest sort chips
│   └── UI/
│       ├── Button.js
│       ├── IconButton.js      # Header action buttons (circular, matches back button)
│       └── OutlinedButton.js  # Solid-icon + label button
├── models/
│   └── place.js               # Place data model
├── screens/
│   ├── AllPlaces.js           # Home — loads places; map / alerts / add; nearest sort
│   ├── AddPlace.js            # Saves a new place, clears draft, popToTop
│   ├── EditPlace.js           # Loads a place, updates SQLite, goBack to details
│   ├── Map.js                 # Interactive map (pick & save, or read-only view)
│   ├── NearbyAlerts.js        # Global nearby-alert settings
│   ├── PlacesMap.js           # All saved places on one map
│   └── PlaceDetails.js        # Gallery, per-place alert toggle, edit, delete, "View on Map"
└── util/
    ├── addPlaceDraft.js       # In-memory form draft (title, photos, location)
    ├── database.js            # SQLite init, CRUD, settings, alertEnabled
    ├── distance.js            # Haversine distance + nearest-sort helpers
    ├── geofencingTask.js      # TaskManager geofence enter → notification
    ├── images.js              # Parse/serialize multi-photo URI lists
    ├── location.js            # Google Static Maps URL + geocoding
    ├── localNotifications.js  # Deep imports for local alerts (avoids Expo Go push error)
    └── nearbyAlerts.js        # Permissions, sync geofences, notify, foreground check
```

## Database schema

Places are stored in a local SQLite database (`places.db`):

| Column         | Type    | Description                                              |
| -------------- | ------- | -------------------------------------------------------- |
| `id`           | INTEGER | Primary key (auto)                                       |
| `title`        | TEXT    | Place name                                               |
| `imageUri`     | TEXT    | JSON array of local photo URIs (legacy single URI OK)    |
| `address`      | TEXT    | Reverse-geocoded address                                 |
| `lat`          | REAL    | Latitude                                                 |
| `lng`          | REAL    | Longitude                                                |
| `category`     | TEXT    | Place category                                           |
| `alertEnabled` | INTEGER | `1` if this place should trigger nearby alerts           |

App settings (nearby alerts on/off, radius, per-place notify cooldown timestamps) are stored in a `settings` key/value table.

## Environment variables

| Variable                     | Description                                              |
| ---------------------------- | -------------------------------------------------------- |
| `EXPO_PUBLIC_GOOGLE_API_KEY` | Google API key with Maps Static and Geocoding API access |

See `.env.example`. Do not commit `.env.local` (it is gitignored).

## License

Private project.
