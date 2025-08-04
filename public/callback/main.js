import { registerPipeline } from '/modules/storage.js'

const showDebugInformation = false;

window.onload = async function () {
    const parameters = new URL(window.location).searchParams;

    if (showDebugInformation) {
        const technicalInformationTextArea = document.getElementById("technical-information");
        parameters.forEach(function (value, key, parent) {
            technicalInformationTextArea.value += key + ": " + value + "\n";
        });
    }

    const gitLabProjectId = parameters.get("gitlab_project_id");
    const gitLabPipelineId = parameters.get("gitlab_pipeline_id");

    await registerPipeline(gitLabProjectId, gitLabPipelineId);

    if (showDebugInformation) {
        await new Promise(r => setTimeout(r, 5000));
    }

    // TODO: Redirect to dashboard (or login) instead
    // TODO: Remove this callback page from the browser history?
    window.location = "/";
}
