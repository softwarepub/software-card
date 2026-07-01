import * as User from "../modules/user.js"

window.onload = async function () {
    // Setup site when user is already logged in
    const savedToken = User.getApiToken();
    if (savedToken) {
        document.getElementById("token-input").value = savedToken;
        const alreadyKnownText = document.getElementById("already-known");
        const name = User.getName();
        const username = User.getUsername();
        // TODO: This feels like a good use case for a web component...
        alreadyKnownText.innerHTML = `You are already authenticated as ${name} (<code>${username}</code>).`;
    }

    // Token save button onclick
    var saveButton = document.getElementById("token-save-button");
    saveButton.onclick = async function () {
        var tokenInput = document.getElementById("token-input");
        const token = tokenInput.value.trim();
        if (token) {
            if (token === savedToken) {
                window.location = "../curation/";
                return;
            }
            const platform_name = User.getGitPlatformName();
            const platform = User.getGitPlatform();
            if (!platform) {
                console.debug("No platform saved.");
                return;
            }
            const headers = { "Content-Type": "application/json" };
            if (token.startsWith("glpat")) {
                headers["PRIVATE-TOKEN"] = token;
            } else {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(platform.apiUrl + "/user", { headers });

            if (!response.ok) {
                alert("Could not authenticate");
                location.reload();
                return;
            }

            const userData = await response.json();

            if (platform.host == "gitlab") {
                localStorage.setItem("git-username", userData["username"]);
                localStorage.setItem("git-name", userData["name"]);
                localStorage.setItem("git-api-token", token);
                User.setUser(platform_name, token, userData["username"], userData["name"]);
            } else {
                localStorage.setItem("git-username", userData["login"]);
                localStorage.setItem("git-name", userData["name"]);
                localStorage.setItem("git-api-token", token);
                User.setUser(platform_name, token, userData["login"], userData["name"]);
            }
            
            window.location = "../curation/";
            return;
        }
    };

    // Show the authorization UI and update button caption & token link
    async function onPlatformSelected(key) {
        const select = document.getElementById("platform-select");
        if (key && select.value != key) {
            select.value = key;
        }
        const platform = User.getGitPlatform(key);
        const authUI   = document.getElementById("auth-ui");
        const oauthBtn = document.getElementById("oauth-button");
        const tokenA   = document.getElementById("token-link");

        // Hide everything if nothing valid is selected
        if (!platform) {
            authUI.classList.add("hidden");
            console.log("hidden");
        } else {
            console.log("show");
            User.setGitPlatform(key);
            // show ui
            authUI.classList.remove("hidden");
            // Update button caption
            oauthBtn.textContent = `Connect to ${platform.shortUrl}`;
            // Update token link
            if (platform.host == "github") { // github
                tokenA.href = `${platform.baseUrl}/settings/personal-access-tokens`
                // diable oauth for GitHub for now
                document.getElementById("oauth-button").disabled = true;
            } else { // gitlab
                tokenA.href = `${platform.baseUrl}/-/user_settings/personal_access_tokens`;
                document.getElementById("oauth-button").disabled = false;
            }
        }
    }

    const REDIRECT_URI = window.location.origin + window.location.pathname;
    const SCOPE_GL     = "read_api";
    const SCOPE_GH     = "read:user user:email repo";

    // PKCE
    const b64url = ab => btoa(String.fromCharCode(...new Uint8Array(ab)))
        .replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
    async function sha256(input) {
        const data = new TextEncoder().encode(input);
        return await crypto.subtle.digest("SHA-256", data);
    }
    function randUrlSafe(len=64){
        const b = crypto.getRandomValues(new Uint8Array(len));
        return b64url(b).slice(0, len);
    }

    function buildUrl(base, path, params) {
        const u = new URL(path, base);
        u.search = params.toString();
        return u.href;
    }

    // Start OAuth
    async function startLoginWithOAuth() {
        const platform = User.getGitPlatform();
        if (!platform) {return;}
        const base_url = platform.baseUrl;
        const client_id = platform.clientId;
        const host = platform.host;

        if (!base_url || !client_id) throw new Error("baseUrl and clientId are required.");

        if (host == "github") {
            const state          = randUrlSafe(24);
            const code_verifier  = randUrlSafe(96);
            const code_challenge = b64url(await sha256(code_verifier));

            sessionStorage.setItem(`pkce_${state}`, JSON.stringify({
                code_verifier, client_id, base_url, REDIRECT_URI
            }));

            const params = new URLSearchParams({
                client_id: client_id,
                redirect_uri: REDIRECT_URI,
                response_type: "code",
                scope: SCOPE_GH,
                state,
                code_challenge,
                code_challenge_method: "S256",
            });

            const auth_url = new URL("/login/oauth/authorize", base_url);
            auth_url.search = params.toString();
            console.log("Authorize URL:", auth_url);
            location.assign(auth_url.toString());

        } else if (host == "gitlab") {
            const state          = randUrlSafe(24);
            const code_verifier  = randUrlSafe(96);
            const code_challenge = b64url(await sha256(code_verifier));

            sessionStorage.setItem(`pkce_${state}`, JSON.stringify({
                code_verifier, client_id, base_url, REDIRECT_URI
            }));

            const params = new URLSearchParams({
                client_id: client_id,
                redirect_uri: REDIRECT_URI,
                response_type: "code",
                scope: SCOPE_GL,
                state,
                code_challenge,
                code_challenge_method: "S256",
            });

            const auth_url = buildUrl(base_url, "/oauth/authorize", params);
            console.log("Authorize URL:", auth_url);
            location.assign(auth_url);
        }
    }

    // OAuth Callback
    async function handleCallback() {
        const url = new URL(location.href);
        const code  = url.searchParams.get("code");
        const state = url.searchParams.get("state");

        const savedState   = JSON.parse(sessionStorage.getItem(`pkce_${state}`));
        if (!savedState) return;
        const codeVerifier = savedState["code_verifier"];

        console.debug("Callback:", { savedState, origin: location.origin, state, storageKeys: Object.keys(sessionStorage), code, url, codeVerifier });
        
        if (!code) return;

        console.debug("Got code", code)

        const platform = User.getGitPlatform();
        if (!platform) {
            console.debug("No Git Platform saved. Callback invalid.");
            location.reload();
            return;
        }

        const base_url = platform.baseUrl
        const client_id = platform.clientId

        console.debug("Getting token from", platform.label) 

        const body = new URLSearchParams({
            client_id: client_id,
            grant_type: "authorization_code",
            code,
            redirect_uri: REDIRECT_URI,
            code_verifier: codeVerifier,
        });
        let tokenUrl = `${base_url}/oauth/token`;
        if (platform.host == "github") {
            // tokenUrl = "/cgi-bin/github-token.py";
            // tokenUrl = "https://github.com/login/oauth/access_token"
            throw new Error("GitHub Oauth callbacks are not supported");
        }
        console.debug("Fetching from ", tokenUrl);
        const resp = await fetch(tokenUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json" },
            body
        });

        // Check response
        const raw = await resp.text();
        console.debug("Token raw response:", raw || "(empty)");
        if (!resp.ok) {
            throw new Error(`Git Host Error ${resp.status}: ${raw || "(empty body)"}`);
        }
        if (!raw) {
            throw new Error("Git Host returned empty body");
        }

        // Get token from response
        let token;
        try {
            token = JSON.parse(raw);
        } catch (e) {
            throw new Error("Token response is not valid JSON: " + raw);
        }

        // clean up url
        history.replaceState({}, "", REDIRECT_URI);

        // save token
        var tokenInput = document.getElementById("token-input");
        var saveButton = document.getElementById("token-save-button");
        console.debug("Token received: ", token.access_token)
        tokenInput.value = token.access_token;
        saveButton.onclick();
    }

    // Connect OAuth button
    document.getElementById("oauth-button").onclick = () => startLoginWithOAuth();

    // build platform selection
    const select = document.getElementById("platform-select");
    for (const [key, entry] of Object.entries(User.PLATFORMS)) {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = entry.label;
        select.appendChild(opt);
    }
    // call once to enforce the default hidden state
    onPlatformSelected(User.getGitPlatformName() || select.value || null);
    // update when the user changes the selection
    select.addEventListener("change", (e) => {
        onPlatformSelected(e.target.value || null);
    });

    handleCallback().catch(err => {
        alert("Error:\n" + (err?.message || err));
        location.reload();
        return;
    });
};
