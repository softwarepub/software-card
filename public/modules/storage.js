function getDatabase() {
    return new Promise((resolve, reject) => {
        var open = indexedDB.open("Software CaRD", 1);

        open.onupgradeneeded = (event) => {
            var database = event.target.result;

            var pipelineQueue = database.createObjectStore("PipelineQueue", { autoIncrement: true });
            pipelineQueue.createIndex("PipelineIdIndex", ["pipelineId"]);
            pipelineQueue.createIndex("PipelineImportedIndex", ["imported"]);
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

function addPipelineToQueue(store, index, gitLabProjectId, gitLabPipelineId) {
    return new Promise((resolve, reject) => {
        var search = index.get([gitLabPipelineId]);

        search.onsuccess = (event) => {
            if (!event.target.result) {
                store.put({ projectId: gitLabProjectId, pipelineId: gitLabPipelineId, imported: false });
            }
            resolve();
        };

        search.onerror = (event) => { reject("Lookup of pipelineId failed") };
    });
}

async function registerPipeline(gitLabProjectId, gitLabPipelineId) {
    try {
        var database = await getDatabase();
        var queue = await getDatabaseStore(database, "PipelineQueue");
        var index = await getStoreIndex(queue, "PipelineIdIndex");
        addPipelineToQueue(queue, index, gitLabProjectId, gitLabPipelineId);
    } catch (error) {
        console.error(error)
    }
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

export { registerPipeline, deleteAllPipelines }
