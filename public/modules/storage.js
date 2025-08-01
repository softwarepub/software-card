
function getDatabase(callback) {
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

    var open = indexedDB.open("Software CaRD", 1);

    open.onupgradeneeded = (event) => {
        var database = event.target.result;

        var pipelineQueue = database.createObjectStore("PipelineQueue", { autoIncrement: true });
        var pipelineById = pipelineQueue.createIndex("PipelineIdIndex", ["pipelineId"]);
        var pipelineByImportedState = pipelineQueue.createIndex("PipelineImportedIndex", ["imported"]);
    };

    open.onerror = (event) => {
        console.error("Couldn't open IndexedDB");
    }

    open.onsuccess = (event) => {
        var database = event.target.result;
        callback(database);
    }
}

function addPipelineIdToQueue(gitLabProjectId, gitLabPipelineId) {
    getDatabase((database) => {
        var transaction = database.transaction("PipelineQueue", "readwrite");
        var store = transaction.objectStore("PipelineQueue");
        var index = store.index("PipelineIdIndex");

        var search = index.get([gitLabPipelineId])
        search.onsuccess = (event) => {
            if (!event.target.result) {
                store.put({ projectId: gitLabProjectId, pipelineId: gitLabPipelineId, imported: false })
            }
        }

        transaction.oncomplete = function () {
        database.close();
    };
    })
}

export { addPipelineIdToQueue }
