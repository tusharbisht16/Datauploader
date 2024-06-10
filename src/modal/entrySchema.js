import mongoose, { model } from "mongoose";



const entrySchema = new mongoose.Schema({
    id :{type:Number, unique:true},
    name : {type :String},
    age:{type :Number},
    city: {type:String},
    gender :{type :String}
})
export const Entry = model('Entry',entrySchema);
