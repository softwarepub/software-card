window.onload = async function () {
    const savedToken = localStorage.getItem("gitlab-api-token");
    if (savedToken) {
        document.getElementById("token-input").value = savedToken;
        const alreadyKnownText = document.getElementById("already-known");
        const name = localStorage.getItem("gitlab-name");
        const username = localStorage.getItem("gitlab-username");
        // TODO: This feels like a good use case for a web component...
        alreadyKnownText.innerHTML = `You are already authenticated as ${name} (<code>${username}</code>).`;
    }

    var saveButton = document.getElementById("token-save-button");
    saveButton.onclick = async function () {
        var tokenInput = document.getElementById("token-input");
        const token = tokenInput.value.trim();
        if (token) {
            if (token === savedToken) {
                window.location = "../";
                return;
            }

            if (!token.startsWith("glpat")) {
                alert("Token is invalid");
                location.reload();
                return;
            }

            const response = await fetch("https://codebase.helmholtz.cloud/api/v4/user", {
                headers: { "Content-Type": "application/json", "PRIVATE-TOKEN": token }
            });

            if (!response.ok) {
                alert("Could not authenticate");
                location.reload();
                return;
            }

            const userData = await response.json();
            localStorage.setItem("gitlab-username", userData["username"]);
            localStorage.setItem("gitlab-name", userData["name"]);
            localStorage.setItem("gitlab-api-token", token);

            window.location = "./";
            return;
        }
    };

    const GITLAB_APP_URLS = {
        "helmholtz": "https://codebase.helmholtz.cloud",
        "jugit": "https://jugit.fz-juelich.de",
    };
    const GITLAB_APP_IDS = {
        "helmholtz": "24722afbaa0d7c09566902879811c6552afa6a0bbd2cc421ab3e89af4faa2ed8",
        "jugit": "7a61209bc6348b8f53820b16a4a86e012ce64965fbf4581f86c22b455e3b5488",
    };

    const REDIRECT_URI = location.origin + location.pathname;
    const SCOPE        = "read_api";

    // PKCE Stuff
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

    async function startLogin(app_name) {
        const base_url = GITLAB_APP_URLS[app_name]
        const client_id = GITLAB_APP_IDS[app_name]

        if (!base_url || !client_id) throw new Error("baseUrl and clientId are required.");

        const state          = randUrlSafe(24);
        const code_verifier  = randUrlSafe(96);
        const code_challenge = b64url(await sha256(code_verifier));

        sessionStorage.setItem(`pkce_${state}`, JSON.stringify({
            code_verifier, client_id, base_url, REDIRECT_URI, last_app_name: app_name
        }));

        const params = new URLSearchParams({
            client_id: client_id,
            redirect_uri: REDIRECT_URI,
            response_type: "code",
            scope: SCOPE,
            state,
            code_challenge,
            code_challenge_method: "S256",
        });

        const auth_url = buildUrl(base_url, "/oauth/authorize", params);
        console.debug("Authorize URL:", auth_url);
        location.assign(auth_url);
    }

    // Callback
    async function handleCallback() {
        const url = new URL(location.href);
        const code  = url.searchParams.get("code");
        const state = url.searchParams.get("state");

        const savedState   = JSON.parse(sessionStorage.getItem(`pkce_${state}`));
        if (!savedState) return;
        const codeVerifier = savedState["code_verifier"];
        const app_name = savedState["last_app_name"];

        console.debug("Callback:", { savedState, origin: location.origin, state, storageKeys: Object.keys(sessionStorage), code, url, codeVerifier, app_name });
        
        if (!code) return;
        if (!app_name) return;

        const base_url = GITLAB_APP_URLS[app_name]
        const client_id = GITLAB_APP_IDS[app_name]

        console.debug("Getting token from", app_name) 

        document.querySelector("#token-output").textContent = "Waiting for token ..."

        const body = new URLSearchParams({
            client_id: client_id,
            grant_type: "authorization_code",
            code,
            redirect_uri: REDIRECT_URI,
            code_verifier: codeVerifier,
        });

        const resp = await fetch(`${base_url}/oauth/token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body
        });
        if (!resp.ok) {
            console.debug("Fail: ", app_name)
            document.querySelector("#token-output").textContent = "Token exchange failed:\n" + await resp.text();
            return;
        }
        const token = await resp.json();

        // clean up url
        history.replaceState({}, "", REDIRECT_URI);

        // show token
        document.querySelector("#token-output").textContent = token.access_token ?? "(no access_token)";
        if (token.access_token) {
            return;
        }
    }

    document.getElementById("oauth-helmholtz-button").onclick = () => startLogin("helmholtz");

    document.getElementById("oauth-jugit-button").onclick = () => startLogin("jugit");

    handleCallback().catch(err => {
        document.querySelector("#token-output").textContent = "Error:\n" + (err?.message || err);
    });
};
