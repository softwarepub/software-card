import { addComment } from '../modules/storage.js'

export async function addToBatch(value, comment){
    addComment(value, comment);
}
