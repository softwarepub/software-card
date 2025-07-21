window.onload = async function () {
    const clearAllDataButton = document.getElementById("clear-all-data-button")
    clearAllDataButton.onclick = function() {
        localStorage.clear();
        alert("All data was cleared");
        window.location = "/";
    }
}
