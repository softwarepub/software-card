import { addComment } from '../modules/storage.js'

export async function addToBatch(value, data, comment){
    //TODO: Value is first of string right now
    addComment(value, data, comment);
}
