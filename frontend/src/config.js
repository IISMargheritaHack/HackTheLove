const googleClientId = import.meta.env.GOOGLE_CLIENT_ID ||
  '443648413060-db7g7i880qktvmlemmcnthg4qptclu2l.apps.googleusercontent.com';

const timeReleaseMatch = import.meta.env.TIME_RELEASE_MATCH
  ? new Date(import.meta.env.TIME_RELEASE_MATCH)
  : new Date("2025-02-14T00:00:00Z"); // 2025-02-14T00:00:00Z

export { googleClientId, timeReleaseMatch };
