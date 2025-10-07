import { registerPipeline } from '../modules/storage.js'

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
    const gitLabJobId = parameters.get("gitlab_job_id");

    await registerPipeline(gitLabProjectId, gitLabPipelineId, gitLabJobId);

    if (showDebugInformation) {
        await new Promise(r => setTimeout(r, 5000));
    }

    const token = localStorage.getItem("gitlab-api-token");
    if (token) {
        window.location = "/dashboard/";
        return;
    } else {
        alert("Please set up the GitLab connection, then go to the dashboard!");
        window.location = "/gitlab-setup/";
        return;
    }
}
