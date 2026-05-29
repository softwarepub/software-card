import { addComment } from '../modules/storage.js'

export async function addToBatch(value, data, comment){
    addComment(value, data, comment);
}
