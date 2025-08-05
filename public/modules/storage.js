function getDatabase() {
    return new Promise((resolve, reject) => {
        var open = indexedDB.open("Software CaRD", 1);

        open.onupgradeneeded = (event) => {
            var database = event.target.result;

            var pipelineQueue = database.createObjectStore("PipelineQueue", { autoIncrement: true });
            pipelineQueue.createIndex("PipelineIdIndex", ["pipelineId"]);

            // It would also be nice to have an index to return only entries where imported: false.
            // However, booleans are not valid keys. See:
            // https://w3c.github.io/IndexedDB/#key-construct
        };

        open.onerror = (event) => { reject("Couldn't open IndexedDB") };
        open.onsuccess = (event) => { resolve(event.target.result) };
    });
}

function getDatabaseStore(database, storeName) {
    return new Promise((resolve, reject) => {
        var transaction = database.transaction(storeName, "readwrite");
        var store = transaction.objectStore(storeName);
        resolve(store);
    });
}

function getStoreIndex(store, indexName) {
    return new Promise((resolve, reject) => {
        var index = store.index(indexName);
        resolve(index);
    });
}

function addPipelineToQueue(queue, index, gitLabProjectId, gitLabPipelineId, gitLabJobId) {
    return new Promise((resolve, reject) => {
        var search = index.get([gitLabPipelineId]);

        search.onsuccess = (event) => {
            if (!event.target.result) {
                queue.put({
                    projectId: gitLabProjectId,
                    pipelineId: gitLabPipelineId,
                    jobId: gitLabJobId,
                    imported: false
                });
            }
            resolve();
        };

        search.onerror = (event) => { reject("Lookup of pipelineId failed") };
    });
}

async function registerPipeline(gitLabProjectId, gitLabPipelineId, gitLabJobId) {
    try {
        var database = await getDatabase();
        var queue = await getDatabaseStore(database, "PipelineQueue");
        var index = await getStoreIndex(queue, "PipelineIdIndex");
        addPipelineToQueue(queue, index, gitLabProjectId, gitLabPipelineId, gitLabJobId);
    } catch (error) {
        console.error(error);
    }
}

function getUnregisteredPipelineFromQueue(queue) {
    return new Promise((resolve, reject) => {
        var pipelines = queue.getAll();

        pipelines.onsuccess = (event) => {
            for (const pipeline of event.target.result) {
                if (!pipeline.imported) {
                    resolve([pipeline.projectId, pipeline.pipelineId, pipeline.jobId]);
                }
            }
            resolve(null);
        };

        pipelines.onerror = (event) => { reject("Search for unimported pipelines failed") };
    });
}

async function retrievePipeline() {
    try {
        var database = await getDatabase();
        var queue = await getDatabaseStore(database, "PipelineQueue");
        return getUnregisteredPipelineFromQueue(queue);
    } catch (error) {
        console.error(error);
    }
    return new Promise();
}

function deleteDatabase(name) {
    return new Promise((resolve, reject) => {
        var deletion = indexedDB.deleteDatabase(name);
        deletion.onsuccess = () => { resolve() }
        deletion.onerror = () => { reject("Database deletion failed") };
        deletion.onblocked = () => { reject("Database is blocked") };
    });
}

async function deleteAllPipelines() {
    try {
        await deleteDatabase("Software CaRD");
    } catch (error) {
        console.error(error);
    }
}

export { registerPipeline, retrievePipeline, deleteAllPipelines }
