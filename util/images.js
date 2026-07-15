export const MAX_PLACE_PHOTOS = 8;

export function parseImageUris(value) {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.filter((uri) => typeof uri === "string" && uri.length > 0);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter((uri) => typeof uri === "string" && uri.length > 0);
        }
      } catch {
        // Fall through and treat as a legacy single URI.
      }
    }
    return [value];
  }
  return [];
}

export function serializeImageUris(uris) {
  return JSON.stringify(parseImageUris(uris));
}

export function getPrimaryImageUri(placeOrUris) {
  if (Array.isArray(placeOrUris)) {
    return parseImageUris(placeOrUris)[0] ?? null;
  }
  const uris = parseImageUris(placeOrUris?.imageUris ?? placeOrUris?.imageUri);
  return uris[0] ?? null;
}
