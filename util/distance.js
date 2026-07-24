/** Earth radius in meters (mean). */
const EARTH_RADIUS_M = 6371000;

function toRad(value) {
  return (value * Math.PI) / 180;
}

export function distanceMeters(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * EARTH_RADIUS_M * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Human-readable distance: meters under 1 km, otherwise kilometers. */
export function formatDistance(meters) {
  if (meters == null || !Number.isFinite(meters)) {
    return null;
  }
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = meters / 1000;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

export function withDistances(places, userLat, userLng) {
  return places.map((place) => ({
    ...place,
    distanceMeters: distanceMeters(userLat, userLng, place.lat, place.lng),
  }));
}

export function sortPlacesByDistance(places) {
  return [...places].sort((a, b) => {
    const aDist = a.distanceMeters ?? Number.POSITIVE_INFINITY;
    const bDist = b.distanceMeters ?? Number.POSITIVE_INFINITY;
    return aDist - bDist;
  });
}
