
const showDebugInformation = false;

window.onload = async function () {
    const parameters = new URL(window.location).searchParams;

    if (showDebugInformation) {
        const technicalInformationTextArea = document.getElementById("technical-information");
        parameters.forEach(function (value, key, parent) {
            technicalInformationTextArea.value += key + ": " + value + "\n";
        });
    }
    const token = localStorage.getItem("git-api-token");
    const instanceType = parameters.get("type");
    localStorage.setItem("instance-type", instanceType);
    if(instanceType=="github"){
        const owner = parameters.get("owner");
        const repo = parameters.get("repo");
        const artifactId = parameters.get("artifactId");
        console.log(owner, repo, artifactId);
        localStorage.setItem("owner", owner);
        localStorage.setItem("repo", repo);
        localStorage.setItem("artifactId", artifactId);
        window.location = "../git-login/";


    }else{
        const url = parameters.get("url");
        const repo = parameters.get("repo");
        const artifactId = parameters.get("artifactId");
        console.log(url, repo, artifactId);
        localStorage.setItem("url", url);
        localStorage.setItem("repo", repo);
        localStorage.setItem("artifactId", artifactId);
        window.location = "../git-login/";


    }
}
