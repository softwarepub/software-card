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
    
    const get_latest = parameters.get("latest");

    const gitLabPipelineId = parameters.get("gitlab_pipeline_id");
    const gitLabJobId = parameters.get("gitlab_job_id");

    if(get_latest != 1){
    await registerPipeline(gitLabProjectId, gitLabPipelineId, gitLabJobId);
    }

    if (showDebugInformation) {
        await new Promise(r => setTimeout(r, 5000));
    }

    const token = localStorage.getItem("gitlab-api-token");
    if (token) {
        if(get_latest==1){
            await latest(gitLabProjectId, token);
        }else{
        window.location = "../dashboard/";
        }
        return;
    } else {
        alert("Please set up the GitLab connection, then go to the dashboard!");
        window.location = "../gitlab-setup/";
        return;
    }

    
}

async function latest(projectId, token) {
    const jobResponse = await fetch(
        `https://codebase.helmholtz.cloud/api/v4/projects/${projectId}/jobs/`,
        { headers: { "Content-Type": "application/json", "PRIVATE-TOKEN": token } }
    );

    if (!jobResponse.ok) {
        alert("Fetching pipeline failed");
        return;
    }

    const jobData = await jobResponse.json();
    const jobId = jobData[0]["id"];
    const pipelineId = jobData[0]["pipeline"]["id"];
    
    window.location = `../callback?gitlab_project_id=${projectId}&gitlab_pipeline_id=${pipelineId}&gitlab_job_id=${jobId}&latest=2`;
    //gitlab_pipeline_id=618554&gitlab_job_id=2513432
}
