import { log } from "../loggs.js"
import {connect} from "mongoose"

export async function connectDb(uri){
await connect(uri);
log('info', 'MongoDB connected successfully.');
}