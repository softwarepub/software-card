function getDatabase() {
    return new Promise((resolve, reject) => {
        var open = indexedDB.open("Software CaRD", 1);

        open.onupgradeneeded = (event) => {
            var database = event.target.result;

            var pipelineQueue = database.createObjectStore("PipelineQueue", { autoIncrement: true });
            pipelineQueue.createIndex("PipelineIdIndex", ["pipelineId"]);

            var commentQueue = database.createObjectStore("CommentQueue", { autoIncrement: true });
            commentQueue.createIndex("CommentIdIndex", ["commentId"]);
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

function addCommentToQueue(queue, index, value, data, comment) {
    return new Promise((resolve,reject) => {
        queue.put({
            value: value,
            data: data,
            comment: comment,
            imported: false
        });     
        resolve(); 
        });
}

async function addComment(value, data, comment) {
    try {
        var database = await getDatabase();
        var queue = await getDatabaseStore(database, "CommentQueue");
        var index = await getStoreIndex(queue, "CommentIdIndex");
        addCommentToQueue(queue, index, value, data, comment);
    } catch (error) {
        console.error(error);
    }
}

function getUnregisteredCommentFromQueue(queue) {
    return new Promise((resolve, reject) => {
        var comments = queue.openCursor();

        comments.onsuccess = (event) => {

            const cursor = event.target.result;
            if (cursor) {
                const comment = cursor.value;

                cursor.delete();
                
                resolve(comment);
                return;
            }
            
            resolve(null);
        };

        comments.onerror = (event) => { reject("Search for unimported comments failed") };
    });
}

async function retrieveComment() {
    try {
        var database = await getDatabase();
        var queue = await getDatabaseStore(database, "CommentQueue");
        return getUnregisteredCommentFromQueue(queue);
    } catch (error) {
        console.error(error);
    }
    return null;
}

function deleteDatabase(name) {
    return new Promise((resolve, reject) => {
        var deletion = indexedDB.deleteDatabase(name);
        deletion.onsuccess = () => { resolve() }
        deletion.onerror = () => { reject("Database deletion failed") };
        deletion.onblocked = () => { reject("Database is blocked") };
    });
}

async function deleteAllComments() {
    try {
        await deleteDatabase("Software CaRD");
    } catch (error) {
        console.error(error);
    }
}

export { deleteAllComments as deleteAllPipelines, addComment, retrieveComment }
