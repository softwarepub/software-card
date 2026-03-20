import { deleteAllPipelines } from "./modules/storage.js";
import * as User from "/modules/user.js"

window.onload = async function () {
    const username = User.getName() || User.getUsername();
    if (username) {
        const welcomeUsernameSpan = document.getElementById("welcome-username");
        welcomeUsernameSpan.innerText = ", " + username;
    }

    const clearAllDataButton = document.getElementById("clear-all-data-button");
    clearAllDataButton.onclick = async function() {
        localStorage.clear();
        console.log("Local storage cleared");
        await deleteAllPipelines();
        window.location = "./";
    }
    
    const clearPipelineDataButton = document.getElementById("clear-pipeline-button");
    clearPipelineDataButton.onclick = async function() {
        await deleteAllPipelines();
        window.location = "./";
    }
}
