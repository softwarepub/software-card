import { BlobReader, TextWriter, ZipReader } from "https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.7.72/+esm";
import { displayJSON } from "./curation.js";

const showDebugInformation = false;

async function gitlabArtifacts () {
    const token = localStorage.getItem("git-api-token");
    if (!token) {
        alert("Please set up the GitLab connection first!");
        window.location = "../git-login/";
        return;
    }

    const url = localStorage.getItem("url");
    const repo = localStorage.getItem("repo");
    const artifactId = localStorage.getItem("artifactId");

    //https://softwarepub.github.io/software-card/callback?type=gitlab&url=https://codebase.helmholtz.cloud&repo=21313&artifactId=3159194

    // --- Job artifacts ---

    const jobArtifactsResponse = await fetch(
        `https://codebase.helmholtz.cloud/api/v4/projects/${repo}/jobs/${artifactId}/artifacts`,
        { headers: { "Content-Type": "application/json", "PRIVATE-TOKEN": token } }
    );

    if (!jobArtifactsResponse.ok) {
        alert("Fetching artifacts failed");
        return;
    }
    console.log(jobArtifactsResponse);

    // this is a zip file :-(
    const artifactsData = await jobArtifactsResponse.blob();

    const zipFileReader = new BlobReader(artifactsData);
    const zipReader = new ZipReader(zipFileReader);
    const fileEntries = await zipReader.getEntries();

    do {
        var fileEntry = fileEntries.shift();
        if (showDebugInformation) {
            console.log(fileEntry);
        }
    } while (fileEntry["filename"] != ".hermes/curate/hermes.json");

    const reportWriter = new TextWriter();
    const reportText = await fileEntry.getData(reportWriter);
    await zipReader.close();


    console.log(reportText);
    displayJSON(JSON.parse(reportText));

}

  export {gitlabArtifacts};