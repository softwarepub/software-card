import { deleteAllPipelines } from "/modules/storage.js";

window.onload = async function () {
    const gitLabName = localStorage.getItem("gitlab-name");
    if (gitLabName) {
        const welcomeUsernameSpan = document.getElementById("welcome-username");
        welcomeUsernameSpan.innerText = ", " + gitLabName;
    }

    const clearAllDataButton = document.getElementById("clear-all-data-button");
    clearAllDataButton.onclick = async function() {
        localStorage.clear();
        console.log("Local storage cleared");
        await deleteAllPipelines();
        window.location = "/";
    }
}
