window.onload = async function () {
    const parameters = new URL(window.location).searchParams;
    const technicalInformationTextArea = document.getElementById("technical-information");
    parameters.forEach(function (value, key, parent) {
        technicalInformationTextArea.value += key + ": " + value + "\n";
    });

    // TODO: Save the given query parameters in a queue
    const gitLabProjectId = parameters.get("gitlab_project_id");
    const gitLabPipelineId = parameters.get("gitlab_pipeline_id");
    if (gitLabProjectId && gitLabPipelineId) {

        const request = window.indexedDB.open("GitLabTasks", 2);
        request.onerror = (event) => {
            console.error(`Database error: ${event.target.error?.message}`);
        }
        request.onsuccess = (event) => {
            const db = event.target.result;

            const objectStore = db.createObjectStore("queue");

        };


    }

    // TODO: Don't sleep. This is just for debugging purposes.
    //       Redirect after parameters are stored to queue.
    await new Promise(r => setTimeout(r, 5000));

    // TODO: Redirect to dashboard (or login) instead
    // TODO: Remove this callback page from the browser history?
    window.location = "/";
}
