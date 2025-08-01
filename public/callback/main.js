import { addPipelineIdToQueue } from '/modules/storage.js'

window.onload = async function () {
    const parameters = new URL(window.location).searchParams;
    const technicalInformationTextArea = document.getElementById("technical-information");
    parameters.forEach(function (value, key, parent) {
        technicalInformationTextArea.value += key + ": " + value + "\n";
    });

    const gitLabProjectId = parameters.get("gitlab_project_id");
    const gitLabPipelineId = parameters.get("gitlab_pipeline_id");

    addPipelineIdToQueue(gitLabProjectId, gitLabPipelineId)

    // TODO: Don't sleep. This is just for debugging purposes.
    //       Redirect after parameters are stored to queue.
    await new Promise(r => setTimeout(r, 5000));

    // TODO: Redirect to dashboard (or login) instead
    // TODO: Remove this callback page from the browser history?
    window.location = "/";
}
