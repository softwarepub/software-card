import { retrievePipeline } from "/modules/storage.js";
import { BlobReader, TextWriter, ZipReader } from 'https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.7.72/+esm'

const showDebugInformation = false;

window.onload = async function () {
    const token = localStorage.getItem("gitlab-api-token");
    if (!token) {
        alert("Please set up the GitLab connection first!");
        window.location = "/";
        return;
    }

    var [projectId, pipelineId, jobId] = await retrievePipeline();

    // --- Pipeline info ---

    const pipelineResponse = await fetch(
        `https://codebase.helmholtz.cloud/api/v4/projects/${projectId}/pipelines/${pipelineId}`,
        { headers: { "Content-Type": "application/json", "PRIVATE-TOKEN": token } }
    );

    if (!pipelineResponse.ok) {
        alert("Fetching pipeline failed");
        return;
    }

    const pipelineData = await pipelineResponse.json();
    const pipelineStatus = pipelineData["status"];
    const pipelineUrl = pipelineData["web_url"];

    const pipelineInfoParagraph = document.getElementById("pipeline-info");
    pipelineInfoParagraph.innerHTML = `Pipeline <a href="${pipelineUrl}">${pipelineId}</a> status: ${pipelineStatus}.`

    // --- Job artifacts ---

    const jobArtifactsResponse = await fetch(
        `https://codebase.helmholtz.cloud/api/v4/projects/${projectId}/jobs/${jobId}/artifacts`,
        { headers: { "Content-Type": "application/json", "PRIVATE-TOKEN": token } }
    );

    if (!jobArtifactsResponse.ok) {
        alert("Fetching artifacts failed");
        return;
    }

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
    } while (fileEntry["filename"] != "public/validation-report.ttl");

    const reportWriter = new TextWriter();
    const reportText = await fileEntry.getData(reportWriter);
    await zipReader.close();

    console.log(reportText);

    const reportContentsTextArea = document.getElementById("report-contents");
    reportContentsTextArea.value = reportText;
};
