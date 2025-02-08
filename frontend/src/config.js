const googleClientId = import.meta.env.GOOGLE_CLIENT_ID ||
  '443648413060-db7g7i880qktvmlemmcnthg4qptclu2l.apps.googleusercontent.com';

const timeReleaseMatch = import.meta.env.TIME_RELEASE_MATCH || Date.now() + 2; // To review

export { googleClientId, timeReleaseMatch };
