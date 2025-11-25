export const PLATFORMS = {
        jugit: {
            label: "Jugit GitLab",
            host: "gitlab",
            baseUrl: "https://jugit.fz-juelich.de",
            shortUrl: "jugit.fz-juelich.de",
            apiUrl: "https://jugit.fz-juelich.de/api/v4",
            clientId: "7a61209bc6348b8f53820b16a4a86e012ce64965fbf4581f86c22b455e3b5488",
        },
        helmholtz: {
            label: "Helmholtz GitLab",
            host: "gitlab",
            baseUrl: "https://codebase.helmholtz.cloud",
            shortUrl: "codebase.helmholtz.cloud",
            apiUrl: "https://codebase.helmholtz.cloud/api/v4",
            clientId: "24722afbaa0d7c09566902879811c6552afa6a0bbd2cc421ab3e89af4faa2ed8",
        },
        gitlab: {
            label: "Global GitLab",
            host: "gitlab",
            baseUrl: "https://gitlab.com",
            shortUrl: "gitlab.com",
            apiUrl: "https://gitlab.com/api/v4",
            clientId: "1133e9cee188c31bd68c9d0e8531774a4aae9d2458e13d83e67991213f868007",
        },
        github: {
            label: "GitHub",
            host: "github",
            baseUrl: "https://github.com",
            shortUrl: "github.com",
            apiUrl: "https://api.github.com",
            clientId: "Ov23liQZskHsZ2MKgYhB",
        },
    };

export function setUser(gitPlatform, apiToken, username, name) {
  for (const [key, val] of [
    ["username",     username],
    ["name",         name],
    ["api-token",    apiToken],
    ["git-platform", gitPlatform],
  ]) {
    if (val == null) {
        localStorage.removeItem(key)
    } else {
        localStorage.setItem(key, String(val));
    }
  }
}

export function setGitPlatform(platform_name) {
  localStorage.setItem("git-platform-name", String(platform_name));
}

export function getUsername()           { return localStorage.getItem("username"); }
export function getName()               { return localStorage.getItem("name"); }
export function getApiToken()           { return localStorage.getItem("api-token"); }
export function getGitPlatformName()    { return localStorage.getItem("git-platform-name"); }

export function getGitPlatform(platform = getGitPlatformName()) {
  const key = (platform ?? "").toLowerCase().trim();
  if (!key) return null;

  const entry = PLATFORMS[key];
  if (!entry) return null;

  return entry;
}