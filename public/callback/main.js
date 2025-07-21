window.onload = async function () {
    const parameters = new URL(window.location).searchParams;
    const technicalInformationTextArea = document.getElementById("technical-information");
    parameters.forEach(function (value, key, parent) {
        technicalInformationTextArea.value += key + ": " + value + "\n";
    });

    const gitLabProjectId = parameters.get("gitlab_project_id");
    const gitLabPipelineId = parameters.get("gitlab_pipeline_id");

    // ----------------- Database -----------------

    // This works on all devices/browsers, and uses IndexedDBShim as a final fallback
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

    // Open (or create) the database
    var open = indexedDB.open("Software CaRD", 1);

    // Create the schema
    open.onupgradeneeded = function () {
        var db = open.result;
        var store = db.createObjectStore("PipelineQueue", { autoIncrement: true });
        var index = store.createIndex("PipelineIndex", ["pipelineId"]);
    };

    open.onsuccess = function () {
        // Start a new transaction
        var db = open.result;
        var tx = db.transaction("PipelineQueue", "readwrite");
        var store = tx.objectStore("PipelineQueue");
        var index = store.index("PipelineIndex");

        // Add some data
        store.put({ projectId: gitLabProjectId, pipelineId: gitLabPipelineId })

        // Query the data
        var getExamplePipeline = index.get([gitLabPipelineId]);

        getExamplePipeline.onsuccess = function () {
            console.log(getExamplePipeline.result.projectId);
        };

        // Close the db when the transaction is done
        tx.oncomplete = function () {
            db.close();
        };
    }

    // ----------------- Database done -----------------

    // TODO: Don't sleep. This is just for debugging purposes.
    //       Redirect after parameters are stored to queue.
    await new Promise(r => setTimeout(r, 5000));

    // TODO: Redirect to dashboard (or login) instead
    // TODO: Remove this callback page from the browser history?
    window.location = "/";
}
