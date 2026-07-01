import { BlobReader, TextWriter, ZipReader } from "https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.7.72/+esm";
import { Octokit } from "https://esm.sh/@octokit/rest";
import { displayJSON } from "./curation.js";

const showDebugInformation = false;

async function githubArtifacts() {
    const token = localStorage.getItem("git-api-token");
    if (!token) {
        alert("Please set up the GitLab connection first");
        window.location = "../git-login/";
        return;
    }
    const owner = localStorage.getItem("owner");
    const repo = localStorage.getItem("repo");
    const artifactId = localStorage.getItem("artifactId");
    
    const octokit = new Octokit({
  auth: token
})

//https://softwarepub.github.io/software-card/callback/?type=github&owner=softwarepub&repo=software-card-showcase&artifactId=7291062769
//https://github.com/softwarepub/software-card-showcase/actions/runs/26636754684/artifacts/7290497137
    // --- Job artifacts ---
const artifact =  await octokit.request(`GET /repos/${owner}/${repo}/actions/artifacts/${artifactId}/zip`, {
  owner: `${owner}`,
  repo: `${repo}`,
  artifact_id: `${artifactId}`,
  archive_format: 'zip',
  headers: {
    'X-GitHub-Api-Version': '2026-03-10'
  }
})
if (artifact.status !== 200) {
    alert("Fetching artifacts failed");
    }


const response = await fetch(artifact.url);


    // this is a zip file :-(
    const artifactsData = await response.blob();
    

    const zipFileReader = new BlobReader(artifactsData);
    const zipReader = new ZipReader(zipFileReader);
    const fileEntries = await zipReader.getEntries();
    

    do {
        var fileEntry = fileEntries.shift();
        if (showDebugInformation) {
            console.log(fileEntry);
        }
    } while (fileEntry["filename"] != "hermes.json");

    const reportWriter = new TextWriter();
    const reportText = await fileEntry.getData(reportWriter);
    await zipReader.close();

    console.log(reportText);
    displayJSON(JSON.parse(reportText)["curate"]);

    //const reportContentsTextArea = document.getElementById("report-contents");
    //reportContentsTextArea.value = reportText;

};

export {githubArtifacts};