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
                window.location = "/";
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
};
