const mongoose= require('mongoose')
const { description } = require('../schema/schema')

const  projectSchema=new mongoose.Schema({

name:{
    type:String,

},
description:{
    type:String,
    
    },
    status:{
        type:String,
        enum:['Not started','inProgress ','completed']
        },
        clientId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Client'
        }





}

)
module.exports=mongoose.model("Project", projectSchema)